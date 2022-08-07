---
title: Colour Blindness
---
This entrypoint simulates various forms of colour blindness by shifting the spectral sensitivity of a virtual human observer, using reconstructed spectra from RGB data.

The steps in the process are as follows:
- Take an sRGB colour
- Reconstruct a spectrum which generates this sRGB colour under normal colour vision.
  - Here, this is done by using three base spectra, which each individually produce the chromaticity of the sRGB primaries, and when added together result in a flat spectrum. Superior methods of finding a spectrum which results in a given colour exist, but haven't been used here.
  - Linear sRGB values can then be used to scale these three base spectra, and the resulting spectrum is the sum of the three scaled base spectra.
- Create modified spectral sensitivity curves for this virtual observer by shifting the standard observer LMS spectral sensitivities by the number of nanometers provided in the configuration.
- Find the LMS response of the reconstructed spectrum using the modified spectral sensitivity of the colour blind virtual observer. This is achieved by multiplying the modified LMS responses by the reconstructed spectrum, then integrating the result.
- The resulting LMS responses are then converted back to sRGB using the standard LMS>XYZ>REC.709 conversion matrices.


## Limitations
- This is not reviewed by anyone. It is just a simulation based on my incomplete understanding of the topic. Don't make any assumptions about colour blindness or the vision of people who have colour blindness based on observations you make with this.
- This simulation modifies the appearance of white, which I don't think would not be the case under regular (chromatically adapted) conditions, even for a dichromat.
- The 3 sRGB base spectra used are not correct for this use-case, as they are actually spectra which individually reproduce the sRGB primaries after they have been adapted to an Illuminant E white point. That means that 'standard' colour vision when using this tool is not correct.
- This is not able to simulate protanopia, deuteranopia or tritanopia because these are the result of missing one of L, M or S entirely.
  - I believe I could add the ability to simulate these types of colour blindness by replacing the spectral response curve of affected cone by the response of another. This would result in dichromatic vision, but the colours used to represent this vision would depend on which cone response curve was used when replacing the missing one. I'm not sure if this is an accurate way of simulating dichromatic vision.