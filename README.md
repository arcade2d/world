# @arcade2d/world

![Coverage](https://gitlab.com/arcade2d/world/badges/master/coverage.svg?key_text=Coverage) ![Latest Release](https://gitlab.com/arcade2d/world/-/badges/release.svg)

[Repository](https://gitlab.com/arcade2d/world) &middot; [Website](https://arcade2d.com)

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

## Usage Example

```typescript
import { World, WorldObject, Vector } from '@arcade2d/world';

// Create a new type of WorldObject.
class MyObject extends WorldObject {
  constructor() {
    super({
      queryable: true,
      tags: ['example', 'my-object'],
    });
  }
}

// Create the World.
const world = new World();

// Add some objects.
const objectA = world.add(new MyObject(), Vector.from(100, 100));
const objectB = world.add(new MyObject(), Vector.from(200, 250));

// Example of measuring distance between two objects within the world.
console.log(objectA.position.distanceTo(objectB.position));

// Query for objects.
console.log(world.query().types(MyObject).first());

// Call step() on the world every 16ms.
setInterval(() => world.step(), 16);
```
