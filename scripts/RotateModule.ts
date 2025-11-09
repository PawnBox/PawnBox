import { Pawn, PawnModule, PawnModuleData } from "PawnBox"
import { Ticker } from "pixi.js"

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
