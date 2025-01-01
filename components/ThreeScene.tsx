"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import { randFloat } from "three/src/math/MathUtils.js";

const DiamondCubeWithCracksAndLightCore: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [animationStep, setAnimationStep] = useState(0); // 0: Initial, 1: Stone2 to core, 2: Stone1 to orbit
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs for objects
  const edgesMeshRef = useRef<THREE.LineSegments | null>(null);
  const lightningStone1Ref = useRef<THREE.Mesh | null>(null);
  const lightningStone2Ref = useRef<THREE.Mesh | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  
  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationStep(1);
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    // Create Cube Geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Load crack texture
    const crackTexture = new THREE.TextureLoader().load("components/OIP.jpg");
    crackTexture.wrapS = THREE.RepeatWrapping;
    crackTexture.wrapT = THREE.RepeatWrapping;
    crackTexture.repeat.set(2, 2);

    // Cube Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x8a2be2,
      emissive: 0x8a2be2,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.95,
      opacity: 0.8,
      transparent: true,
      map: crackTexture,
    });

    // Diamond Cube Mesh
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Core Light
    const coreLight = new THREE.PointLight(0x8a2be2, 5, 3);
    coreLight.position.set(0, 0, 0);
    coreLightRef.current = coreLight;
    scene.add(coreLight);

    // Halo Effect
    const coreHaloMaterial = new THREE.MeshBasicMaterial({
      color: 0x8a2be2,
      transparent: true,
      opacity: 0.5,
    });

    const coreHaloGeometry = new THREE.RingGeometry(0.25, 0.45, 32);
    const coreHalo = new THREE.Mesh(coreHaloGeometry, coreHaloMaterial);
    coreHalo.rotation.x = Math.PI / 2;
    scene.add(coreHalo);

    // Edge Geometry
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const edgesMesh = new THREE.LineSegments(edges, lineMaterial);
    edgesMeshRef.current = edgesMesh;
    scene.add(edgesMesh);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      3.0,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    // Lightning Stones
    const lightningStone1 = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const lightningStone1Material = new THREE.MeshPhysicalMaterial({
      color: 0x8a2be2,
      emissive: 0x8a2be2,
      emissiveIntensity: 10.0,
      roughness: 0.1,
      metalness: 0.9,
      transparent: false,
      opacity: 1,
      side: THREE.DoubleSide,
    });

    const lightningStone2Material = new THREE.MeshPhysicalMaterial({
      color: 0xff8b00,
      emissive: 0xff8b00,
      emissiveIntensity: 10.0,
      roughness: 0.1,
      metalness: 0.9,
      transparent: false,
      opacity: 1,
      side: THREE.DoubleSide,
    });

    // Lightning Stone 1 (starts at core)
    const lightningStone1_obj = new THREE.Mesh(lightningStone1, lightningStone1Material);
    lightningStone1Ref.current = lightningStone1_obj;
    lightningStone1_obj.position.set(0, 0, 0);
    edgesMesh.add(lightningStone1_obj);

    // Empty container for Lightning Stone 2
    const Empty1 = new THREE.Mesh();
    edgesMesh.add(Empty1);

    // Lightning Stone 2 (starts in orbit)
    const lightningStone2 = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const lightningStone2_obj = new THREE.Mesh(lightningStone2, lightningStone2Material);
    lightningStone2Ref.current = lightningStone2_obj;
    
    const orbitRadius = 1.5;
    lightningStone2_obj.position.set(orbitRadius, 0, 0);
    Empty1.add(lightningStone2_obj);

    // Camera Position
    camera.position.z = 3;

    // Animation Parameters
    let angle = 0;
    const orbitSpeed = 0.01;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Base rotations
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      edgesMesh.rotation.x += 0.01;
      edgesMesh.rotation.y += 0.01;

      // Stone rotations
      lightningStone1_obj.rotation.x -= 0.011;
      lightningStone1_obj.rotation.y -= 0.011;

      Empty1.rotation.x -= randFloat(1, 2) / 1000;
      Empty1.rotation.y += randFloat(2, 1) / 1000;
      Empty1.rotation.z -= randFloat(2, 1) / 1000;

      lightningStone2_obj.rotation.x -= 0.41;
      lightningStone2_obj.rotation.y += 2.41;
      lightningStone2_obj.rotation.z -= 0.41;

      // Core light pulsing
      if (coreLightRef.current) {
        coreLightRef.current.intensity = 3 + Math.sin(Date.now() * 0.005) * 2;
      }

      // Animation sequence
      if (animationStep === 1 && lightningStone2Ref.current) {
        // Move stone 2 from orbit to core
        const targetPosition = new THREE.Vector3(0, 0, 0);
        lightningStone2Ref.current.position.lerp(targetPosition, 0.05);

        if (lightningStone2Ref.current.position.distanceTo(targetPosition) < 0.1) {
          setAnimationStep(2);
          lightningStone2Ref.current.material.color.set(0x8a2be2);
          lightningStone2Ref.current.material.emissive.set(0x8a2be2);
        }
      }

      if (animationStep === 2 && lightningStone1Ref.current) {
        // Move stone 1 from core to orbit
        const targetOrbitPosition = new THREE.Vector3(
          orbitRadius * Math.cos(angle),
          0,
          orbitRadius * Math.sin(angle)
        );
        
        lightningStone1Ref.current.position.lerp(targetOrbitPosition, 0.05);
        angle += orbitSpeed;

        // Continue orbital motion
        if (lightningStone1Ref.current.position.distanceTo(targetOrbitPosition) < 0.1) {
          lightningStone1Ref.current.position.x = orbitRadius * Math.cos(angle);
          lightningStone1Ref.current.position.z = orbitRadius * Math.sin(angle);
        }
      }

      composer.render();
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [animationStep]);

  return (
    <div ref={mountRef}>
      <button 
        onClick={startAnimation}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Start Animation
      </button>
    </div>
  );
};

export default DiamondCubeWithCracksAndLightCore;