---
title: "Analisi di foreshock e aftershock in una sequenza microsismica in Svizzera mediante intelligenza artificiale spiegabile"
author: "Laura Laurenti, Verena Melanie Simon, Tania Andrea Toledo Zambrano, Toni Kraft, Men-Andrin Meier, Michele Magrini, Francesco Marrocco, Gabriele Paoletti, Elisa Tinti, Chris Marone"
date: "2026-03-14"
journal: "EGU26, 2026"
description: "Una CNN distingue le tracce sismiche precedenti e successive al mainshock, mentre SHAP individua caratteristiche fisicamente significative tra 30 e 40 Hz legate all'attività dei foreshock."
abstract: |
  Le proprietà delle zone di faglia evolvono durante il ciclo sismico, riflettendo variazioni nelle condizioni di stress e un danneggiamento progressivo. Studi recenti, che applicano il machine learning spiegabile alla sequenza sismica di Norcia del 2016 e 2017 nell'Italia centrale, hanno dimostrato che queste variazioni temporali possono essere rilevate direttamente dalle forme d'onda sismiche ([Laurenti et al. 2024](https://doi.org/10.1038/s41467-024-54153-w)). In questo lavoro estendiamo l'approccio per verificare se firme simili possano essere riconosciute a una scala spaziale e di magnitudo differente.

  Studiamo una sequenza microsismica vicina al villaggio di Diemtigen, nella Svizzera centrale, avvenuta tra aprile 2014 e settembre 2015. Il dataset include 4 eventi principali con magnitudo comprese tra ML 2.7 e 3.2, insieme ai terremoti registrati prima e dopo ciascun evento principale. Il dataset ad alta risoluzione è stato costruito mediante un'analisi di template matching ([Simon et al., 2021](https://doi.org/10.1029/2021GL093783)).

  Addestriamo una rete neurale convoluzionale (CNN) a classificare foreshock e aftershock e usiamo SHapley Additive exPlanations (SHAP) per interpretarne i risultati. La CNN viene addestrata su spettrogrammi ottenuti dalle forme d'onda grezze. SHAP fornisce mappe di attribuzione a livello dei singoli pixel, permettendo di individuare le componenti nel dominio tempo-frequenza che contribuiscono maggiormente alle previsioni. La CNN distingue le tracce sismiche precedenti e successive a un evento principale anche quando la forma d'onda contiene soltanto rumore sismico e non registra alcun terremoto. Nella classificazione delle tracce di terremoto, l'analisi SHAP evidenzia caratteristiche chiave dei foreshock in corrispondenza degli arrivi P-S, nella banda di frequenza tra 30 e 40 Hz. L'osservazione è coerente con i risultati precedenti ottenuti sulla sequenza di Norcia ([Magrini et al. 2026](https://doi.org/10.1007/978-3-032-10185-3_25)), dove lo stesso metodo ha individuato caratteristiche tempo-frequenza comparabili associate all'attività dei foreshock.

  Questo metodo offre nuove informazioni, fondate sulla fisica, sull'evoluzione delle zone di faglia. Dimostra il potenziale dell'intelligenza artificiale spiegabile nel completare l'analisi classica delle sequenze sismiche, rivelando direttamente nei dati firme sottili e fisicamente significative e collegando così gli approcci basati sui dati alla comprensione sismologica.
external_url: "https://meetingorganizer.copernicus.org/EGU26/EGU26-13268.html"
type: "Contributo a conferenza"
language: "it"
translation_status: "ai"
translation_of: "scholar-analysis-of-foreshocks-and-aftershocks-in-a-microseismic-sequence-in-switzerland-using-explainable-a-2026"
---
