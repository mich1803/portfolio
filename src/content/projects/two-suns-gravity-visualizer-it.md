---
title: "Visualizzatore gravitazionale a due soli"
date: "2025-08-12"
author: "Michele Magrini"
description: "Un renderer interattivo dei bacini di attrazione che lancia una particella di prova da ogni pixel dell'immagine e colora il risultato in base a quale dei due soli fissi la cattura."
featured_description: "Un visualizzatore di bacini gravitazionali che trasforma simulazioni orbitali in sfondi generativi."
tags:
  - "Fisica computazionale"
  - "Sistemi dinamici"
  - "Simulazione numerica"
  - "JavaScript"
  - "Python"
external_url: "https://github.com/mich1803/Two-Suns-Gravity-Visualizer"
demo_url: "https://mich1803.github.io/Two-Suns-Gravity-Visualizer/"
language: "it"
translation_status: "ai"
translation_of: "two-suns-gravity-visualizer"
---

**Two Suns Gravity Visualizer** trasforma un semplice esperimento gravitazionale in arte generativa. Due soli sono fissi su un piano. Da ogni pixel di un'immagine viene rilasciata da ferma una particella di prova, ogni traiettoria viene integrata in avanti e il pixel assume il colore del sole che alla fine cattura la particella.

Il risultato è una **mappa dei bacini di attrazione**: un'immagine globale composta da centinaia di migliaia di problemi ai valori iniziali indipendenti. Le regioni uniformi indicano condizioni iniziali vicine con lo stesso esito, mentre i bordi intricati mostrano zone in cui un piccolo spostamento può cambiare il sole vincitore. Spostando i soli, modificando le proporzioni della tela e scegliendo una palette di colori, l'applicazione nel browser può generare immagini ad alta risoluzione adatte come sfondi.

## Il modello fisico

Siano i due soli fissi nelle posizioni $\mathbf r_1$ e $\mathbf r_2$, e sia $\mathbf r(t)$ la posizione di una particella di prova di massa unitaria. La simulazione usa sorgenti di uguale massa e coordinate dei pixel adimensionali. L'accelerazione è

$$
\ddot{\mathbf r}
= G\left(
\frac{\mathbf r_1-\mathbf r}{\|\mathbf r_1-\mathbf r\|^3}
+
\frac{\mathbf r_2-\mathbf r}{\|\mathbf r_2-\mathbf r\|^3}
\right).
$$

Questa è la legge dell'inverso del quadrato in forma vettoriale: il numeratore punta verso un sole, mentre la divisione per il cubo della distanza lascia un'accelerazione di intensità proporzionale a $1/r^2$. Il parametro $G$ combina la costante gravitazionale e la massa della sorgente in un'unica intensità regolabile.

Ogni coordinata dell'immagine $(x,y)$ diventa una condizione iniziale

$$
\mathbf r(0)=(x,y), \qquad \dot{\mathbf r}(0)=\mathbf 0.
$$

I due corpi primari rimangono fissi e non si attraggono né orbitano l'uno intorno all'altro. Il modello è quindi un problema stilizzato a centri fissi, non una simulazione fisica completa del problema dei tre corpi. È progettato per mostrare una struttura geometrica, non per prevedere un sistema astronomico.

## Come si forma l'immagine

Per ogni pixel iniziale, il risolutore pone una domanda binaria: la traiettoria entra prima nel disco di cattura del sole 1 o del sole 2? Tutte le posizioni iniziali che producono la stessa risposta formano il bacino di attrazione di quel sole.

Vicino a un sole, l'attrazione locale è in genere decisiva. Tra i soli e intorno al bordo dei bacini, invece, una particella può accelerare verso un centro, superarlo, attraversare il campo concorrente ed essere catturata in seguito dall'altro. Pixel vicini possono quindi descrivere percorsi molto diversi prima di ricevere colori differenti. L'immagine finale registra gli esiti senza disegnare le traiettorie.

La gravità di masse puntiformi pure è singolare nella posizione esatta di un sole. L'implementazione regolarizza le distanze al quadrato,

$$
r_i^2 \longleftarrow r_i^2 + \varepsilon,
$$

prima di calcolare $r_i^{-3}$. Il valore predefinito $\varepsilon=10^{-6}$ evita la divisione per zero e limita l'overflow numerico senza ingrandire visibilmente i soli.

## Integrazione numerica

L'equazione del secondo ordine viene rappresentata come sistema del primo ordine

$$
\dot{\mathbf r}=\mathbf v, \qquad
\dot{\mathbf v}=\mathbf a(\mathbf r).
$$

Ogni traiettoria viene fatta avanzare con il metodo di Eulero semi-implicito, detto anche Eulero simplettico:

$$
\mathbf v_{j+1}=\mathbf v_j+\mathbf a(\mathbf r_j)\,\Delta t,
$$

$$
\mathbf r_{j+1}=\mathbf r_j+\mathbf v_{j+1}\,\Delta t.
$$

L'aggiornamento della posizione con la nuova velocità è la differenza fondamentale rispetto al metodo di Eulero in avanti. È economico e in genere si comporta meglio per il moto hamiltoniano, quindi rappresenta un buon compromesso quando lo stesso aggiornamento deve essere applicato centinaia di volte a ogni pixel.

