'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpiralBackground() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const spiralGroupRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.set(40, 0, 80);
    camera.lookAt(40, 0, 0);

    const spiralGroup = new THREE.Group();
    spiralGroup.position.x = 40;
    
    const numSpirals = 12;
    const maxRadius = 90;

    for (let i = 0; i < numSpirals; i++) {
      const points = [];
      const segments = 200;
      const spiralIndex = i / numSpirals;
      const angleOffset = spiralIndex * Math.PI * 2;

      for (let j = 0; j <= segments; j++) {
        const t = j / segments;

        const angle = t * Math.PI * 6 + angleOffset;
        const radius = t * maxRadius * (0.3 + spiralIndex * 0.7);

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = Math.sin(t * Math.PI * 4) * 0.5;

        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const brightness = 0.5 + spiralIndex * 0.3;
      const color = new THREE.Color(0x6be5be).multiplyScalar(brightness);

      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.35 - spiralIndex * 0.12,
        linewidth: 2,
      });

      const line = new THREE.Line(geometry, material);
      spiralGroup.add(line);
    }

    const numBands = 8;
    for (let i = 0; i < numBands; i++) {
      const points = [];
      const segments = 150;
      const bandIndex = i / numBands;
      const angleOffset = bandIndex * Math.PI * 2;

      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const angle = t * Math.PI * 4 + angleOffset;
        const radius = (0.4 + bandIndex * 0.6) * maxRadius * 1.3;

        const x = Math.cos(angle) * radius * (1 + t * 0.2);
        const y = Math.sin(angle) * radius * (1 + t * 0.2);
        const z = -5;

        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const brightness = 0.4 + bandIndex * 0.4;
      const color = new THREE.Color(0x6be5be).multiplyScalar(brightness);

      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.22,
        linewidth: 2,
      });

      const line = new THREE.Line(geometry, material);
      spiralGroup.add(line);
    }

    scene.add(spiralGroup);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    spiralGroupRef.current = spiralGroup;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener('mousemove', handleMouseMove);

    function updateCameraPosition() {
      spiralGroup.position.x = 40 + (mouseX * 5 - spiralGroup.position.x + 40) * 0.05;
      spiralGroup.position.y += (mouseY * 5 - spiralGroup.position.y) * 0.05;
    }

    let time = 0;
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.005;

      spiralGroup.rotation.z = time * 2.2; // was 0.6 — ~3.5x faster

      const scale = 1 + Math.sin(time * 0.8) * 0.03;
      spiralGroup.scale.set(scale, scale, 1);

      updateCameraPosition();
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      spiralGroup.children.forEach((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-[1]"
    />
  );
}