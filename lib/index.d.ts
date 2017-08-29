export declare class MagicTrackpadDetector {
    tolerance: number;
    interval: number;
    minN1: number;
    minN2: number;
    private history;
    inertial(e: WheelEvent): boolean;
}
