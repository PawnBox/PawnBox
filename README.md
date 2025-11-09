# PawnBox
TypeScript Entity Component pattern with reusable scripts and Pixi.JS support

## 0.1.0v
The initial release includes:
- **PawnRoot** - top level entity
- **Pawn** - normal entity
- **PawnModule** - base component code, initial data & unique flag
- **PawnTransformModule** with .SetParent() & .AddChild() methods
- **PawnEvent** - a simple event class
- **Sprite, Animated Sprite & Animator** as example PawnModules for PixiJS

## Project Goals
- Ideally, release PawnBox as an NPM Package and keep the base code here, remove unnecessary dependencies and keep it simple
- Separate PixiJS PawnModules to secondary repository
- Create documentation and better example game (for now there is only [unfinished catcher game](https://github.com/ShivekXR/PixiJS-Catcher "Unfinished Catcher Game"))
- Not sure yet but ThreeJS modules in the future

## Setup
This section will change soon, but now the project uses strict **16.16.0 Node.js** version with **8.11.0 npm**, and is based on **PixiJS 7.4**.
- `npm install` - install all project dependencies
- `npm start` - to run and test the project with webserver
- `npm run dev`-  to create a release build

## Usage
### PawnRoot
They serve as top level Transforms, propagating events such as OnUpdate, OnEnabled to their children.
```TypeScript
const application: Application = new Application(...) // PixiJS application
const pawnRoot: PawnRoot = new PawnRoot(application.stage /* or any PixiJS container */)
pawnRoot.AddChild(pawn.transform)
```

### Pawn
An entity containing components. Each Pawn has their own Transform component by default. Pawns can be initialized with optional data.

```TypeScript
const pawn: Pawn = new Pawn()
pawn.active = true
pawn.Destroy()

const pawn: Pawn = new Pawn({
    name: "Name",
    active: true,
    parentTransform: /* If not specified - the pawn will be automatically attached to the newest PawnRoot */,
    position: { x: 256, y: 256 },
    pivot: { x: 0, y: 0 },
    rotation: 0,
    scale: 1,
})
pawn.transform.SetParent(/* PawnRoot or other Pawn Transform */)
pawn.Destroy()
```

### PawnModules
In PawnBox project, the components are called PawnModules. The classic functionality meant to be extended through overriding built-in methods:
```TypeScript
class MyModule extends PawnModule {
    protected override OnStart(): void {}
    protected override OnEnable(): void {}
    protected override OnUpdate(): void {}
    protected override OnDisable(): void {}
    protected override OnDestroy(): void {}
}
```

#### Adding PawnModules to Pawns
There are two main ways to assign them to Pawns:
```TypeScript
const pawn: Pawn = new Pawn()
pawn.AddModule(PawnModuleClass)
pawn.AddModule(PawnModuleClass, { speed: 0.025 })
pawn.active = true

const pawn: Pawn = new Pawn({
    // If the `initialModules` array is non empty, the pawn will start automatically.
    initialModules: [
        InitialModule(PawnModuleClass),
        InitialModule(PawnModuleClass, { speed: 0.025 }),
    ],
    //active: false,
})
```

#### Getting PawnModules
```TypeScript
const pawnModuleExists: boolean = pawn.HasModule(PawnModuleClass)
const pawnModule: PawnModuleClass = pawn.AddModule(PawnModuleClass)
const pawnModule: PawnModuleClass = pawn.GetModule(PawnModuleClass)
pawnModule.Destroy()
const pawnModules: Array<PawnModuleClass> = pawn.GetModules(PawnModuleClass)
```

#### PawnModule UNIQUE flag
Some PawnModules (like e.g. PawnTransformModule) should be designed in the way they can't be added more than once:
```TypeScript
class UniqueModule extends PawnModule {
    public static override readonly UNIQUE: boolean = true
}
```

#### Custom PawnModule example
A PawnModule with an optional starting parameter. It simply rotates a Pawn on every OnUpdate tick, and outputs `Hello World!` to the browser console on its initialization.
```TypeScript
export interface RotateModuleData extends PawnModuleData {
    speed?: number
}

export class RotateModule extends PawnModule<RotateModuleData> {
    // public static override readonly UNIQUE: boolean = true
    speed: number

    constructor(owner: Pawn, rotateModuleData: RotateModuleData) {
        super(owner, rotateModuleData)
        this.speed = rotateModuleData?.speed ?? 0.01
    }

    protected override OnStart(): void {
        console.log("Hello World!")
    }

    protected override OnUpdate(): void {
        this.transform.container.angle += this.speed * Ticker.shared.deltaMS
    }
}
```
<img src="https://pawnbox.org/example/example.gif" width=25% height=25%>

[Example preview](https://pawnbox.org/example/ "Unfinished Catcher Game")

For the source reference, please check `Main.ts` and `RotateModule.ts` in the repository.
