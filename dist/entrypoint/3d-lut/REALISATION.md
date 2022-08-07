# Wrapping + gaussian model is inefficient as an RGB spectrum reconstruction method
Once RGB is converted to Wavelength, Width and Scale (WWS), if using a model which wraps around the magentas with a continuous model, evaluating the intensity at any wavelength requires multiple gaussian calculations and summing the result, which seems inefficient.

# Application in gamut mapping
I believe there is some credibility in the concept of hue-constancy of gaussian spectra with the same peak wavelength.