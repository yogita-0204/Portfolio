import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlobalCanvas3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.025);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 4, 60);
    cyanLight.position.set(15, 12, 12);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8a2be2, 4.5, 60);
    violetLight.position.set(-15, -12, 10);
    scene.add(violetLight);

    // 3. Central 3D Interactive Tech Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer Wireframe Icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x003344,
      emissiveIntensity: 0.6
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Middle Dodecahedron
    const midGeo = new THREE.DodecahedronGeometry(3.0);
    const midMat = new THREE.MeshStandardMaterial({
      color: 0x9d4edd,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x4a0e4e,
      emissiveIntensity: 0.7
    });
    const midMesh = new THREE.Mesh(midGeo, midMat);
    coreGroup.add(midMesh);

    // Inner Glowing Core (Nucleus)
    const innerGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x00f5a0,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0x00f5a0,
      emissiveIntensity: 0.9
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Orbiting Rings
    const ringGeo = new THREE.TorusGeometry(6.2, 0.05, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.55 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xff007f, transparent: true, opacity: 0.45 });
    const ring2 = new THREE.Mesh(ringGeo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // 4. Large Interactive Particle Field
    const particleCount = 1600;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f2fe);
    const violetColor = new THREE.Color(0x8a2be2);
    const emeraldColor = new THREE.Color(0x00f5a0);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 80;
      posArray[i + 1] = (Math.random() - 0.5) * 80;
      posArray[i + 2] = (Math.random() - 0.5) * 60 - 5;

      const rand = Math.random();
      const col = rand < 0.45 ? cyanColor : rand < 0.8 ? violetColor : emeraldColor;
      colorArray[i] = col.r;
      colorArray[i + 1] = col.g;
      colorArray[i + 2] = col.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Tracking Mouse and Scroll
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // 6. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.06;
      targetY += (mouseY - targetY) * 0.06;

      // Scroll progress
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollFraction = Math.min(scrollY / maxScroll, 1);

      // Core rotations
      outerMesh.rotation.x = elapsedTime * 0.12 + scrollFraction * 3;
      outerMesh.rotation.y = elapsedTime * 0.18 + targetX * 2;

      midMesh.rotation.x = -elapsedTime * 0.2 + scrollFraction * 2;
      midMesh.rotation.z = elapsedTime * 0.15;

      ring1.rotation.z = elapsedTime * 0.25 + scrollFraction * 4;
      ring2.rotation.x = elapsedTime * 0.2 + scrollFraction * 3;

      // Pulse nucleus
      const pulse = 1 + Math.sin(elapsedTime * 3.5) * 0.1;
      innerMesh.scale.set(pulse, pulse, pulse);

      // Position core based on scroll (moves along a smooth cinematic curve down the page)
      // When at Hero: centered (x=0, y=0)
      // When scrolling down: glides to the right, shrinks slightly and lowers opacity so cards remain 100% readable!
      const targetCoreX = scrollFraction < 0.2 ? targetX * 10 : 8 + targetX * 5;
      const targetCoreY = scrollFraction < 0.2 ? -targetY * 6 : -4 - targetY * 4;
      const targetScale = scrollFraction < 0.2 ? 1.0 : 0.65;

      coreGroup.position.x += (targetCoreX - coreGroup.position.x) * 0.05;
      coreGroup.position.y += (targetCoreY - coreGroup.position.y) * 0.05;
      coreGroup.scale.set(targetScale, targetScale, targetScale);

      // Rotate particle nebula
      particles.rotation.y = elapsedTime * 0.015 + targetX * 0.4 + scrollFraction * 1.5;
      particles.rotation.x = targetY * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      outerGeo.dispose();
      outerMat.dispose();
      midGeo.dispose();
      midMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
