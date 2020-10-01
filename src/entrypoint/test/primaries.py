import numpy as np
import colour

RGB_r = np.array([1, 0, 0])
RGB_g = np.array([0, 1, 0])
RGB_b = np.array([0, 0, 1])

XYZ_r = colour.sRGB_to_XYZ(RGB_r, apply_EOCF=False)
XYZ_g = colour.sRGB_to_XYZ(RGB_g, apply_EOCF=False)
XYZ_b = colour.sRGB_to_XYZ(RGB_b, apply_EOCF=False)

xyY_r = colour.XYZ_to_xyY(XYZ_r);
xyY_g = colour.XYZ_to_xyY(XYZ_g);
xyY_b = colour.XYZ_to_xyY(XYZ_b);

print(xyY_r)
print(xyY_g)
print(xyY_b)