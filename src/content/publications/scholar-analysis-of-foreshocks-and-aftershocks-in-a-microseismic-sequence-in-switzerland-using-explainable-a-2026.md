---
title: "Analysis of Foreshocks and Aftershocks in a microseismic sequence in Switzerland using Explainable AI"
author: "Laura Laurenti, Verena Melanie Simon, Tania Andrea Toledo Zambrano, Toni Kraft, Men-Andrin Meier, Michele Magrini, Francesco Marrocco, Gabriele Paoletti, Elisa Tinti, Chris Marone"
date: "2026-03-14"
journal: "EGU26, 2026"
description: "A CNN distinguishes pre- and post-mainshock seismic traces, while SHAP identifies physically meaningful 30–40 Hz features linked to foreshock activity."
abstract: |
  Fault zone properties evolve throughout the seismic cycle, reflecting variations in stress conditions and progressive damage. Recent studies applying explainable machine learning to the 2016–2017 Norcia, central Italy, earthquake sequence have demonstrated that these temporal variations can be detected directly from seismic waveforms ([Laurenti et al. 2024](https://doi.org/10.1038/s41467-024-54153-w)). Here, we extend this approach to investigate whether similar signatures can be identified at a different spatial and magnitude scale.

  In this work, we study a microseismic sequence close to the village Diemtigen in central Switzerland that occurred between April 2014 to September 2015. The dataset includes 4 main events with magnitudes between ML 2.7 and 3.2, along with the earthquakes recorded before and after each main event. The high-resolution dataset was assembled using template-matching analysis ([Simon et al., 2021](https://doi.org/10.1029/2021GL093783)).

  We train a convolutional neural network (CNN) to classify foreshocks and aftershocks, and we use SHapley Additive exPlanations (SHAP) to interpret the results. The CNN is trained on spectrograms derived from raw waveforms. SHAP provides pixel-level attribution maps for each spectrogram, allowing us to identify which frequency-time components contribute most to the predictions. The CNN distinguishes between seismic traces before and after a main event, even if the waveform is pure seismic noise, without any earthquake recording. When classifying earthquake traces, SHAP analysis highlights key features in foreshocks in correspondence to the P-S arrival in the frequency range of 30-40 Hz. This observation is consistent with previous results from the Norcia earthquake sequence ([Magrini et al. 2026](https://doi.org/10.1007/978-3-032-10185-3_25)), where the same method identified comparable time-frequency features associated with foreshock activity.

  This framework offers new physics-based insight into the evolution of fault zones. It demonstrates the potential of Explainable AI to complement classical earthquake sequence analysis by revealing subtle, physically meaningful signatures directly from seismic data, and thereby bridging data-driven approaches with seismological understanding.
external_url: "https://meetingorganizer.copernicus.org/EGU26/EGU26-13268.html"
type: "Conference Contribution"
publication_key: "analysis-of-foreshocks-and-aftershocks-in-a-microseismic-sequence-in-switzerland-using-explainable-a-2026"
scholar_id: "_gx5hKUAAAAJ:u-x6o8ySG0sC"
cited_by: 0
source: "google-scholar"
---
