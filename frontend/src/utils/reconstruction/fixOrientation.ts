import { reconstructionFlags } from '../../config/reconstructionFlags';

interface Point {
    x: number;
    y: number;
}

interface WallSegment {
    start: Point;
    end: Point;
}

/**
 * Validates wall segments to reject noise (thin, small, or irregular segments).
 */
export function validateWalls(segments: WallSegment[]): WallSegment[] {
    if (!segments) return [];

    return segments.filter(segment => {
        const dx = segment.end.x - segment.start.x;
        const dy = segment.end.y - segment.start.y;
        const lengthSq = dx * dx + dy * dy;

        // Reject segments that are too small (noise)
        // threshold: 20 pixels squared (approx 4.5 pixels length)
        if (lengthSq < 400) return false;

        return true;
    });
}

/**
 * Corrects the orientation of the reconstructed 3D layout.
 * Fixes the mirrored output issue by applying horizontal inversion if enabled.
 */
export function fixOrientation(segments: WallSegment[], shouldFlip: boolean = reconstructionFlags.ENABLE_MIRROR_CORRECTION): WallSegment[] {
    if (!segments) return [];
    
    // Step 6: Wall Validation
    let processedSegments = validateWalls(segments);

    if (!shouldFlip) return processedSegments;

    return processedSegments.map(segment => ({
        start: {
            ...segment.start,
            x: -segment.start.x
        },
        end: {
            ...segment.end,
            x: -segment.end.x
        }
    }));
}