Il renderer Python predefinito usa $G=6000$, $\Delta t=0.4$, un raggio di cattura di 3 pixel e un massimo di 800 passaggi. La versione per browser usa le stesse costanti fisiche e lo stesso raggio di cattura, con un limite di 700 passaggi. Se una particella entra in entrambi i dischi di cattura nello stesso passaggio, vince il sole più vicino. Se non entra in nessuno dei due dischi entro il limite, viene assegnata al sole più vicino nella posizione simulata finale. Questa regola garantisce un colore a ogni pixel, ma va interpretata come criterio di rendering e non come cattura fisica dimostrata.

I parametri rendono visibile anche la natura numerica dell'immagine. Passi temporali più grandi sono più veloci, ma possono oltrepassare un disco di cattura piccolo; passi più piccoli risolvono meglio gli incontri ravvicinati, ma aumentano il tempo di rendering. Il raggio di cattura e il numero massimo di passaggi modificano la classificazione delle traiettorie difficili. Il bordo generato dipende quindi sia dal modello dinamico sia dalla sua risoluzione numerica.

## Una simulazione per ogni pixel

Per un'immagine di larghezza $W$, altezza $H$ e al massimo $S$ passaggi di integrazione, l'algoritmo diretto esegue $O(WHS)$ aggiornamenti delle particelle. Le due implementazioni organizzano il lavoro in modo diverso.

### Renderer Python

`two_suns.py` usa array NumPy con la stessa forma dell'immagine. Posizione, velocità, stato di assegnazione e vincitore sono memorizzati contemporaneamente per ogni pixel. A ogni passaggio di integrazione vengono calcolate entrambe le accelerazioni gravitazionali mediante operazioni vettoriali sugli array. Maschere booleane classificano le nuove catture e il ciclo termina in anticipo quando tutte le particelle sono state assegnate.

Dopo la simulazione, due maschere associano l'array dei vincitori ai colori RGB scelti. Pillow salva l'array `uint8` risultante come PNG, mentre `tqdm` mostra l'avanzamento. Le opzioni da riga di comando espongono dimensioni dell'output, coordinate dei soli, colori, $G$, passo temporale, raggio di cattura, limite di passaggi, regolarizzazione e nome del file, rendendo il renderer adatto a esperimenti automatizzati ad alta risoluzione.

### Renderer nel browser

L'applicazione web consiste in un singolo `index.html` statico senza backend. JavaScript memorizza posizioni e velocità in buffer `Float32Array` e i vincitori in un `Uint8Array`. Un ciclo annidato fa avanzare soltanto le particelle il cui vincitore è ancora zero. Terminata la classificazione, il codice scrive valori RGBA in `ImageData` e disegna il risultato su un canvas HTML.

L'interfaccia permette di:

- scegliere larghezza e altezza tra 50 e 1200 pixel;
- selezionare colori indipendenti per i due bacini;
- posizionare i soli con due clic sul canvas;
- eseguire il rendering e vedere l'anteprima della classificazione;
- ripristinare le posizioni dei soli;
- esportare il canvas come `two-suns-basins.png`.

I marcatori dei soli vengono disegnati sopra il risultato, così le loro posizioni rimangono visibili. Poiché tutto il calcolo avviene localmente nel browser, gli stessi file statici possono essere pubblicati direttamente con GitHub Pages. Tele di grandi dimensioni richiedono proporzionalmente più memoria e calcolo, quindi i rendering in formato sfondo possono richiedere molto più tempo delle piccole anteprime.

## Dalla dinamica agli sfondi

Il visualizzatore è volutamente scientifico e giocoso. Un flusso di lavoro efficace consiste nel provare la geometria a una risoluzione contenuta, regolare i due centri fino a ottenere un bordo ben bilanciato, scegliere una palette sobria di due colori e ripetere il rendering con le proporzioni dello schermo di destinazione. L'esportazione PNG conserva le dimensioni reali in pixel del canvas, non quelle responsive visualizzate sullo schermo.

Posizioni simmetriche dei soli producono campi simmetrici, ma la simmetria dell'immagine finale dipende anche dalla griglia rettangolare dei pixel e dalle regole per risolvere i pareggi. Disposizioni asimmetriche creano ampie regioni e bordi decentrati particolarmente adatti alla composizione di uno sfondo. L'immagine non è una texture sovrapposta a una simulazione: ogni pixel colorato rappresenta l'esito registrato della propria traiettoria numerica.

## Mappa dell'implementazione

- `index.html` contiene l'applicazione interattiva completa, il risolutore basato su typed array, il renderer canvas, i controlli e l'esportazione PNG.
- `two_suns.py` è il renderer configurabile da riga di comando basato su NumPy e Pillow.
- `preview.ipynb` è un notebook per sperimentare con il modello.
- `basins.png` e `media/header.png` contengono esempi generati dal sistema.

## Riferimenti

1. Magrini, M. [Two Suns Gravity Visualizer: source code and browser application](https://github.com/mich1803/Two-Suns-Gravity-Visualizer). GitHub, 2025.
2. Newton, I. *Philosophiae Naturalis Principia Mathematica*, Book I, 1687. English translation available through the [Internet Archive](https://archive.org/details/newtonspmathema00newtrich).
3. Hairer, E., Lubich, C., and Wanner, G. [Geometric Numerical Integration: Structure-Preserving Algorithms for Ordinary Differential Equations](https://doi.org/10.1007/3-540-30666-8), 2nd ed., Springer, 2006.
4. Grebogi, C., Ott, E., and Yorke, J. A. [Fractal basin boundaries, long-lived chaotic transients, and unstable-unstable pair bifurcation](https://doi.org/10.1016/0167-2789(83)90212-X). *Physica D*, 7(1-3), 181-200, 1983.
