'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Neuron {
  id: string;
  layer: number;
  index: number;
  position: [number, number, number];
  activation: number;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

// Neuron sphere component
function NeuronSphere({
  position,
  activation,
  isActive,
  layerType,
}: {
  position: [number, number, number];
  activation: number;
  isActive: boolean;
  layerType: 'input' | 'hidden' | 'output';
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Color based on layer type
  const getColor = () => {
    if (layerType === 'input') return '#F58122'; // Orange
    if (layerType === 'output') return '#31A4DB'; // Brand Cyan
    return '#37AFE1'; // Brand Blue for hidden
  };

  const color = getColor();

  useFrame((state) => {
    if (meshRef.current) {
      const pulse =
        Math.sin(state.clock.elapsedTime * 3 + activation * 10) * 0.15 + 1;
      meshRef.current.scale.setScalar(isActive ? pulse : 0.9);
    }
    if (glowRef.current) {
      const glowPulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 1;
      glowRef.current.scale.setScalar(isActive ? glowPulse * 1.8 : 1.2);
    }
  });

  return (
    <group position={position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.3 : 0.1}
        />
      </mesh>
      {/* Main neuron */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 1 : 0.4}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {isActive && <pointLight color={color} intensity={3} distance={4} />}
    </group>
  );
}

// Connection line component with animated particles
function ConnectionLine({
  from,
  to,
  isActive,
  fromLayer,
}: {
  from: [number, number, number];
  to: [number, number, number];
  isActive: boolean;
  fromLayer: 'input' | 'hidden' | 'output';
}) {
  const getColor = (layer: string) => {
    if (layer === 'input') return '#F58122';
    if (layer === 'output') return '#31A4DB';
    return '#37AFE1';
  };

  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: isActive ? getColor(fromLayer) : '#37AFE1',
    opacity: isActive ? 0.6 : 0.15,
    transparent: true,
  });

  return <primitive object={new THREE.Line(geometry, material)} />;
}

// Floating particles for data flow effect
function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array>(
    new Float32Array(300)
  );

  useEffect(() => {
    const newPositions = new Float32Array(300);
    for (let i = 0; i < 100; i++) {
      newPositions[i * 3] = (Math.random() - 0.5) * 12;
      newPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      newPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    setPositions(newPositions);
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#37AFE1"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Main 3D scene component
function NetworkScene() {
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    // Create 3 layers with more neurons
    const inputLayer: Neuron[] = Array.from({ length: 5 }, (_, i) => ({
      id: `input-${i}`,
      layer: 0,
      index: i,
      position: [-5, (i - 2) * 1.4, 0] as [number, number, number],
      activation: Math.random(),
    }));

    const hiddenLayer1: Neuron[] = Array.from({ length: 7 }, (_, i) => ({
      id: `hidden1-${i}`,
      layer: 1,
      index: i,
      position: [-1.5, (i - 3) * 1.1, 0] as [number, number, number],
      activation: Math.random(),
    }));

    const hiddenLayer2: Neuron[] = Array.from({ length: 7 }, (_, i) => ({
      id: `hidden2-${i}`,
      layer: 2,
      index: i,
      position: [1.5, (i - 3) * 1.1, 0] as [number, number, number],
      activation: Math.random(),
    }));

    const outputLayer: Neuron[] = Array.from({ length: 4 }, (_, i) => ({
      id: `output-${i}`,
      layer: 3,
      index: i,
      position: [5, (i - 1.5) * 1.4, 0] as [number, number, number],
      activation: Math.random(),
    }));

    const allNeurons = [
      ...inputLayer,
      ...hiddenLayer1,
      ...hiddenLayer2,
      ...outputLayer,
    ];
    setNeurons(allNeurons);

    // Create connections
    const conns: Connection[] = [];

    inputLayer.forEach((input) => {
      hiddenLayer1.forEach((hidden) => {
        conns.push({ from: input.id, to: hidden.id, strength: Math.random() });
      });
    });

    hiddenLayer1.forEach((h1) => {
      hiddenLayer2.forEach((h2) => {
        conns.push({ from: h1.id, to: h2.id, strength: Math.random() });
      });
    });

    hiddenLayer2.forEach((hidden) => {
      outputLayer.forEach((output) => {
        conns.push({ from: hidden.id, to: output.id, strength: Math.random() });
      });
    });

    setConnections(conns);

    // Animate through layers
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const getLayerType = (layer: number): 'input' | 'hidden' | 'output' => {
    if (layer === 0) return 'input';
    if (layer === 3) return 'output';
    return 'hidden';
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#F58122" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#37AFE1" />
      <pointLight position={[0, 0, 10]} intensity={0.3} color="#31A4DB" />

      {/* Background particles */}
      <DataParticles />

      {/* Render connections */}
      {connections.map((conn, idx) => {
        const fromNeuron = neurons.find((n) => n.id === conn.from);
        const toNeuron = neurons.find((n) => n.id === conn.to);

        if (!fromNeuron || !toNeuron) return null;

        const isActive =
          fromNeuron.layer === activeLayer || toNeuron.layer === activeLayer;

        return (
          <ConnectionLine
            key={`${conn.from}-${conn.to}-${idx}`}
            from={fromNeuron.position}
            to={toNeuron.position}
            isActive={isActive}
            fromLayer={getLayerType(fromNeuron.layer)}
          />
        );
      })}

      {/* Render neurons */}
      {neurons.map((neuron) => (
        <NeuronSphere
          key={neuron.id}
          position={neuron.position}
          activation={neuron.activation}
          isActive={neuron.layer === activeLayer}
          layerType={getLayerType(neuron.layer)}
        />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.8}
        minDistance={8}
        maxDistance={20}
      />
    </>
  );
}

export const NeuralNetwork: React.FC = () => {
  return (
    <div className="relative h-[550px] w-full overflow-hidden rounded-2xl border border-[#37AFE1]/30 bg-black">
      <div
        tabIndex={-1}
        style={{ outline: 'none', width: '100%', height: '100%' }}
      >
        <Canvas
          camera={{ position: [0, 0, 14], fov: 50 }}
          tabIndex={-1}
          style={{ outline: 'none', background: 'black' }}
          onCreated={({ gl }) => {
            gl.domElement.tabIndex = -1;
            gl.domElement.style.outline = 'none';
            gl.setClearColor('#000000');
          }}
        >
          <NetworkScene />
        </Canvas>
      </div>

      {/* Layer labels */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex justify-around px-8">
        <div className="text-center">
          <div className="text-base font-semibold text-[#F58122]">
            Input Layer
          </div>
          <div className="text-xs text-[#64748B]">User Message</div>
        </div>
        <div className="text-center">
          <div className="text-base font-semibold text-[#37AFE1]">
            Hidden Layer 1
          </div>
          <div className="text-xs text-[#64748B]">Understanding</div>
        </div>
        <div className="text-center">
          <div className="text-base font-semibold text-[#37AFE1]">
            Hidden Layer 2
          </div>
          <div className="text-xs text-[#64748B]">Processing</div>
        </div>
        <div className="text-center">
          <div className="text-base font-semibold text-[#31A4DB]">
            Output Layer
          </div>
          <div className="text-xs text-[#64748B]">AI Response</div>
        </div>
      </div>

      {/* Animated indicator */}
      <div className="absolute left-4 top-4 rounded-lg border border-[#37AFE1]/30 bg-black/80 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#37AFE1]" />
          <span className="text-sm font-medium text-white">
            Neural Processing Active
          </span>
        </div>
      </div>
    </div>
  );
};
