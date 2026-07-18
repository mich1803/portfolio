---
title: "ECDSA Blockchain"
date: "2026-02-09"
author: "Michele Magrini, Francesco Marrocco, and Leo Vincenzo Petrarca"
institution: "Sapienza University of Rome"
description: "An educational account-based blockchain that connects elliptic-curve algebra, ECDSA signatures, proof-of-work mining, peer synchronization, and a reproducible nonce-reuse attack."
featured_description: "An educational blockchain connecting elliptic curves, mining, and cryptographic attacks."
tags:
  - "Elliptic-Curve Cryptography"
  - "Blockchain"
  - "ECDSA"
  - "Python"
  - "Cybersecurity"
external_url: "https://github.com/mich1803/ECDSA-Blockchain"
---

**ECDSA Blockchain**, also called **Minichain**, is an educational blockchain developed with Francesco Marrocco and Leo Vincenzo Petrarca as the final project for the **Foundations of Algebra and Geometry** course, taught by **Prof. Domenico Fiorenza**, in the Master's degree in Applied Mathematics at Sapienza University of Rome.

The project builds a small, inspectable ledger instead of treating a blockchain as a black box. It follows an Ethereum-inspired account model, signs transactions on the secp256k1 elliptic curve, collects pending transactions in a mempool, mines blocks with a simplified proof-of-work rule, and synchronizes several local nodes over HTTP. A deliberately vulnerable signing mode then demonstrates how reusing one ECDSA nonce is enough to expose a private key.

This is a teaching system, not a production cryptocurrency. Its deliberately compact protocol makes every algebraic and state transition visible in the code.

## The algebra behind a wallet

The cryptographic layer works in the finite field $\mathbb{F}_p$ on the secp256k1 curve

$$
E: y^2 \equiv x^3 + 7 \pmod p.
$$

The points on this curve, together with the point at infinity, form an abelian group. A standard generator $G$ has prime order $n$. A private key is a non-zero scalar

$$
d \in \{1,\ldots,n-1\},
$$

and its public key is the curve point

$$
Q = dG.
$$

Computing $Q$ from $d$ is efficient through repeated point doubling and addition. Reversing the operation - recovering $d$ from $Q$ and $G$ - is the elliptic-curve discrete logarithm problem on which the security of the key pair relies.

`minichain/crypto.py` delegates secp256k1 point operations to `coincurve`. Public keys are stored in compressed form. To derive an address, the code expands the public key, removes its `0x04` prefix, computes Keccak-256, and retains the last 20 bytes. The result is an Ethereum-style identifier, represented here as 40 lowercase hexadecimal characters without a `0x` prefix.

## Signing a transaction with ECDSA

Before signing, a transaction payload is serialized as canonical JSON: keys are sorted, separators are fixed, and the result is encoded as UTF-8. SHA-256 maps those bytes to a 32-byte digest. If the digest is interpreted as $z$, ECDSA chooses a fresh secret scalar $k$ and computes

$$
R = kG, \qquad r = x_R \bmod n,
$$

$$
s = k^{-1}(z + rd) \bmod n.
$$

The signature is the pair $(r,s)$. A verifier uses the public key $Q$ and computes

$$
u_1 = zs^{-1} \bmod n, \qquad
u_2 = rs^{-1} \bmod n,
$$

then checks whether the $x$-coordinate of $u_1G + u_2Q$ agrees with $r$ modulo $n$. This proves that the signer knew $d$ without transmitting the private key.

The normal path uses `coincurve` to produce a DER-encoded signature, while helper functions convert between DER and the fixed-width hexadecimal values stored in a transaction. The sender's compressed public key travels with the transaction; the chain verifies the signature and derives the sender address from that key instead of performing public-key recovery.

## Three nonces, three different jobs

The implementation makes a useful distinction between quantities that are all called a *nonce* but solve different problems:

- The **cryptographic nonce** $k$ is the ephemeral ECDSA secret. It must never be reused across different messages.
- The **account nonce** records how many accepted transactions an account has sent. A transaction is valid only when its nonce exactly matches the current state, preventing the same signed transfer from being applied repeatedly.
- The **mining nonce** is a field in a candidate block. A miner changes it until the block hash satisfies the proof-of-work target.

Confusing these concepts is dangerous: the account nonce protects ledger semantics, whereas secrecy and uniqueness of $k$ protect the signing key itself.

## Transactions and global state

The ledger uses a state map

$$
\Sigma_t : \text{address} \longmapsto (\text{balance},\text{account nonce}).
$$

A transaction contains a recipient, positive integer value, account nonce, timestamp, sender public key, optional data, and an ECDSA signature. `Transaction.payload_dict()` excludes the signature itself so that all nodes hash the same signed message.

Before a transaction enters the mempool, `Blockchain.check_tx_rules()` verifies that:

1. the amount is positive;
2. the destination is a 20-byte hexadecimal address;
3. the public key and ECDSA signature are valid;
4. the transaction nonce equals the sender's current account nonce;
5. the sender has sufficient funds.

