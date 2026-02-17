'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HorizontalLines() {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -10, 10, 10, -10, 0.1, 1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 10;

    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    const numLines = 24; // More lines for 40% coverage
    const lineSpacing = 0.33; // Spacing to fit in bottom 40% (~8 units)

    const lineObjects = []; // Store line references for animation

    for (let i = 0; i < numLines; i++) {
      const points = [];
      // Position from bottom: -10 is bottom, lines go up ~3.5 units (10% of 20 unit height)
      const y = -10 + i * lineSpacing;
      
      // Horizontal line spanning full width
      const aspect = window.innerWidth / window.innerHeight;
      const viewWidth = 10 * aspect;
      points.push(new THREE.Vector3(-viewWidth, y, 0));
      points.push(new THREE.Vector3(viewWidth, y, 0));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      // Gradient effect - opaque at bottom, fade more aggressively upward
      const t = i / numLines;
      const baseOpacity = 1 - t * 0.95; // Start at 1.0 at bottom, fade to 0.05 at top for blending
      
      const material = new THREE.LineBasicMaterial({
        color: 0x6be5be,
        transparent: true,
        opacity: baseOpacity,
        linewidth: 5
      });

      const line = new THREE.Line(geometry, material);
      linesGroup.add(line);
      lineObjects.push({ line, baseOpacity, index: i });
    }

    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001; // Time in seconds
      
      // Single wave for all lines - they all move together
      const wave = Math.sin(time * 1.5);
      const bobAmount = 0.2; // How much to bob up/down
      
      // Animate each line with same bobbing motion
      lineObjects.forEach(({ line, baseOpacity }) => {
        // All lines bob together
        line.position.y = wave * bobAmount;
        
        // Subtle opacity pulse (same for all)
        const pulseFactor = 0.08;
        const pulseOpacity = baseOpacity + wave * pulseFactor;
        line.material.opacity = Math.max(0, Math.min(1, pulseOpacity));
      });
      
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;
      const aspect = width / height;
      const viewHeight = 10;
      const viewWidth = viewHeight * aspect;
      
      camera.left = -viewWidth;
      camera.right = viewWidth;
      camera.top = viewHeight;
      camera.bottom = -viewHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      
      // Recreate lines with new aspect ratio
      linesGroup.children.forEach(child => {
        linesGroup.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      
      lineObjects.length = 0;
      
      const numLines = 24;
      const lineSpacing = 0.33;
      
      for (let i = 0; i < numLines; i++) {
        const points = [];
        const y = -10 + i * lineSpacing;
        const newViewWidth = viewHeight * aspect;
        points.push(new THREE.Vector3(-newViewWidth, y, 0));
        points.push(new THREE.Vector3(newViewWidth, y, 0));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const t = i / numLines;
        const baseOpacity = 1 - t * 0.95; // Stronger fade
        
        const material = new THREE.LineBasicMaterial({
          color: 0x6be5be,
          transparent: true,
          opacity: baseOpacity,
          linewidth: 5
        });
        
        const line = new THREE.Line(geometry, material);
        linesGroup.add(line);
        lineObjects.push({ line, baseOpacity, index: i });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 w-full h-full z-[1] pointer-events-none"
    />
  );
}