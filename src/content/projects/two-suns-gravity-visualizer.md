---
title: "Two Suns Gravity Visualizer"
date: "2025-08-12"
author: "Michele Magrini"
description: "An interactive basin-of-attraction renderer that launches a test particle from every image pixel and colors the result by which of two fixed suns captures it."
tags:
  - "Computational Physics"
  - "Dynamical Systems"
  - "Numerical Simulation"
  - "JavaScript"
  - "Python"
external_url: "https://github.com/mich1803/Two-Suns-Gravity-Visualizer"
demo_url: "https://mich1803.github.io/Two-Suns-Gravity-Visualizer/"
---

**Two Suns Gravity Visualizer** turns a simple gravitational experiment into generative art. Two suns are fixed on a plane. A test particle is released from rest at every pixel of an image, each trajectory is integrated forward, and the pixel receives the color of the sun that eventually captures its particle.

The result is a **basin-of-attraction map**: a global picture assembled from hundreds of thousands of independent initial-value problems. Smooth regions indicate nearby initial conditions with the same outcome, while intricate boundaries reveal places where a small displacement can change the winning sun. By moving the suns, changing the canvas proportions, and selecting a color palette, the browser app can generate high-resolution images suitable for wallpapers.

## The physical model

Let the two fixed suns be at positions $\mathbf r_1$ and $\mathbf r_2$, and let a unit-mass test particle have position $\mathbf r(t)$. The simulation uses equal source masses and dimensionless pixel coordinates. Its acceleration is

$$
\ddot{\mathbf r}
= G\left(
\frac{\mathbf r_1-\mathbf r}{\|\mathbf r_1-\mathbf r\|^3}
+
\frac{\mathbf r_2-\mathbf r}{\|\mathbf r_2-\mathbf r\|^3}
\right).
$$

This is the inverse-square law in vector form: the numerator points toward a sun, while division by the cube of the distance leaves an acceleration magnitude proportional to $1/r^2$. The parameter $G$ combines the gravitational constant and source mass into one tunable strength.

Every image coordinate $(x,y)$ becomes an initial condition

$$
\mathbf r(0)=(x,y), \qquad \dot{\mathbf r}(0)=\mathbf 0.
$$

The two primaries remain fixed and do not attract or orbit one another. The model is therefore a stylized fixed-center problem rather than a full physical three-body simulation. It is designed to expose geometric structure, not to predict an astronomical system.

## Why the picture forms

For each starting pixel, the solver asks a binary question: does the trajectory first enter the capture disk around sun 1 or sun 2? All starting positions that produce the same answer form that sun's basin of attraction.

Near a sun, the local pull is usually decisive. Between the suns and around the basin boundary, however, a particle can accelerate toward one center, overshoot it, swing through the competing field, and later be captured by the other. Neighboring pixels may therefore trace very different paths before receiving different colors. The final image records outcomes rather than drawing the trajectories themselves.

Pure point-mass gravity is singular at a sun's exact position. The implementation softens the squared distances,

$$
r_i^2 \longleftarrow r_i^2 + \varepsilon,
$$

before evaluating $r_i^{-3}$. The default $\varepsilon=10^{-6}$ prevents division by zero and limits numerical overflow without visibly enlarging the suns.

## Numerical integration

The second-order equation is represented as the first-order system

$$
\dot{\mathbf r}=\mathbf v, \qquad
\dot{\mathbf v}=\mathbf a(\mathbf r).
$$

Each trajectory is advanced with semi-implicit Euler, also called symplectic Euler:

$$
\mathbf v_{j+1}=\mathbf v_j+\mathbf a(\mathbf r_j)\,\Delta t,
$$

$$
\mathbf r_{j+1}=\mathbf r_j+\mathbf v_{j+1}\,\Delta t.
$$

Updating position with the new velocity is the defining difference from forward Euler. It is inexpensive and is generally better behaved for Hamiltonian motion, making it a useful compromise when the same update must be applied to every pixel many hundreds of times.

