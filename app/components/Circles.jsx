'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function RippleBackground() {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x6be5be, 1); // mint teal — matches FAQ bg
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // const aspect = window.innerWidth / window.innerHeight;
    const aspect = w / h;
    const viewSize = 100;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect, viewSize * aspect,
       viewSize, -viewSize,
      -10, 10
    );
    camera.position.z = 5;

    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 10, 0);
    scene.add(ringGroup);

    const numRings = 42;
    const minR = 2;
    const maxR = 320; // blown up — outer rings bleed well off-screen
    const ringColor = new THREE.Color(0x151c43); // navy — matches FAQ text
    const segments = 256;

    for (let i = 0; i < numRings; i++) {
      const t = i / (numRings - 1);
      const radius = minR + (maxR - minR) * (t * t);

      const points = [];
      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        ));
      }

      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.18 - t * 0.13, // inner rings punchy, outer fade out
      });
      ringGroup.add(new THREE.Line(geo, mat));
    }

    let targetX = 0;
    let targetY = 10;

    const onMouseMove = (e) => {
      targetX = ((e.clientX / window.innerWidth) * 2 - 1) * 8;
      targetY = -((e.clientY / window.innerHeight) * 2 - 1) * 5 + 10;
    };
    window.addEventListener('mousemove', onMouseMove);

    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.008;

      const breathe = 1 + Math.sin(time * 0.6) * 0.015;
      ringGroup.scale.set(breathe, breathe, 1);

      ringGroup.position.x += (targetX - ringGroup.position.x) * 0.04;
      ringGroup.position.y += (targetY - ringGroup.position.y) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = containerRef.current;
      const a = w / h;
      camera.left   = -viewSize * a;
      camera.right  =  viewSize * a;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ringGroup.children.forEach((c) => {
        c.geometry.dispose();
        c.material.dispose();
      });
    };
  }, []);

  return (
  <div
    ref={containerRef}
    className="absolute inset-0 w-full h-full"
    style={{ zIndex: 0 }}
  >
    {/* Top blend overlay */}
    <div
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{
        height: '25%',
        background: 'linear-gradient(to bottom, #6be5be 0%, rgba(107,229,190,0) 100%)',
      }}
    />
  </div>
);



}
