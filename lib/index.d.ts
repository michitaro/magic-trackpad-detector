export declare class MagicTrackpadDetector {
    private history;
    tolerance: number;
    interval: number;
    minN: number;
    inertial(e: WheelEvent): boolean;
}
