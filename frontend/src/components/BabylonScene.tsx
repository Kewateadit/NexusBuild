'use client';

import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { fixOrientation } from '../utils/reconstruction/fixOrientation';
import { setupCameraControls } from '../utils/viewer/setupCameraControls';

interface Point {
    x: number;
    y: number;
}

interface WallSegment {
    start: Point;
    end: Point;
}

interface BabylonSceneProps {
    segments?: WallSegment[];
}

const BabylonScene: React.FC<BabylonSceneProps> = ({ segments = [] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = new BABYLON.Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });
        const scene = new BABYLON.Scene(engine);

        // Scene Background: Soft architectural gray-blue
        scene.clearColor = BABYLON.Color4.FromHexString("#ebf0f7ff");

        // Camera: Isometric cinematic angle
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Math.PI / 3.5, // Cinematic isometric angle
            Math.PI / 3,
            28,
            new BABYLON.Vector3(12, 0, 10),
            scene
        );
        camera.attachControl(canvasRef.current, true);
        
        // Apply improved camera controls (Safe Patch)
        setupCameraControls(camera, canvasRef.current);

        // Lighting: Soft studio shadows
        const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
        hemiLight.intensity = 0.7;
        hemiLight.groundColor = new BABYLON.Color3(0.2, 0.2, 0.3);

        const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -3, -2), scene);
        dirLight.position = new BABYLON.Vector3(20, 60, 20);
        dirLight.intensity = 0.5;

        // Floor Slab: Soft concrete gray
        const floor = BABYLON.MeshBuilder.CreateGround("floor", { width: 200, height: 200 }, scene);
        floor.position.x = 10;
        floor.position.z = 10;
        floor.position.y = -0.01;
        const floorMat = new BABYLON.StandardMaterial("floorMat", scene);
        floorMat.diffuseColor = new BABYLON.Color3(0.8, 0.82, 0.85);
        floorMat.specularColor = new BABYLON.Color3(0, 0, 0);
        floor.material = floorMat;

        // Wall Material: Matte warm off-white clay
        const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
        wallMat.diffuseColor = new BABYLON.Color3(0.96, 0.95, 0.92); // Warm off-white
        wallMat.specularColor = new BABYLON.Color3(0, 0, 0);
        wallMat.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        // Apply orientation correction (Safe Patch)
        const correctedSegments = fixOrientation(segments);

        // MANDATORY RENDERING LOGIC (PRESERVED)
        (correctedSegments ?? []).forEach((segment, index) => {
            const startX = segment.start.x / 50;
            const startZ = segment.start.y / 50;

            const endX = segment.end.x / 50;
            const endZ = segment.end.y / 50;

            const dx = endX - startX;
            const dz = endZ - startZ;

            const length = Math.sqrt(dx * dx + dz * dz);

            const midpointX = (startX + endX) / 2;
            const midpointZ = (startZ + endZ) / 2;

            const wall = BABYLON.MeshBuilder.CreateBox(
                `wall_${index}`,
                {
                    width: 0.2,
                    depth: length,
                    height: 3
                },
                scene
            );

            wall.position.x = midpointX;
            wall.position.z = midpointZ;
            wall.position.y = 1.5;

            wall.rotation.y = Math.atan2(dx, dz);
            wall.material = wallMat;
        });

        engine.runRenderLoop(() => {
            scene.render();
        });

        const handleResize = () => {
            engine.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            engine.dispose();
        };
    }, [segments]);

    return (
        <canvas 
            ref={canvasRef} 
            className="w-full h-full outline-none bg-[#ebf0f7] cursor-move transition-opacity duration-1000"
            style={{ touchAction: 'none' }}
        />
    );
};

export default BabylonScene;
