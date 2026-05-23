import { reconstructionFlags } from '../../config/reconstructionFlags';

declare var cv: any;

/**
 * Preprocessing utility to remove text labels from floorplan images.
 * Uses OpenCV-based connected component analysis to identify and mask text-like regions.
 */
export async function removeTextRegions(
    canvas: HTMLCanvasElement, 
    onStatus?: (msg: string) => void
): Promise<HTMLCanvasElement> {
    if (!reconstructionFlags.ENABLE_TEXT_FILTER) return canvas;

    try {
        if (typeof cv === 'undefined' || !cv.Mat) {
            console.warn("OpenCV.js not loaded. Skipping text removal.");
            return canvas;
        }

        onStatus?.("Filtering text artifacts...");

        const src = cv.imread(canvas);
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        const thresh = new cv.Mat();
        cv.adaptiveThreshold(gray, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2);

        // Detect connected components
        const labels = new cv.Mat();
        const stats = new cv.Mat();
        const centroids = new cv.Mat();
        const numComponents = cv.connectedComponentsWithStats(thresh, labels, stats, centroids);

        const mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
        let removedArea = 0;
        const totalArea = src.rows * src.cols;

        for (let i = 1; i < numComponents; i++) {
            const area = stats.intAt(i, cv.CC_STAT_AREA);
            const width = stats.intAt(i, cv.CC_STAT_WIDTH);
            const height = stats.intAt(i, cv.CC_STAT_HEIGHT);
            const aspect = width / height;

            // Heuristics for text labels (small area, relatively balanced aspect ratio)
            // Walls are typically much larger or very long/thin
            const isSmall = area < 500; // Small text-like area
            const isTextLike = aspect > 0.2 && aspect < 5.0; // Not a very long wall

            if (isSmall && isTextLike) {
                const rect = new cv.Rect(
                    stats.intAt(i, cv.CC_STAT_LEFT),
                    stats.intAt(i, cv.CC_STAT_TOP),
                    width,
                    height
                );
                // Fill the region in the mask
                cv.rectangle(mask, new cv.Point(rect.x, rect.y), new cv.Point(rect.x + rect.width, rect.y + rect.height), [255, 255, 255, 255], -1);
                removedArea += area;
            }
        }

        // Safety check: If removed area is too high, it might be removing walls.
        const removedAreaRatio = removedArea / totalArea;
        if (reconstructionFlags.ENABLE_SAFE_REVERT && removedAreaRatio > 0.15) {
            console.warn("Text removal removed too much area. Reverting to original.");
            src.delete(); gray.delete(); thresh.delete(); labels.delete(); stats.delete(); centroids.delete(); mask.delete();
            return canvas;
        }

        // Apply mask: Fill detected text regions with white (background)
        const result = src.clone();
        for (let r = 0; r < result.rows; r++) {
            for (let c = 0; c < result.cols; c++) {
                if (mask.ucharAt(r, c) === 255) {
                    // Set to white (assuming white background floorplan)
                    result.ucharPtr(r, c)[0] = 255;
                    result.ucharPtr(r, c)[1] = 255;
                    result.ucharPtr(r, c)[2] = 255;
                }
            }
        }

        const outCanvas = document.createElement('canvas');
        cv.imshow(outCanvas, result);

        // Cleanup
        src.delete(); gray.delete(); thresh.delete(); labels.delete(); stats.delete(); centroids.delete(); mask.delete(); result.delete();

        return outCanvas;
    } catch (err) {
        console.error("Error in removeTextRegions:", err);
        return canvas;
    }
}
