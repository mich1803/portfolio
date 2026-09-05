---
title: "Blockchain ECDSA"
date: "2026-02-09"
author: "Michele Magrini, Francesco Marrocco e Leo Vincenzo Petrarca"
institution: "Sapienza Università di Roma"
description: "Una blockchain didattica basata su account che collega algebra delle curve ellittiche, firme ECDSA, mining proof of work, sincronizzazione tra nodi e un attacco riproducibile basato sul riutilizzo del nonce."
featured_description: "Una blockchain didattica che collega curve ellittiche, mining e attacchi crittografici."
tags:
  - "Crittografia a curva ellittica"
  - "Blockchain"
  - "ECDSA"
  - "Python"
  - "Sicurezza informatica"
external_url: "https://github.com/mich1803/ECDSA-Blockchain"
language: "it"
translation_status: "ai"
translation_of: "ecdsa-blockchain"
---

**ECDSA Blockchain**, chiamata anche **Minichain**, è una blockchain didattica sviluppata con Francesco Marrocco e Leo Vincenzo Petrarca come progetto finale del corso di **Foundations of Algebra and Geometry**, tenuto dal **Prof. Domenico Fiorenza**, nella laurea magistrale in Matematica Applicata presso Sapienza Università di Roma.

Il progetto costruisce un registro piccolo e ispezionabile, invece di trattare la blockchain come una scatola nera. Segue un modello ad account ispirato a Ethereum, firma le transazioni sulla curva ellittica secp256k1, raccoglie le transazioni in attesa in una mempool, esegue il mining dei blocchi con una regola proof of work semplificata e sincronizza più nodi locali tramite HTTP. Una modalità di firma volutamente vulnerabile dimostra poi che riutilizzare una sola volta un nonce ECDSA è sufficiente a esporre una chiave privata.

Si tratta di un sistema didattico, non di una criptovaluta destinata alla produzione. Il protocollo volutamente compatto rende visibili nel codice tutti i passaggi algebrici e le transizioni di stato.

## L'algebra alla base di un wallet

Il livello crittografico opera nel campo finito $\mathbb{F}_p$ sulla curva secp256k1

$$
E: y^2 \equiv x^3 + 7 \pmod p.
$$

I punti della curva, insieme al punto all'infinito, formano un gruppo abeliano. Un generatore standard $G$ ha ordine primo $n$. Una chiave privata è uno scalare diverso da zero

$$
d \in \{1,\ldots,n-1\},
$$

e la relativa chiave pubblica è il punto della curva

$$
Q = dG.
$$

Calcolare $Q$ a partire da $d$ è efficiente mediante raddoppi e somme ripetute di punti. Invertire l'operazione, cioè ricavare $d$ da $Q$ e $G$, è il problema del logaritmo discreto su curva ellittica su cui si basa la sicurezza della coppia di chiavi.

`minichain/crypto.py` delega a `coincurve` le operazioni sui punti di secp256k1. Le chiavi pubbliche sono memorizzate in forma compressa. Per ricavare un indirizzo, il codice espande la chiave pubblica, rimuove il prefisso `0x04`, calcola Keccak-256 e conserva gli ultimi 20 byte. Il risultato è un identificatore in stile Ethereum, qui rappresentato da 40 caratteri esadecimali minuscoli senza prefisso `0x`.

## Firma di una transazione con ECDSA

Prima della firma, il payload di una transazione viene serializzato come JSON canonico: le chiavi sono ordinate, i separatori sono fissi e il risultato è codificato in UTF-8. SHA-256 trasforma questi byte in un digest di 32 byte. Interpretando il digest come $z$, ECDSA sceglie un nuovo scalare segreto $k$ e calcola

$$
R = kG, \qquad r = x_R \bmod n,
$$

$$
s = k^{-1}(z + rd) \bmod n.
$$

La firma è la coppia $(r,s)$. Un verificatore usa la chiave pubblica $Q$ e calcola

$$
u_1 = zs^{-1} \bmod n, \qquad
u_2 = rs^{-1} \bmod n,
$$

quindi controlla che la coordinata $x$ di $u_1G + u_2Q$ coincida con $r$ modulo $n$. In questo modo dimostra che il firmatario conosceva $d$ senza trasmettere la chiave privata.

