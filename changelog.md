# Version 0.2.0 Massive update 2020.03.30

Major overhaul and fixes for clarity and comprehension.

### Drawable rework

Drawable class now consist of two exported base classes [***LineRender***] and [***PolygonRender***]. Both classes have a nonpublic "Layer" class associated with them. Layers describe the transformations of drawable and are set at the initialization of a new drawable object

### G2Enum

The G2Graphics library has a dedicated enum known as G2Enum to house all enumarations within the library. Continuing to phase out older enumerators

### Shaders

Due to the rework, shaders are simplified. Currently there are three shaders
[***Line***] [***Color***] and [***Texture***]. Drawables are created with these shaders in mind and sync up with appropriate G2Enums to ensure the right shader and render specification is used.