---
title: "The KISS"
date: "2026-05-26"
author: "Michele Magrini"
institution: "Sapienza Università di Roma"
description: "Un sistema auto-organizzante ispirato a Klimt che utilizza automi cellulari neurali per far crescere, rifinire, preservare e trasformare un'opera d'arte a partire da una singola cellula vivente."
featured_description: "Un automa cellulare neurale che fa crescere Il bacio di Klimt a partire da una singola cellula."
tags:
  - "Automi cellulari neurali"
  - "Deep learning"
  - "Sistemi auto-organizzanti"
  - "TensorFlow"
  - "JavaScript"
external_url: "https://github.com/mich1803/The-KISS"
demo_url: "https://mich1803.github.io/The-KISS/"
language: "it"
translation_status: "ai"
translation_of: "the-kiss"
---

**The KISS**, acronimo di Klimt-Inspired Self-organizing System, è un progetto universitario sviluppato per il corso di **Deep Learning and Applied Artificial Intelligence**, tenuto dal **Prof. Emanuele Rodolà**, durante il primo anno della mia laurea magistrale in Matematica Applicata presso Sapienza Università di Roma.

Il progetto si chiede se una regola locale appresa possa ricostruire e mantenere un'opera visivamente complessa. Invece di generare un'immagine in un singolo passaggio, un automa cellulare neurale aggiorna ripetutamente una griglia di cellule. Ogni cellula vede soltanto il proprio vicinato immediato, ma le dinamiche condivise producono un'immagine globale riconoscibile, ispirata a *Il bacio* di Gustav Klimt.

## Da una cellula a un'immagine

L'automa opera su una griglia `64 x 64` con `16` canali per cellula. I primi quattro canali rappresentano valori RGBA premoltiplicati; gli altri dodici funzionano come memoria nascosta che le cellule usano per comunicare e coordinarsi.

Lo stato iniziale non contiene alcuna immagine. Tutti i valori sono pari a zero, tranne quelli di una singola cellula vivente centrale, i cui canali alfa e nascosti vengono attivati. A partire da questo seme minimo, il sistema deve apprendere l'intero processo di crescita.

A ogni passaggio, ciascuna cellula:

1. percepisce il proprio stato corrente e i gradienti locali orizzontali e verticali mediante filtri identità e Sobel;
2. invia le caratteristiche risultanti a una rete neurale di aggiornamento condivisa `1 x 1`, con uno strato nascosto da 128 unità;
3. aggiunge la variazione di stato prevista soltanto quando viene selezionata da una maschera di aggiornamento stocastica;
4. rimane attiva soltanto quando è supportata dalla maschera di vita basata sul canale alfa.

Il fire rate predefinito è `0.5`, quindi a ogni iterazione si aggiorna soltanto un sottoinsieme casuale delle cellule. Questo comportamento asincrono rende le dinamiche apprese meno dipendenti da una griglia perfettamente sincronizzata.

## La pipeline in tre fasi

Il sistema finale separa crescita, rifinitura e trasformazione in tre modelli specializzati:

```text
singolo seme
    -> Modello 1: Crescita
    -> Modello 2: Miglioramento e persistenza
    -> Modello 3: Transizione e zoom
```

### Modello 1: Crescita

Il primo modello impara a ricostruire dal seme l'intero obiettivo ispirato a Klimt. L'addestramento utilizza un pool di `1024` stati intermedi e batch da `8`. Metà di ogni batch viene riportata al seme originale, mentre i campioni rimanenti sono estratti dal pool, così lo stesso modello deve apprendere sia la crescita iniziale sia la persistenza.

I rollout vengono campionati tra `64` e `256` passaggi. L'obiettivo combina una loss intermedia e una finale, con pesi rispettivamente `0.2` e `0.8`. La ricostruzione RGB riceve più peso di quella alfa (`2.5` contro `0.5`), mentre un termine di dettaglio basato sulla corrispondenza dei gradienti, con peso `0.15`, contrasta risultati troppo sfocati.

Questa fase ha mostrato la principale modalità di fallimento del progetto: un checkpoint può diventare efficace nel mantenere stati già sviluppati e allo stesso tempo dimenticare come crescere dal seme originale. Per questo motivo i rollout dal seme sono stati monitorati separatamente e l'addestramento è stato interrotto vicino all'ultimo checkpoint capace di conservare una crescita affidabile, intorno al passaggio `1200`.

### Modello 2: Miglioramento e persistenza

La seconda fase esegue il fine-tuning del modello di crescita selezionato per ottenere texture più definite e maggiore stabilità nel tempo. Una copia congelata del Modello 1 agisce da teacher e produce stati di input dopo un numero di passaggi compreso tra `64` e `256`. Lo student evolve poi questi stati per altri `128` fino a `512` passaggi.