Il percorso normale usa `coincurve` per produrre una firma codificata in DER, mentre funzioni di supporto convertono tra DER e i valori esadecimali a larghezza fissa memorizzati nella transazione. La chiave pubblica compressa del mittente viaggia insieme alla transazione; la catena verifica la firma e ricava l'indirizzo del mittente dalla chiave, senza eseguire il recupero della chiave pubblica.

## Tre nonce per tre compiti diversi

L'implementazione distingue chiaramente tre quantità chiamate tutte *nonce*, ma destinate a problemi differenti:

- Il **nonce crittografico** $k$ è il segreto effimero di ECDSA. Non deve mai essere riutilizzato per messaggi diversi.
- Il **nonce dell'account** registra quante transazioni accettate ha inviato un account. Una transazione è valida soltanto quando il suo nonce coincide esattamente con lo stato corrente, impedendo che lo stesso trasferimento firmato venga applicato più volte.
- Il **nonce di mining** è un campo del blocco candidato. Un miner lo modifica finché l'hash del blocco soddisfa l'obiettivo proof of work.

Confondere questi concetti è pericoloso: il nonce dell'account protegge la semantica del registro, mentre la segretezza e l'unicità di $k$ proteggono la chiave di firma.

## Transazioni e stato globale

Il registro usa una mappa di stato

