import colour
import numpy

ie = numpy.array([1.0, 1.0, 1.0])               
d65 = numpy.array([0.95045471, 1.0, 1.08905029])

print(colour.adaptation.chromatic_adaptation_matrix_VonKries(ie, d65, 'Bradford'))
print(colour.adaptation.chromatic_adaptation_matrix_VonKries(d65, ie, 'Bradford'))

