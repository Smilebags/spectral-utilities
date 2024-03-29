---
title: Quadratic Sigmoid
---
This entrypoint explores the function space of the 3-coefficient spectrum representation described in [A Low-Dimensional Function Space for Efficient Spectral Upsampling by Wenzel Jakob and Johannes Hanika](https://onlinelibrary.wiley.com/doi/10.1111/cgf.13626). This is only a partial implementation of the representation they describe and does not include the mapping they present to handle the extreme changes which happen in very small ranges of the input variables.

It shows a dot representing the resulting colour of the spectrum currently represented by the three sliders, as well as projections along all three axes of the space. Each of these curved lines show the current value having one coefficient changed at a time.