L'obiettivo di rifinitura aumenta il peso RGB a `3.0`, riduce quello alfa a `0.35` e porta il termine di dettaglio a `0.20`. La regolarizzazione L2 standard (`1e-6`) controlla la dimensione dei parametri, mentre la regolarizzazione anchor (`1e-5`) mantiene lo student vicino al modello di crescita originale. Gli input generati dal teacher evitano di riempire un pool autogestito con stati instabili e aiutano a preservare il comportamento morfogenetico originale.

### Modello 3: Transizione e zoom

Il terzo modello viene addestrato da zero per trasformare lo stato completo dell'immagine in un secondo obiettivo incentrato sui volti. Il suo pool iniziale è generato dal Modello 2 dopo un numero di passaggi compreso tra `48` e `256`; durante l'addestramento, nuovi stati del Modello 2 possono sostituire una parte del batch. L'automa di transizione opera da `64` a `512` passaggi e usa loss RGB, alfa, di dettaglio e L2.

In questo modo l'output finale è una trasformazione tra stati, non un generatore di immagini separato: il modello di zoom riceve lo stato interno vivente dell'automa precedente e lo riorganizza verso l'obiettivo ravvicinato.

## Risultati degli esperimenti

Il risultato più importante riguarda il metodo. La sola loss di ricostruzione non è una misura sufficiente del successo di un modello auto-organizzante. Una loss più bassa sul pool può nascondere la perdita della capacità di crescita dal seme, quindi i rollout visivi dal seme e il comportamento su orizzonti lunghi devono essere valutati insieme all'obiettivo numerico.

Gli esperimenti hanno inoltre mostrato che:

- un peso RGB maggiore preserva la struttura cromatica dell'obiettivo;
- la loss di dettaglio basata sui gradienti riduce la sfocatura e migliora le transizioni locali;
- rollout più lunghi migliorano la persistenza, ma possono favorire la perdita della capacità di crescita;
- gli stati generati dal teacher stabilizzano la fase di miglioramento;
- un NCA separato può apprendere una transizione significativa tra due stati viventi dell'immagine.

## Simulazione nel browser

I modelli addestrati sono disponibili tramite un'applicazione web statica. I checkpoint Keras originali `.weights.h5` vengono convertiti in file JSON compatti contenenti i due kernel convoluzionali `1 x 1` e i relativi bias. Il runtime nel browser ricostruisce la rete di aggiornamento con typed array JavaScript, esegue la percezione Sobel e la maschera di vita basata sul canale alfa, quindi fa avanzare l'automa con `requestAnimationFrame`.

L'interfaccia offre:

- checkpoint di crescita debole e migliorata;
- controlli per avvio, pausa e riavvio;
- numero configurabile di passaggi per frame;
- selezione del fire rate, incluso il valore predefinito di addestramento `0.5`;
- contatore dei passaggi in tempo reale;
- transizione appresa con zoom verso i volti.

Poiché la simulazione è implementata come sito statico, viene eseguita interamente nel browser senza backend.

## Riproducibilità e sviluppo

Il repository contiene un notebook Colab per ogni fase di addestramento, le immagini obiettivo, i log delle loss, visualizzazioni intermedie del pool, i checkpoint Keras esportati, l'utilità di conversione da H5 a JSON e l'applicazione web statica completa.

Strumenti assistiti dall'intelligenza artificiale sono stati utilizzati per la ricerca bibliografica, il refactoring del codice, l'ideazione degli esperimenti, la sintesi degli articoli, la revisione della relazione e lo sviluppo dell'interfaccia web. Gli esperimenti, il codice, i risultati e le conclusioni finali sono stati verificati dall'autore.

## Riferimenti

1. Mordvintsev, A., Randazzo, E., Niklasson, E., and Levin, M. [Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/). *Distill*, 5(2):e23, 2020. DOI: [10.23915/distill.00023](https://doi.org/10.23915/distill.00023).
2. Mordvintsev, A., Randazzo, E., Niklasson, E., Levin, M., and Greydanus, S. [Differentiable Self-organizing Systems](https://distill.pub/2020/selforg/). *Distill*, 2020.
3. Niklasson, E., Mordvintsev, A., Randazzo, E., and Levin, M. [Self-Organising Textures](https://distill.pub/selforg/2021/textures/). *Distill*, 2021. DOI: [10.23915/distill.00027.003](https://doi.org/10.23915/distill.00027.003).
4. Magrini, M. [The KISS: source code, training notebooks, checkpoints, and project report](https://github.com/mich1803/The-KISS). GitHub, 2026.
