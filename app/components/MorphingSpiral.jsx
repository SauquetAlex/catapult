'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpiralToLines({ children }) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollProgressRef = useRef(0);

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

    camera.position.set(40, 0, 120);
    camera.lookAt(40, 0, 0);

    const mainGroup = new THREE.Group();
    mainGroup.position.x = 40;
    
    const numSpirals = 12;
    const maxRadius = 90;
    const spiralLines = [];

    // Create spiral lines that can morph
    for (let i = 0; i < numSpirals; i++) {
      const segments = 200;
      const spiralIndex = i / numSpirals;
      const angleOffset = spiralIndex * Math.PI * 2;

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segments * 3), 3));

      const brightness = 0.5 + spiralIndex * 0.3;
      const color = new THREE.Color(0x6be5be).multiplyScalar(brightness);

      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.35 - spiralIndex * 0.12,
        linewidth: 2,
      });

      const line = new THREE.Line(geometry, material);
      mainGroup.add(line);
      
      spiralLines.push({
        line,
        spiralIndex,
        angleOffset,
        segments,
        material
      });
    }

    // Create band lines
    const numBands = 8;
    const bandLines = [];

    for (let i = 0; i < numBands; i++) {
      const segments = 150;
      const bandIndex = i / numBands;
      const angleOffset = bandIndex * Math.PI * 2;

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segments * 3), 3));

      const brightness = 0.4 + bandIndex * 0.4;
      const color = new THREE.Color(0x6be5be).multiplyScalar(brightness);

      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.22,
        linewidth: 2,
      });

      const line = new THREE.Line(geometry, material);
      mainGroup.add(line);
      
      bandLines.push({
        line,
        bandIndex,
        angleOffset,
        segments,
        material
      });
    }

    scene.add(mainGroup);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener('mousemove', handleMouseMove);

    function updateCameraPosition(progress) {
      if (progress < 0.5) {
        mainGroup.position.x = 40 + (mouseX * 5 - mainGroup.position.x + 40) * 0.05;
        mainGroup.position.y += (mouseY * 5 - mainGroup.position.y) * 0.05;
      }
    }

    function updateGeometry(progress, time) {
      // Camera transition - switch to orthographic for final phase
      if (progress < 0.65) {
        // Perspective camera for spiral and unwind
        camera.position.set(40, 0, 120);
        camera.lookAt(40, 0, 0);
      }

      // Update spiral lines
      spiralLines.forEach(({ line, spiralIndex, angleOffset, segments, material }, idx) => {
        const positions = line.geometry.attributes.position.array;
        
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;

          // Original spiral position
          const spiralAngle = t * Math.PI * 6 + angleOffset;
          const spiralRadius = t * maxRadius * (0.3 + spiralIndex * 0.7);
          const spiralX = Math.cos(spiralAngle) * spiralRadius;
          const spiralY = Math.sin(spiralAngle) * spiralRadius;
          const spiralZ = Math.sin(t * Math.PI * 4) * 0.5;

          if (progress < 0.3) {
            // Phase 1: Pure spiral (0 - 0.3)
            positions[j * 3] = spiralX;
            positions[j * 3 + 1] = spiralY;
            positions[j * 3 + 2] = spiralZ;
            
            // Original opacity
            material.opacity = 0.35 - spiralIndex * 0.12;
            material.linewidth = 2;
            
          } else if (progress < 0.65) {
            // Phase 2: DRAMATIC unwind - expand across entire screen (0.3 - 0.65)
            const unwindProgress = (progress - 0.3) / 0.35;
            const easeProgress = unwindProgress * unwindProgress * (3 - 2 * unwindProgress);
            
            // Spread dramatically across entire viewport width
            const numTotalLines = numSpirals + numBands;
            const lineIndex = idx;
            const spreadX = -120 + (lineIndex / numTotalLines) * 240; // Full screen width
            const spreadY = (t * 2 - 1) * 100; // Taller too
            const spreadZ = 0;
            
            positions[j * 3] = spiralX + (spreadX - spiralX) * easeProgress;
            positions[j * 3 + 1] = spiralY + (spreadY - spiralY) * easeProgress;
            positions[j * 3 + 2] = spiralZ + (spreadZ - spiralZ) * easeProgress;
            
            material.opacity = (0.35 - spiralIndex * 0.12) + easeProgress * 0.5;
            material.linewidth = 2 + easeProgress * 2;
            
          } else {
            // Phase 3: Collapse to left side (0.65 - 1.0)
            const collapseProgress = (progress - 0.65) / 0.35;
            const easeProgress = collapseProgress * collapseProgress * (3 - 2 * collapseProgress);
            
            // Source: spread position
            const numTotalLines = numSpirals + numBands;
            const lineIndex = idx;
            const spreadX = -120 + (lineIndex / numTotalLines) * 240;
            const spreadY = (t * 2 - 1) * 100;
            
            // Target: FIXED position on left edge of screen
            // Calculate position in screen-space coordinates
            const aspect = window.innerWidth / window.innerHeight;
            const viewWidth = 10 * aspect;
            const finalX = -viewWidth + (lineIndex / numTotalLines) * viewWidth * 0.6; // 60% from left edge
            const finalY = (t * 2 - 1) * 10; // Match viewport height
            const finalZ = 0;
            
            positions[j * 3] = spreadX + (finalX - spreadX) * easeProgress;
            positions[j * 3 + 1] = spreadY + (finalY - spreadY) * easeProgress;
            positions[j * 3 + 2] = finalZ;
            
            // Final opacity with gradient
            const targetOpacity = 1 - (lineIndex / numTotalLines) * 0.6;
            material.opacity = 0.85 + (targetOpacity - 0.85) * easeProgress;
            material.linewidth = 4 + easeProgress; // Final 5
            
            // Emanating glow effect
            const glowPulse = Math.sin(time * 2.5 + lineIndex * 0.3) * 0.15;
            material.opacity = Math.min(1, material.opacity + glowPulse * collapseProgress);
          }
        }
        
        line.geometry.attributes.position.needsUpdate = true;
      });

      // Update band lines
      bandLines.forEach(({ line, bandIndex, angleOffset, segments, material }, idx) => {
        const positions = line.geometry.attributes.position.array;
        
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;

          // Original band position
          const bandAngle = t * Math.PI * 4 + angleOffset;
          const bandRadius = (0.4 + bandIndex * 0.6) * maxRadius * 1.3;
          const bandX = Math.cos(bandAngle) * bandRadius * (1 + t * 0.2);
          const bandY = Math.sin(bandAngle) * bandRadius * (1 + t * 0.2);
          const bandZ = -5;

          if (progress < 0.3) {
            // Phase 1: Pure spiral
            positions[j * 3] = bandX;
            positions[j * 3 + 1] = bandY;
            positions[j * 3 + 2] = bandZ;
            
            material.opacity = 0.22;
            material.linewidth = 2;
            
          } else if (progress < 0.65) {
            // Phase 2: DRAMATIC unwind
            const unwindProgress = (progress - 0.3) / 0.35;
            const easeProgress = unwindProgress * unwindProgress * (3 - 2 * unwindProgress);
            
            const numTotalLines = numSpirals + numBands;
            const lineIndex = numSpirals + idx;
            const spreadX = -120 + (lineIndex / numTotalLines) * 240;
            const spreadY = (t * 2 - 1) * 100;
            const spreadZ = 0;
            
            positions[j * 3] = bandX + (spreadX - bandX) * easeProgress;
            positions[j * 3 + 1] = bandY + (spreadY - bandY) * easeProgress;
            positions[j * 3 + 2] = bandZ + (spreadZ - bandZ) * easeProgress;
            
            material.opacity = 0.22 + easeProgress * 0.5;
            material.linewidth = 2 + easeProgress * 2;
            
          } else {
            // Phase 3: Collapse to left side
            const collapseProgress = (progress - 0.65) / 0.35;
            const easeProgress = collapseProgress * collapseProgress * (3 - 2 * collapseProgress);
            
            const numTotalLines = numSpirals + numBands;
            const lineIndex = numSpirals + idx;
            const spreadX = -120 + (lineIndex / numTotalLines) * 240;
            const spreadY = (t * 2 - 1) * 100;
            
            const aspect = window.innerWidth / window.innerHeight;
            const viewWidth = 10 * aspect;
            const finalX = -viewWidth + (lineIndex / numTotalLines) * viewWidth * 0.6;
            const finalY = (t * 2 - 1) * 10;
            const finalZ = 0;
            
            positions[j * 3] = spreadX + (finalX - spreadX) * easeProgress;
            positions[j * 3 + 1] = spreadY + (finalY - spreadY) * easeProgress;
            positions[j * 3 + 2] = finalZ;
            
            const targetOpacity = 1 - (lineIndex / numTotalLines) * 0.6;
            material.opacity = 0.72 + (targetOpacity - 0.72) * easeProgress;
            material.linewidth = 4 + easeProgress;
            
            // Emanating glow
            const glowPulse = Math.sin(time * 2.5 + lineIndex * 0.3) * 0.15;
            material.opacity = Math.min(1, material.opacity + glowPulse * collapseProgress);
          }
        }
        
        line.geometry.attributes.position.needsUpdate = true;
      });
    }

    function handleScroll() {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      let progress;
      if (rect.top > 0) {
        progress = 0;
      } else if (rect.bottom < windowHeight) {
        progress = 1;
      } else {
        const scrolled = -rect.top;
        const totalScroll = sectionHeight - windowHeight;
        progress = Math.max(0, Math.min(1, scrolled / totalScroll));
      }
      
      scrollProgressRef.current = progress;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    let time = 0;
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.005;

      const progress = scrollProgressRef.current;

      // Rotation (only in spiral mode)
      if (progress < 0.3) {
        mainGroup.rotation.z = time * 0.6;
        const scale = 1 + Math.sin(time * 0.8) * 0.03;
        mainGroup.scale.set(scale, scale, 1);
        updateCameraPosition(progress);
      } else if (progress < 0.65) {
        // Slow down rotation during dramatic unwind
        const fadeProgress = (progress - 0.3) / 0.35;
        const rotationSpeed = 0.6 * (1 - fadeProgress * fadeProgress);
        mainGroup.rotation.z = time * rotationSpeed;
      } else {
        // No rotation in final state
        mainGroup.rotation.z = 0;
      }

      updateGeometry(progress, time);
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
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      mainGroup.children.forEach((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={containerRef}
        className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none"
      />
      
      <div ref={sectionRef}>
        {children}
      </div>
    </>
  );
}