$$
\Sigma_t : \text{indirizzo} \longmapsto (\text{saldo},\text{nonce dell'account}).
$$

Una transazione contiene destinatario, valore intero positivo, nonce dell'account, timestamp, chiave pubblica del mittente, dati opzionali e firma ECDSA. `Transaction.payload_dict()` esclude la firma, così tutti i nodi calcolano l'hash dello stesso messaggio firmato.

Prima di accettare una transazione nella mempool, `Blockchain.check_tx_rules()` verifica che:

1. l'importo sia positivo;
2. la destinazione sia un indirizzo esadecimale di 20 byte;
3. la chiave pubblica e la firma ECDSA siano valide;
4. il nonce della transazione coincida con quello corrente dell'account del mittente;
5. il mittente disponga di fondi sufficienti.

La mempool rifiuta anche una seconda transazione in attesa con lo stesso mittente e nonce dell'account. L'applicazione di una transazione valida addebita il mittente, accredita il destinatario e incrementa soltanto il nonce del mittente. Le allocazioni di genesi inizializzano ogni nodo con gli stessi saldi deterministici e ciascun nodo salva catena e stato in un file JSON specifico per la propria porta.

## Blocchi e proof of work

Un blocco include nel proprio impegno indice, timestamp, transazioni, hash del blocco precedente, difficoltà, nonce di mining e proponente. Questi campi vengono serializzati in modo canonico e sottoposti a SHA-256. Il mining ha successo quando l'hash esadecimale inizia con `difficulty` zeri:

$$
H(\text{header}) < 16^{64-d},
$$

dove $d$ è il numero richiesto di zeri esadecimali iniziali. Per un hash uniforme, ogni tentativo ha probabilità $16^{-d}$ di successo e il numero atteso di tentativi è $16^d$.

`make_candidate_block()` preleva fino a 50 transazioni dalla mempool. `mine_block()` prova nonce interi successivi, con un limite predefinito di cinque milioni di tentativi. Prima di aggiungere un blocco estratto o ricevuto, ogni nodo controlla indice, hash precedente, hash ricalcolato, proof of work e tutte le transazioni. Gli aggiornamenti di stato vengono applicati a una copia temporanea, così una transazione non valida non può lasciare il registro parzialmente modificato. Una ricompensa di blocco didattica e configurabile accredita il proponente dopo la validazione.

## Un piccolo laboratorio peer-to-peer

Ogni nodo è un servizio Flask con endpoint per identità e catena, saldi e nonce degli account, invio delle transazioni, mining, ricezione dei blocchi e sincronizzazione. Transazioni e blocchi vengono inoltrati ai peer configurati quando possibile. L'endpoint `/sync` scarica le catene dei peer e ne adotta una più lunga soltanto dopo averla riprodotta e validata a partire dallo stato di genesi condiviso.

Il repository supporta un esperimento locale completo:

```text
wallet -> allocazione di genesi condivisa -> tre nodi Flask
       -> transazione firmata -> mempool dei peer
       -> blocco proof of work -> validazione e propagazione
       -> saldi e nonce degli account sincronizzati
```

Le utilità a riga di comando creano wallet e allocazioni di genesi, avviano i nodi, inviano transazioni ed eseguono uno scenario automatico di trasferimento, mining e sincronizzazione. Una console web blu per ciascun nodo espone le stesse operazioni nel browser.

Il progetto omette volutamente funzionalità da produzione come commissioni, gas, alberi di Merkle, trasporto autenticato tra peer, scelta dei fork per lavoro cumulativo e gestione di reti avversarie. La regola della catena più lunga confronta il numero di blocchi, non il lavoro totale. Queste semplificazioni rendono l'esperimento leggibile, ma spiegano anche perché non debba essere usato per proteggere beni reali.

## L'attacco con nonce debole

Il problema di sicurezza dimostrato dal progetto è concreto e interamente algebrico. Supponiamo che lo stesso $k$ firmi due digest differenti $z_1$ e $z_2$. Poiché entrambe le firme usano lo stesso punto $R=kG$, condividono lo stesso valore $r$:

$$
s_1 = k^{-1}(z_1 + rd) \bmod n,
$$

$$
s_2 = k^{-1}(z_2 + rd) \bmod n.
$$

Sottraendo le equazioni si elimina il termine della chiave privata. Chiunque osservi le firme può ricavare

$$
k = (z_1-z_2)(s_1-s_2)^{-1} \bmod n,
$$

e quindi

$$
d = (s_1k-z_1)r^{-1} \bmod n.
$$

`attacks/weak_nonce/make_weak_txs.py` implementa ECDSA esplicitamente con un valore $k$ scelto dal chiamante e crea due payload differenti firmati con lo stesso scalare. `recover_privkey.py` verifica che le firme condividano $r$, esegue le due inversioni modulari e ricava un indirizzo dalla chiave recuperata come controllo.

La dimostrazione nel browser rende osservabile l'attacco nell'intero registro. In modalità vulnerabile, la console utente firma una transazione, ne esegue il mining affinché il nonce dell'account avanzi e firma una seconda transazione con lo stesso nonce crittografico. La console rossa dell'attaccante analizza blocchi e mempool, raggruppa le firme per chiave pubblica e $r$ e recupera la chiave privata quando trova una coppia ripetuta.

La lezione va oltre questa catena didattica: una validazione corretta dei blocchi non può compensare una generazione difettosa delle firme. Basta riutilizzare una volta un segreto effimero per annullare la protezione unidirezionale della chiave pubblica su curva ellittica.

## Mappa dell'implementazione

- `minichain/crypto.py` gestisce chiavi secp256k1, hash, indirizzi, conversione DER, firma, verifica e recupero opzionale della chiave pubblica.
- `minichain/models.py` definisce rappresentazioni deterministiche di transazioni e blocchi.
- `minichain/chain.py` implementa stato degli account, validazione, mempool, proof of work, ricompense e sostituzione della catena.
- `minichain/node.py` fornisce persistenza, inoltro ai peer e API REST Flask.
- `scripts/` contiene strumenti per wallet, genesi, nodi, transazioni e scenari.
- `attacks/weak_nonce/` contiene il firmatario vulnerabile e il recupero algebrico della chiave.
- `webapp/` contiene la normale console utente e la visualizzazione per l'attaccante.
- `report/` contiene le relazioni complete in inglese e italiano e le slide della presentazione.

## Riferimenti

1. Magrini, M., Marrocco, F., and Petrarca, L. V. [ECDSA Blockchain: source code, reports, and demonstrations](https://github.com/mich1803/ECDSA-Blockchain). GitHub, 2026.
2. Standards for Efficient Cryptography Group. [SEC 2: Recommended Elliptic Curve Domain Parameters, Version 2.0](https://www.secg.org/sec2-v2.pdf), 2010.
3. National Institute of Standards and Technology. [FIPS 186-5: Digital Signature Standard](https://doi.org/10.6028/NIST.FIPS.186-5), 2023.
4. Pornin, T. [RFC 6979: Deterministic Usage of the Digital Signature Algorithm and ECDSA](https://www.rfc-editor.org/rfc/rfc6979), 2013.
5. Ethereum Foundation. [Ethereum accounts](https://ethereum.org/developers/docs/accounts/): account state, transaction nonces, keys, and address derivation.
6. Nakamoto, S. [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf), 2008.
