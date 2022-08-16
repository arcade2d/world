# @arcade2d/world

![Coverage](https://gitlab.com/arcade2d/world/badges/master/coverage.svg?key_text=Coverage) ![Latest Release](https://gitlab.com/arcade2d/world/-/badges/release.svg)

[Repository](https://gitlab.com/arcade2d/world) &middot; [Website](https://arcade2d.com) &middot; [Reference](https://arcade2d.gitlab.io/world/)

The aim of this library is to construct and simulate a game world in an abstract sense. It does not provide any functionality or features outside of this such as rendering capabilities (graphics), sound or other game related components. It purely focuses on a game world and how objects within that world can be interacted with and interact with each other.

It covers things like:

- A base class to build your own world objects from.
- Adding and removing objects from a world.
- Simulating a step within the world, which cascades down to objects within that world.
- Mathematical concepts for objects within the world such as 2D vector positions.
- Querying the world for certain objects.

## Installation

```bash
$ yarn add @arcade2d/world
```
