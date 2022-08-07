---
title: Abney vs Gaussian Width
---
This entrypoint is used to compare the path to white from the outer edge of sRGB using two approaches:
1. Widening of the gaussian lobe towards a flat spectrum
2. Linear blending with white in a linear tristimulus space (which exhibits the Abney effect)

This effect shows only minor differences with a majority of colours apart from sRGB blue (451nm), which shows severe shift towards purple as it is linearly mixed with white. The gaussian spectrum at this wavelength does not exhibit this shift towards purple.

More visible differences may be apparent if starting with wider primaries, but the limitations of the web platform make this unachievable at this time.