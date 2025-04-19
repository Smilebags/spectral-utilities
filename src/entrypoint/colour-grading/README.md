---
title: 3D Colour Manipulation
---
Idea is to project image pixel colours into a coordinate space, then use selection and transformation to manipulate these colours. The choice of space is just as important as the choice of selection behaviour or manipulation effect.

Implicit transformation between spaces. A grade is specified as a list of operations, each can choose its space, selection and transform.
```
[
  <choose colour space, select mask, apply transform>
  <choose colour space, select mask, apply transform>
  <choose colour space, select mask, apply transform>
]
```

## Spaces
XYZ
OKLab
Some primary native log
Camera native linear/log

## Selections
- Spherical selection with C2 smoothness https://en.wikipedia.org/wiki/Smoothness (cannot distinguish the start or end of selection range)
- linear gradient?
- Column?

## Transformations
Shift
Rotate (move origin?)