The default Python renderer uses $G=6000$, $\Delta t=0.4$, a capture radius of 3 pixels, and at most 800 steps. The browser version uses the same physical constants and capture radius with a 700-step limit. If a particle enters both capture disks in one step, the closer sun wins. If it never enters either disk before the limit, it is assigned to whichever sun is nearer at its final simulated position. This fallback guarantees that every output pixel receives a color, although it should be interpreted as a rendering rule rather than a demonstrated physical capture.

The parameters also reveal the numerical nature of the image. Larger time steps are faster but can skip across a small capture disk; smaller steps resolve close encounters better but increase render time. Capture radius and maximum steps change the classification near difficult trajectories. The generated boundary is therefore a property of both the dynamical model and its numerical resolution.

## One simulation per pixel

For an image of width $W$, height $H$, and at most $S$ integration steps, the direct algorithm performs $O(WHS)$ particle updates. The two implementations organize that workload differently.

### Python renderer

`two_suns.py` uses NumPy arrays shaped like the image. Position, velocity, assignment state, and winner are stored for every pixel at once. Each integration step computes both gravitational accelerations with vectorized array operations. Boolean masks classify new captures, and the loop exits early if every particle has been assigned.

After the simulation, two masks map the winner array to the selected RGB colors. Pillow writes the resulting `uint8` array as a PNG, while `tqdm` reports progress. Command-line options expose output size, sun coordinates, colors, $G$, time step, capture radius, step limit, softening, and output filename, making the renderer suitable for scripted high-resolution experiments.

### Browser renderer

The web app is a single static `index.html` with no backend. JavaScript stores positions and velocities in `Float32Array` buffers and winners in a `Uint8Array`. A nested loop advances only particles whose winner is still zero. Once classification is complete, the code writes RGBA values into `ImageData` and paints the result to an HTML canvas.

The browser interface lets the user:

- choose a width and height between 50 and 1200 pixels;
- select independent colors for the two basins;
- place the suns with two canvas clicks;
- render and preview the classification;
- reset the sun positions;
- export the canvas as `two-suns-basins.png`.

Sun markers are drawn on top of the result so their positions remain visible. Because all computation happens locally in the browser, the same static files can be hosted directly by GitHub Pages. Large canvases require proportionally more memory and computation, so wallpaper-scale renders can take noticeably longer than small previews.

## From dynamics to wallpapers

The visualizer is intentionally both scientific and playful. A productive workflow is to test the geometry at a modest resolution, adjust the two centers until the boundary has the desired balance, choose a restrained two-color palette, and then repeat the render at the target screen aspect ratio. The PNG exporter preserves the canvas's actual pixel dimensions rather than its responsive on-screen size.

Symmetric sun positions produce symmetric fields, but symmetry in the final image also depends on the rectangular pixel lattice and tie-breaking rules. Asymmetric placements create sweeping regions and off-center boundaries that work particularly well as wallpaper compositions. The image is not a texture pasted over a simulation: each colored pixel is the recorded outcome of its own numerical trajectory.

## Implementation map

- `index.html` contains the complete interactive application, typed-array solver, canvas renderer, controls, and PNG export.
- `two_suns.py` is the configurable NumPy and Pillow command-line renderer.
- `preview.ipynb` is a notebook workspace for experimenting with the model.
- `basins.png` and `media/header.png` provide rendered examples of the system.

## References

1. Magrini, M. [Two Suns Gravity Visualizer: source code and browser application](https://github.com/mich1803/Two-Suns-Gravity-Visualizer). GitHub, 2025.
2. Newton, I. *Philosophiae Naturalis Principia Mathematica*, Book I, 1687. English translation available through the [Internet Archive](https://archive.org/details/newtonspmathema00newtrich).
3. Hairer, E., Lubich, C., and Wanner, G. [Geometric Numerical Integration: Structure-Preserving Algorithms for Ordinary Differential Equations](https://doi.org/10.1007/3-540-30666-8), 2nd ed., Springer, 2006.
4. Grebogi, C., Ott, E., and Yorke, J. A. [Fractal basin boundaries, long-lived chaotic transients, and unstable-unstable pair bifurcation](https://doi.org/10.1016/0167-2789(83)90212-X). *Physica D*, 7(1-3), 181-200, 1983.
