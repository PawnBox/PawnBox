import { RotateModule } from "@Scripts/RotateModule"
import { AnimatedSpriteModule, AnimatorModule, InitialModule, Pawn, PawnRoot } from "PawnBox"
import { Application, Assets, Spritesheet } from "pixi.js"

const application: Application = new Application({
    view: document.getElementById("pawnbox") as HTMLCanvasElement,
    width: 512,
    height: 512,
    backgroundColor: 0x00AAFF,
})

async function main(): Promise<void> {
    new PawnRoot(application.stage)

    const pawn: Pawn = new Pawn({
        initialModules: [
            InitialModule(AnimatedSpriteModule),
            InitialModule(AnimatorModule),
            InitialModule(RotateModule, { speed: 0.025 }),
        ],
        position: { x: 256, y: 256 },
    })

    const spritesheet: Spritesheet = await Assets.load("./assets/spritesheet.json")

    const animator: AnimatorModule = pawn.GetModule(AnimatorModule)
    animator.LoadAnimationSheet(spritesheet, 0.01)
    animator.PlayAnimation("switch")
}

main()
