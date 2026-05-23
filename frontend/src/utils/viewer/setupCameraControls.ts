import * as BABYLON from '@babylonjs/core';
import { FEATURES } from '../../config/features';

/**
 * Enhanced camera controls for architectural viewing.
 * Provides smoother panning, better rotation, and stability constraints.
 */
export function setupCameraControls(camera: BABYLON.ArcRotateCamera, canvas: HTMLCanvasElement) {
    if (!FEATURES.improvedCamera) return;

    // --- Sensitivity & Precision ---
    camera.panningSensibility = 1000; // Lower is more sensitive. 1000 is usually good for desktop.
    camera.angularSensibilityX = 1500;
    camera.angularSensibilityY = 1500;
    camera.wheelPrecision = 40; // Higher = slower zoom

    // --- Constraints ---
    camera.lowerRadiusLimit = 2; // Min zoom
    camera.upperRadiusLimit = 150; // Max zoom
    
    // Prevent camera from going under the floor
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI / 2.1; 

    // --- Smoothing & Damping ---
    camera.useBouncingBehavior = true;
    camera.useAutoRotationBehavior = false;
    camera.inertia = 0.85; // Natural smooth stop
    camera.panningInertia = 0.85;

    // --- Input Mapping ---
    // Enable right-click panning
    camera.inputs.attached.pointers.buttons = [0, 1, 2]; // Left, Middle, Right
    
    // Check if we should override panning behavior
    if (camera.inputs.attached.pointers) {
        // @ts-ignore
        camera.inputs.attached.pointers.multiTouchPanAndZoom = true;
    }

    console.log("Improved Camera Controls Initialized.");
}
