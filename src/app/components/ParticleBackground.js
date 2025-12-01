'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 150 }) {
  const mesh = useRef();
  const { viewport, mouse } = useThree();

  // Generate particles with random properties
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;

    // Convert mouse position (normalized -1 to 1) to scene coordinates
    // We scale it up to affect a wider area
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

      // Update time for oscillation
      particle.t += speed / 3; // Slower, more graceful movement

      // Lissajous-like organic movement base
      const a = Math.cos(particle.t) + Math.sin(particle.t * 1) / 10;
      const b = Math.sin(particle.t) + Math.cos(particle.t * 2) / 10;
      const s = Math.cos(particle.t);

      // Mouse influence interpolation (smooth follow/avoid)
      // We want a subtle effect where particles drift towards the mouse but also swirl around it
      particle.mx += (targetX - particle.mx) * 0.05;
      particle.my += (targetY - particle.my) * 0.05;

      // Calculate final position
      const x = (particle.mx / 10) * a + xFactor + Math.cos((particle.t / 10) * factor) + (Math.sin(particle.t * 1) * factor) / 10;
      const y = (particle.my / 10) * b + yFactor + Math.sin((particle.t / 10) * factor) + (Math.cos(particle.t * 2) * factor) / 10;
      const z = (particle.my / 10) * b + zFactor + Math.cos((particle.t / 10) * factor) + (Math.sin(particle.t * 3) * factor) / 10;

      dummy.position.set(x, y, z);

      // Scale breathing effect
      const scale = (Math.cos(particle.t) + 2) / 3; 
      dummy.scale.set(scale, scale, scale);

      // Rotation
      dummy.rotation.set(s * 5, s * 5, s * 5);
      
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial 
        color="#d8b4fe" 
        emissive="#a5b4fc"
        emissiveIntensity={0.5}
        transparent 
        opacity={0.8} 
        roughness={0.1}
        metalness={0.5}
      />
    </instancedMesh>
  );
}

export default function ParticleBackground() {
  return (
    <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <Canvas
        camera={{ position: [0, 0, 40], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting for 3D effect */}
        <ambientLight intensity={0.6} />
        <pointLight position={[20, 20, 20]} intensity={1.2} color="#e9d5ff" />
        <pointLight position={[-20, -20, -20]} intensity={1.2} color="#bfdbfe" />
        
        {/* Fog for depth - adjust color based on theme if needed, or keep neutral */}
        {/* We can't easily switch fog color in R3F without context, but we can make it subtle */}
        {/* Or better, let's use a neutral white/gray fog that works with the light background */}
        {/* Actually, fog needs to match background color to work effectively. 
            Since we have a gradient background div behind canvas, fog color is tricky.
            Let's try a very light purple/blue fog or remove it if it clashes.
            A very light fog might be safer.
        */}
        <fog attach="fog" args={['#f3e8ff', 20, 90]} /> 
        
        <Particles count={250} />
      </Canvas>
    </div>
  );
}
