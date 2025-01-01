"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

import TextOnSecNav from "./TextOnSecNav";


const DiamondCubeWithCracksAndLightCore2: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  // Refs for objects and scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const edgesMeshRef = useRef<THREE.LineSegments | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  const animationRef = useRef<number | null>(null);
  const targetCameraY = useRef(0);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Create geometries and materials
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const edgesMesh = new THREE.LineSegments(edges, lineMaterial);
    edgesMeshRef.current = edgesMesh;
    scene.add(edgesMesh);

    // Cube setup
    const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const cubeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8a2be2,
      emissive: 0x8a2be2,
      emissiveIntensity: 8.0,
      roughness: 0.1,
      metalness: 0.9,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    // Light setup
    const coreLight = new THREE.PointLight(0x8a2be2, 5, 3);
    coreLight.position.set(0, 0, 0);
    coreLightRef.current = coreLight;
    scene.add(coreLight);

    // Halo setup
    const coreHaloMaterial = new THREE.MeshBasicMaterial({
      color: 0x8a2be2,
      transparent: true,
      opacity: 0.5,
    });
    const coreHaloGeometry = new THREE.RingGeometry(0.25, 0.45, 32);
    const coreHalo = new THREE.Mesh(coreHaloGeometry, coreHaloMaterial);
    coreHalo.rotation.x = Math.PI / 2;
    scene.add(coreHalo);

    // Core empty setup
    const coreEmptyGeometry = new THREE.Mesh();
    coreEmptyGeometry.position.set(0, 0, 0);
    scene.add(coreEmptyGeometry);

    // Orbit cube setup
    const cubeGeometry2 = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const cubeMaterial2 = new THREE.MeshPhysicalMaterial({
      color: 0x3bffe2,
      emissive: 0x3bffe2,
      emissiveIntensity: 3.0,
      roughness: 0.1,
      metalness: 0.9,
    });
    const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
    cube2.position.set(4, 2, 0);
    coreEmptyGeometry.add(cube2);

    // text setup

    // Composer setup
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      3.0,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    camera.position.z = 3;

    // Animation loop
    const animate = () => {
      edgesMesh.rotation.x += 0.01;
      edgesMesh.rotation.y += 0.01;

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube2.rotation.x += 0.01;
      cube2.rotation.y += 0.01;

      // Smooth camera movement
      if (camera.position.y > targetCameraY.current) {
        camera.position.y -= 0.05 * (camera.position.y + 2);
      }

      composer.render();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Click handler
    const handleMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([cube]);

      if (intersects.length > 0) {
        // cube.scale.set(1.5, 1.5, 1.5);
        targetCameraY.current = -2; // Set target position instead of directly moving camera
        setShowText(true);

        setTimeout(() => {
          cube.scale.set(1, 1, 1);
        }, 1000);
      }
    };

    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("click", handleMouseClick);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
    };
  }, []); // Only depend on animationStep



  return (
    <div>
      <div ref={mountRef}></div>
      {showText && (
        <TextOnSecNav/>
      )}
    </div>
  );
};

export default DiamondCubeWithCracksAndLightCore2;
