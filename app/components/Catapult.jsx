'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CatapultDivider() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -25, 25, 15, -15, 0.1, 1000
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

    // Line materials
    const thickGreen = new THREE.LineBasicMaterial({ color: 0x6be5be, linewidth: 3, transparent: true, opacity: 1 });
    const mediumGreen = new THREE.LineBasicMaterial({ color: 0x6be5be, linewidth: 2.5, transparent: true, opacity: 0.9 });
    const thinGreen = new THREE.LineBasicMaterial({ color: 0x6be5be, linewidth: 2, transparent: true, opacity: 0.75 });
    const thickBlue = new THREE.LineBasicMaterial({ color: 0x3a5a8c, linewidth: 2.5, transparent: true, opacity: 0.85 });
    const mediumBlue = new THREE.LineBasicMaterial({ color: 0x4a6fa5, linewidth: 2, transparent: true, opacity: 0.7 });
    const thinBlue = new THREE.LineBasicMaterial({ color: 0x5a7fb5, linewidth: 1.5, transparent: true, opacity: 0.6 });

    const armGroup = new THREE.Group();

    // Helpers
    function line(start, end, material) {
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      return new THREE.Line(geometry, material);
    }

    function curve(points, material, segments = 60) {
      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(segments);
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      return new THREE.Line(geometry, material);
    }

    function spiral(centerX, centerY, startRadius, endRadius, turns, segments, material) {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * turns;
        const radius = startRadius + (endRadius - startRadius) * t;
        points.push(new THREE.Vector3(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius,
          0
        ));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geometry, material);
    }

    function arc(centerX, centerY, radius, startAngle, endAngle, segments, material) {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = startAngle + (endAngle - startAngle) * t;
        points.push(new THREE.Vector3(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius,
          0
        ));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geometry, material);
    }

    // === MASSIVE DETAILED ARM ===
    
    // Main arm structure - multiple flowing layers (CONNECTED)
    for (let layer = 0; layer < 6; layer++) {
      const offset = (layer - 2.5) * 0.3;
      const arm = curve([
        new THREE.Vector3(-15, offset + 4, 0),
        new THREE.Vector3(-12, offset + 3.5, 0),
        new THREE.Vector3(-8, offset + 2.8, 0),
        new THREE.Vector3(-4, offset + 1.8, 0),
        new THREE.Vector3(0, offset + 0.5, 0),
        new THREE.Vector3(4, offset - 0.8, 0),
        new THREE.Vector3(8, offset - 2.2, 0),
        new THREE.Vector3(12, offset - 3.8, 0),
        new THREE.Vector3(16, offset - 5.5, 0),
        new THREE.Vector3(18, offset - 6.5, 0),
      ], layer === 2 || layer === 3 ? thickGreen : (layer === 1 || layer === 4 ? mediumGreen : thinGreen));
      armGroup.add(arm);
    }

    // Connect the arm layers at regular intervals
    for (let i = 0; i < 10; i++) {
      const x = -15 + i * 3.3;
      const y = 4 - i * 1;
      
      // Vertical connections between layers
      armGroup.add(line(
        new THREE.Vector3(x, -1.5 + y, 0),
        new THREE.Vector3(x, 1.5 + y, 0),
        mediumBlue
      ));
    }

    // Intricate cross-bracing with spirals (ALL CONNECTED)
    for (let i = 0; i < 15; i++) {
      const x = -14 + i * 2.2;
      const y = 3.5 - i * 0.65;
      
      // Diagonal crosses - connected to arm
      armGroup.add(line(
        new THREE.Vector3(x - 0.8, y + 1.2, 0),
        new THREE.Vector3(x + 0.8, y - 1.2, 0),
        thinBlue
      ));
      armGroup.add(line(
        new THREE.Vector3(x - 0.8, y - 1.2, 0),
        new THREE.Vector3(x + 0.8, y + 1.2, 0),
        thinBlue
      ));
      
      // Spirals at intersections
      armGroup.add(spiral(x, y, 0.08, 0.35, 1.8, 25, thinGreen));
      
      // Connected arcs
      armGroup.add(arc(x, y + 1.2, 0.4, Math.PI, Math.PI * 2, 20, thinBlue));
      armGroup.add(arc(x, y - 1.2, 0.4, 0, Math.PI, 20, thinBlue));
    }

    // Complex lattice pattern (CONNECTED)
    for (let i = 0; i < 14; i++) {
      const x1 = -14 + i * 2.2;
      const x2 = x1 + 2.2;
      const y1 = 3.5 - i * 0.65;
      const y2 = y1 - 0.65;
      
      // Connected diagonal lines
      armGroup.add(line(new THREE.Vector3(x1, y1 + 1.2, 0), new THREE.Vector3(x2, y2 - 1.2, 0), thinBlue));
      armGroup.add(line(new THREE.Vector3(x1, y1 - 1.2, 0), new THREE.Vector3(x2, y2 + 1.2, 0), thinBlue));
      
      // Connecting horizontals
      armGroup.add(line(new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0), mediumBlue));
    }

    // Dense spiral decorations along length (CONNECTED TO ARM)
    for (let i = 0; i < 20; i++) {
      const x = -14 + i * 1.6;
      const y = 3.5 - i * 0.52;
      const offset = i % 2 === 0 ? 1.3 : -1.3;
      
      // Connect spiral to arm with line
      armGroup.add(line(
        new THREE.Vector3(x, y, 0),
        new THREE.Vector3(x, y + offset, 0),
        thinBlue
      ));
      armGroup.add(spiral(x, y + offset, 0.05, 0.25, 2, 20, thinGreen));
    }

    // === ELABORATE BASKET/SCOOP ===
    const basketGroup = new THREE.Group();
    basketGroup.position.set(18, -6.5, 0);

    // Main scoop - multiple layers
    for (let layer = 0; layer < 5; layer++) {
      const scoopPoints = [];
      const scale = 1 - layer * 0.12;
      const size = 2.5 * scale;
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const angle = Math.PI * t + Math.PI;
        scoopPoints.push(new THREE.Vector3(
          Math.cos(angle) * size * 0.8,
          Math.sin(angle) * size - 1,
          0
        ));
      }
      basketGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(scoopPoints),
        layer === 0 ? thickGreen : (layer === 1 ? mediumGreen : thinGreen)
      ));
    }

    // Radial ribs
    for (let i = 0; i <= 15; i++) {
      const t = i / 15;
      const angle = Math.PI * t + Math.PI;
      const outerX = Math.cos(angle) * 2.5 * 0.8;
      const outerY = Math.sin(angle) * 2.5 - 1;
      const innerX = Math.cos(angle) * 0.8 * 0.8;
      const innerY = Math.sin(angle) * 0.8 - 1;
      basketGroup.add(line(
        new THREE.Vector3(outerX, outerY, 0),
        new THREE.Vector3(innerX, innerY, 0),
        thinBlue
      ));
    }

    // Decorative spirals on basket
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const angle = Math.PI * t + Math.PI;
      const x = Math.cos(angle) * 2.5 * 0.8;
      const y = Math.sin(angle) * 2.5 - 1;
      basketGroup.add(spiral(x, y, 0.08, 0.35, 2, 22, thinGreen));
    }

    // Intricate basket edge pattern
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const angle = Math.PI * t + Math.PI;
      const x = Math.cos(angle) * 2.5 * 0.8;
      const y = Math.sin(angle) * 2.5 - 1;
      basketGroup.add(arc(x, y, 0.3, angle - Math.PI / 4, angle + Math.PI / 4, 12, mediumBlue));
    }

    armGroup.add(basketGroup);

    // === ULTRA DETAILED PROJECTILE ===
    const projectileGroup = new THREE.Group();
    projectileGroup.position.set(18, -7.2, 0);

    // Multiple layered spirals
    for (let layer = 0; layer < 8; layer++) {
      const offset = (layer / 8) * Math.PI * 2;
      projectileGroup.add(spiral(0, 0, 0.08, 1, 4 + layer * 0.3, 60, thickGreen));
    }

    // Concentric rings
    for (let i = 0; i < 10; i++) {
      const ringPoints = [];
      const radius = 0.6 + i * 0.15;
      for (let j = 0; j <= 40; j++) {
        const angle = (j / 40) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
      }
      projectileGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(ringPoints),
        new THREE.LineBasicMaterial({ color: 0x6be5be, transparent: true, opacity: 0.7 - i * 0.06, linewidth: 2 })
      ));
    }

    // Star burst pattern
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      projectileGroup.add(line(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0),
        mediumGreen
      ));
    }

    // Smaller internal spirals
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const x = Math.cos(angle) * 0.4;
      const y = Math.sin(angle) * 0.4;
      projectileGroup.add(spiral(x, y, 0.02, 0.15, 1.5, 15, thinGreen));
    }

    armGroup.add(projectileGroup);

    // === COUNTERWEIGHT AREA ===
    const counterweightGroup = new THREE.Group();
    counterweightGroup.position.set(-15, 4, 0);

    // Multiple geometric layers
    for (let layer = 0; layer < 6; layer++) {
      const points = [];
      const radius = 1.5 - layer * 0.2;
      const sides = 8;
      for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
      }
      counterweightGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        layer === 0 ? thickGreen : (layer < 3 ? mediumGreen : thinBlue)
      ));
    }

    // Radial spokes
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      counterweightGroup.add(line(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0),
        thinBlue
      ));
    }

    // Central spiral decoration
    counterweightGroup.add(spiral(0, 0, 0.08, 0.6, 3, 40, mediumGreen));

    // Surrounding mini spirals
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * 0.9;
      const y = Math.sin(angle) * 0.9;
      counterweightGroup.add(spiral(x, y, 0.04, 0.2, 1.5, 18, thinGreen));
    }

    armGroup.add(counterweightGroup);

    scene.add(armGroup);

    // Position for horizontal arm across screen
    armGroup.position.set(0, 0, 0);
    armGroup.rotation.z = 0.05; // Slight angle

    // === SCROLL-BASED ANIMATION ===
    let projectileLaunched = false;
    let projectileVelocity = new THREE.Vector2();
    let projectileWorldPos = new THREE.Vector3();

    function handleScroll() {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress based on section position
      let progress;
      if (rect.top > windowHeight) {
        // Section is below viewport - not started
        progress = 0;
      } else if (rect.bottom < 0) {
        // Section is above viewport - completed
        progress = 1;
      } else {
        // Section is in viewport - calculate progress
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        progress = 1 - (rect.bottom / (sectionHeight + windowHeight));
        progress = Math.max(0, Math.min(1, progress));
      }
      
      scrollProgressRef.current = progress;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      const progress = scrollProgressRef.current;

      // Arm rotation based on scroll - REVERSIBLE
      if (progress < 0.1) {
        // Wound up position
        armGroup.rotation.z = 0.05 - Math.PI * 0.35;
        projectileLaunched = false;
        
        if (projectileGroup.parent !== armGroup) {
          scene.remove(projectileGroup);
          armGroup.add(projectileGroup);
          projectileGroup.position.set(18, -7.2, 0);
          projectileGroup.rotation.z = 0;
          projectileGroup.scale.set(1, 1, 1);
        }
        
      } else if (progress < 0.6) {
        // Launch phase
        const phase = (progress - 0.1) / 0.5;
        armGroup.rotation.z = 0.05 - Math.PI * 0.35 + phase * Math.PI * 0.7;
        
        if (phase > 0.5 && !projectileLaunched && progress > 0.3) {
          projectileLaunched = true;
          projectileGroup.getWorldPosition(projectileWorldPos);
          armGroup.remove(projectileGroup);
          scene.add(projectileGroup);
          projectileGroup.position.copy(projectileWorldPos);
          
          const launchSpeed = 18;
          const launchAngle = Math.PI / 4;
          projectileVelocity.set(
            Math.cos(launchAngle) * launchSpeed,
            Math.sin(launchAngle) * launchSpeed
          );
        }
        
      } else {
        // Follow through
        const phase = (progress - 0.6) / 0.4;
        armGroup.rotation.z = 0.05 + Math.PI * 0.35 - phase * Math.PI * 0.15;
      }

      // Projectile physics
      if (projectileLaunched && projectileGroup.parent === scene) {
        projectileVelocity.y -= 0.25;
        projectileGroup.position.x += projectileVelocity.x * 0.016;
        projectileGroup.position.y += projectileVelocity.y * 0.016;
        projectileGroup.rotation.z += 0.12;
        
        const pulse = 1 + Math.sin(Date.now() * 0.012) * 0.12;
        projectileGroup.scale.set(pulse, pulse, 1);
        
        if (projectileGroup.position.y < -20 || projectileGroup.position.x > 30) {
          scene.remove(projectileGroup);
          projectileLaunched = false;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || 800;
      const aspect = width / height;
      const viewHeight = 15;
      const viewWidth = viewHeight * aspect;
      
      camera.left = -viewWidth;
      camera.right = viewWidth;
      camera.top = viewHeight;
      camera.bottom = -viewHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
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
    <section 
      ref={sectionRef}
      className="w-full h-[800px] relative"
    >
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />
    </section>
  );
}