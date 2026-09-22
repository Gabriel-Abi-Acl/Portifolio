'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const DESKTOP_DISK = 1100;
const MOBILE_DISK = 640;

type Cloud = {
  positions: Float32Array;
  colors: Float32Array;
};

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function writeColor(
  target: Float32Array,
  index: number,
  color: THREE.Color,
  hex: string,
  white: THREE.Color,
  whiteMix: number,
) {
  color.set(hex);
  color.lerp(white, whiteMix);
  target[index] = color.r;
  target[index + 1] = color.g;
  target[index + 2] = color.b;
}

function diskCount() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 768;
  return coarse || narrow ? MOBILE_DISK : DESKTOP_DISK;
}

function buildGalaxy(disk: number): {
  disk: Cloud;
  core: Cloud;
  halo: Cloud;
} {
  const rand = mulberry32(6);
  const color = new THREE.Color();
  const white = new THREE.Color('#f7f4ff');
  const arms = 3;
  const diskPositions = new Float32Array(disk * 3);
  const diskColors = new Float32Array(disk * 3);

  for (let i = 0; i < disk; i += 1) {
    const radius = Math.pow(rand(), 1.55) * 4.4;
    const arm = i % arms;
    const angle = (arm / arms) * Math.PI * 2 + radius * 1.15;
    const spread = 0.1 + radius * 0.09;
    const i3 = i * 3;
    diskPositions[i3] = Math.cos(angle) * radius + (rand() - 0.5) * spread;
    diskPositions[i3 + 1] = (rand() - 0.5) * (0.08 + (1 - radius / 4.4) * 0.28);
    diskPositions[i3 + 2] = Math.sin(angle) * radius + (rand() - 0.5) * spread;

    const hex = radius < 1.1 ? '#fff4dd' : radius < 2.6 ? '#3ee0c5' : '#b9a4ff';
    writeColor(diskColors, i3, color, hex, white, rand() * 0.35);
  }

  const coreCount = Math.round(disk * 0.16);
  const corePositions = new Float32Array(coreCount * 3);
  const coreColors = new Float32Array(coreCount * 3);
  for (let i = 0; i < coreCount; i += 1) {
    const radius = Math.pow(rand(), 0.55) * 0.95;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const i3 = i * 3;
    corePositions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
    corePositions[i3 + 1] = Math.cos(phi) * radius * 0.45;
    corePositions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
    writeColor(coreColors, i3, color, '#fffaf2', white, rand() * 0.2);
  }

  const haloCount = Math.round(disk * 0.18);
  const haloPositions = new Float32Array(haloCount * 3);
  const haloColors = new Float32Array(haloCount * 3);
  for (let i = 0; i < haloCount; i += 1) {
    const radius = 4.8 + rand() * 3.4;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const i3 = i * 3;
    haloPositions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
    haloPositions[i3 + 1] = Math.cos(phi) * radius;
    haloPositions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
    writeColor(haloColors, i3, color, '#d9d4ee', white, 0.55 + rand() * 0.35);
  }

  return {
    disk: { positions: diskPositions, colors: diskColors },
    core: { positions: corePositions, colors: coreColors },
    halo: { positions: haloPositions, colors: haloColors },
  };
}

function StarPoints({
  cloud,
  size,
  opacity,
  additive,
}: {
  cloud: Cloud;
  size: number;
  opacity: number;
  additive?: boolean;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(cloud.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cloud.colors, 3));
    return geo;
  }, [cloud]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={size}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={opacity}
        toneMapped={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

function GalaxyField() {
  const group = useRef<THREE.Group>(null);
  const clouds = useMemo(() => buildGalaxy(diskCount()), []);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y += delta * 0.045;
  });

  return (
    <group ref={group}>
      <StarPoints cloud={clouds.halo} size={0.018} opacity={0.55} />
      <StarPoints cloud={clouds.disk} size={0.028} opacity={0.9} />
      <StarPoints cloud={clouds.core} size={0.05} opacity={0.95} additive />
    </group>
  );
}

type GalaxySceneProps = {
  label: string;
};

export function GalaxyScene({ label }: GalaxySceneProps) {
  return (
    <Canvas
      aria-label={label}
      style={{ touchAction: 'none' }}
      camera={{ position: [0, 1.7, 4.8], fov: 48 }}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={['#070612']} />
      <GalaxyField />
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.6}
        autoRotate
        autoRotateSpeed={0.45}
        minDistance={2.2}
        maxDistance={8.5}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI - 0.35}
      />
    </Canvas>
  );
}