The mempool also rejects another pending transaction with the same sender and account nonce. Applying a valid transaction debits the sender, credits the recipient, and increments only the sender's account nonce. Genesis allocations initialize every node from the same deterministic balances, and each node persists its chain and state in a port-specific JSON file.

## Blocks and proof of work

A block commits to its index, timestamp, transactions, previous block hash, difficulty, mining nonce, and proposer. These fields are canonically serialized and hashed with SHA-256. A block is mined when its hexadecimal hash begins with `difficulty` zeroes:

$$
H(\text{header}) < 16^{64-d},
$$

where $d$ is the number of required leading hexadecimal zeroes. A uniformly distributed hash succeeds with probability $16^{-d}$ on each attempt, so the expected number of trials is $16^d$.

`make_candidate_block()` takes up to 50 transactions from the mempool. `mine_block()` tries successive integer nonces, with a default cap of five million attempts. Before appending a mined or received block, each node checks the index, previous hash, recomputed hash, proof of work, and every transaction. State updates are applied to a snapshot so that one invalid transaction cannot leave a partially modified ledger. A configurable toy block reward credits the proposer after successful validation.

## A small peer-to-peer laboratory

Each node is a Flask service with endpoints for its identity and chain, account balances and nonces, transaction submission, mining, block reception, and synchronization. Transactions and blocks are relayed to configured peers on a best-effort basis. The `/sync` endpoint downloads peer chains and adopts a longer one only after replaying and validating it from the shared genesis state.

The repository supports a complete local experiment:

```text
wallets -> shared genesis allocation -> three Flask nodes
        -> signed transaction -> peer mempools
        -> proof-of-work block -> validation and propagation
        -> synchronized balances and account nonces
```

CLI utilities create wallets and genesis allocations, start nodes, submit transactions, and run an automatic transfer-mining-synchronization scenario. A blue per-node web console exposes the same actions through a browser.

The design intentionally omits production features such as fees, gas, Merkle trees, authenticated peer transport, cumulative-work fork choice, and adversarial network handling. Its longest-chain rule compares block counts, not total work. These simplifications keep the experiment legible, but they are also why it must not be used to secure real assets.

## The weak-nonce attack

The security failure demonstrated by the project is concrete and entirely algebraic. Suppose the same $k$ signs two different digests $z_1$ and $z_2$. Because both signatures use the same point $R=kG$, they have the same value $r$:

$$
s_1 = k^{-1}(z_1 + rd) \bmod n,
$$

$$
s_2 = k^{-1}(z_2 + rd) \bmod n.
$$

Subtracting the equations eliminates the private key term. Anyone observing the signatures can recover

$$
k = (z_1-z_2)(s_1-s_2)^{-1} \bmod n,
$$

and then

$$
d = (s_1k-z_1)r^{-1} \bmod n.
$$

`attacks/weak_nonce/make_weak_txs.py` implements ECDSA explicitly with a caller-selected $k$ and creates two different signed payloads with that same scalar. `recover_privkey.py` verifies that the signatures share $r$, performs the two modular inversions above, and derives an address from the recovered key as a check.

The browser demonstration makes the attack observable across the ledger. In vulnerable mode, the user console signs one transaction, mines it so the account nonce advances, and signs a second transaction with the same cryptographic nonce. The red attacker console scans both blocks and the mempool, groups signatures by public key and $r$, and recovers the private key when it finds a repeated pair.

The lesson is broader than this toy chain: correct block validation cannot compensate for broken signature generation. A single reused ephemeral secret collapses the one-way protection of the elliptic-curve public key.

## Implementation map

- `minichain/crypto.py` handles secp256k1 keys, hashes, addresses, DER conversion, signing, verification, and optional public-key recovery.
- `minichain/models.py` defines deterministic transaction and block representations.
- `minichain/chain.py` implements account state, validation, the mempool, proof of work, rewards, and chain replacement.
- `minichain/node.py` provides persistence, peer relay, and the Flask REST API.
- `scripts/` contains wallet, genesis, node, transaction, and scenario tools.
- `attacks/weak_nonce/` contains the vulnerable signer and algebraic key recovery.
- `webapp/` contains the normal user console and the attacker visualization.
- `report/` contains the complete English and Italian reports and presentation slides.

## References

1. Magrini, M., Marrocco, F., and Petrarca, L. V. [ECDSA Blockchain: source code, reports, and demonstrations](https://github.com/mich1803/ECDSA-Blockchain). GitHub, 2026.
2. Standards for Efficient Cryptography Group. [SEC 2: Recommended Elliptic Curve Domain Parameters, Version 2.0](https://www.secg.org/sec2-v2.pdf), 2010.
3. National Institute of Standards and Technology. [FIPS 186-5: Digital Signature Standard](https://doi.org/10.6028/NIST.FIPS.186-5), 2023.
4. Pornin, T. [RFC 6979: Deterministic Usage of the Digital Signature Algorithm and ECDSA](https://www.rfc-editor.org/rfc/rfc6979), 2013.
5. Ethereum Foundation. [Ethereum accounts](https://ethereum.org/developers/docs/accounts/): account state, transaction nonces, keys, and address derivation.
6. Nakamoto, S. [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf), 2008.
