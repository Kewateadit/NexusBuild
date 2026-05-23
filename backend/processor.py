import cv2
import numpy as np
import base64

def to_base64(img):
    _, buffer = cv2.imencode('.png', img)
    return base64.b64encode(buffer).decode('utf-8')

def process_floorplan(contents):
    # Load image
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    h, w = img.shape[:2]

    # 1. Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 2. Adaptive Gaussian thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )

    # 3. Morphological closing to solidify wall segments
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # 4. Probabilistic Hough Line Transform
    # Optimized for internal and external wall detection
    lines = cv2.HoughLinesP(
        mask, 
        rho=1,
        theta=np.pi/180, 
        threshold=40, 
        minLineLength=40, 
        maxLineGap=20
    )

    wall_segments = []
    hough_img = np.zeros_like(img)

    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            
            # Extract raw pixel coordinates for frontend scaling
            wall_segments.append({
                "start": {"x": float(x1), "y": float(y1)},
                "end": {"x": float(x2), "y": float(y2)}
            })
            
            # Draw for debug preview
            cv2.line(hough_img, (x1, y1), (x2, y2), (255, 255, 255), 2)

    # Standardized API response schema
    return {
        "segments": wall_segments,
        "width": w,
        "height": h,
        "debug_images": {
            "threshold": to_base64(thresh),
            "mask": to_base64(mask),
            "contours": to_base64(hough_img)
        }
    }
