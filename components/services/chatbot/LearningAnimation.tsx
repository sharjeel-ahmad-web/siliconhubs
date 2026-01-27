'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
  layer: number;
}

interface Connection {
  from: string;
  to: string;
  active: boolean;
}

export const LearningAnimation: React.FC = () => {
  const [stage, setStage] = useState<'input' | 'processing' | 'output'>(
    'input'
  );
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Define neural network structure
  const layers = [
    { nodes: 4, label: 'Input', sublabel: 'User Query' },
    { nodes: 6, label: 'Hidden 1', sublabel: 'Understanding' },
    { nodes: 8, label: 'Hidden 2', sublabel: 'Processing' },
    { nodes: 6, label: 'Hidden 3', sublabel: 'Reasoning' },
    { nodes: 4, label: 'Output', sublabel: 'Response' },
  ];

  const nodes: Node[] = [];
  const connections: Connection[] = [];

  // Generate nodes
  layers.forEach((layer, layerIndex) => {
    const layerHeight = 280;
    const nodeSpacing = layerHeight / (layer.nodes + 1);

    for (let i = 0; i < layer.nodes; i++) {
      nodes.push({
        id: `${layerIndex}-${i}`,
        x: 80 + layerIndex * 160,
        y: 60 + nodeSpacing * (i + 1),
        layer: layerIndex,
      });
    }
  });

  // Generate connections
  layers.forEach((layer, layerIndex) => {
    if (layerIndex < layers.length - 1) {
      const currentLayerNodes = nodes.filter((n) => n.layer === layerIndex);
      const nextLayerNodes = nodes.filter((n) => n.layer === layerIndex + 1);

      currentLayerNodes.forEach((fromNode) => {
        nextLayerNodes.forEach((toNode) => {
          connections.push({
            from: fromNode.id,
            to: toNode.id,
            active: false,
          });
        });
      });
    }
  });

  // Animation cycle
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage((prev) => {
        if (prev === 'input') return 'processing';
        if (prev === 'processing') return 'output';
        return 'input';
      });
    }, 2500);

    return () => clearInterval(stageInterval);
  }, []);

  // Pulse animation through layers
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % layers.length);
    }, 500);

    return () => clearInterval(pulseInterval);
  }, [layers.length]);

  // Update active nodes based on pulse
  useEffect(() => {
    const layerNodes = nodes
      .filter((n) => n.layer === pulseIndex)
      .map((n) => n.id);
    setActiveNodes(layerNodes);
  }, [pulseIndex]);

  const getNodeColor = (node: Node) => {
    if (node.layer === 0) return '#F58122'; // Input - Orange
    if (node.layer === layers.length - 1) return '#31A4DB'; // Output - Brand Cyan
    return '#37AFE1'; // Hidden - Brand Blue
  };

  const isNodeActive = (nodeId: string) => activeNodes.includes(nodeId);

  return (
    <div className="w-full">
      {/* Main visualization */}
      <div className="relative h-[450px] w-full overflow-hidden rounded-2xl border border-[#37AFE1]/30 bg-black">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(55, 175, 225, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(55, 175, 225, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* SVG for connections and nodes */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 880 450">
          {/* Connections */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const isActive =
              isNodeActive(fromNode.id) || isNodeActive(toNode.id);

            return (
              <motion.line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isActive ? '#37AFE1' : '#37AFE1'}
                strokeWidth={isActive ? 2 : 0.5}
                strokeOpacity={isActive ? 0.8 : 0.15}
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  strokeOpacity: isActive ? 0.8 : 0.15,
                }}
                transition={{ duration: 0.3 }}
              />
            );
          })}

          {/* Data flow particles */}
          {connections.slice(0, 30).map((conn, idx) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            if (fromNode.layer !== pulseIndex) return null;

            return (
              <motion.circle
                key={`particle-${idx}`}
                r={3}
                fill="#F58122"
                initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 1 }}
                animate={{ cx: toNode.x, cy: toNode.y, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.02,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isActive = isNodeActive(node.id);
            const color = getNodeColor(node);
            const cx = Number(node.x) || 0;
            const cy = Number(node.y) || 0;
            const rGlow = isActive ? 20 : 12;
            const rMain = isActive ? 10 : 6;

            return (
              <g key={node.id}>
                {/* Glow effect: animate only fillOpacity so r is never undefined in the renderer */}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={rGlow}
                  fill={color}
                  fillOpacity={isActive ? 0.3 : 0.1}
                  animate={{
                    fillOpacity: isActive ? [0.1, 0.4, 0.1] : 0.1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: isActive ? Infinity : 0,
                  }}
                />
                {/* Main node: animate only scale so r is never driven by animation */}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={rMain}
                  fill={color}
                  stroke={color}
                  strokeWidth={2}
                  animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Layer labels */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-around px-8">
          {layers.map((layer, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              animate={{
                opacity: pulseIndex === idx ? 1 : 0.5,
                scale: pulseIndex === idx ? 1.1 : 1,
              }}
            >
              <div
                className="text-sm font-semibold"
                style={{
                  color:
                    idx === 0
                      ? '#F58122'
                      : idx === layers.length - 1
                        ? '#31A4DB'
                        : '#37AFE1',
                }}
              >
                {layer.label}
              </div>
              <div className="text-xs text-[#64748B]">{layer.sublabel}</div>
            </motion.div>
          ))}
        </div>

        {/* Stage indicator */}
        <div className="absolute left-4 top-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-lg border border-[#37AFE1]/30 bg-black/80 px-4 py-2 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      stage === 'input'
                        ? '#F58122'
                        : stage === 'processing'
                          ? '#37AFE1'
                          : '#31A4DB',
                  }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-white">
                  {stage === 'input' && 'Receiving Input...'}
                  {stage === 'processing' && 'Processing Data...'}
                  {stage === 'output' && 'Generating Response...'}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Process steps */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          className={`rounded-xl border p-6 transition-all ${
            stage === 'input'
              ? 'border-[#F58122] bg-[#F58122]/10 shadow-lg shadow-[#F58122]/20'
              : 'border-[#37AFE1]/20 bg-black'
          }`}
          animate={{ scale: stage === 'input' ? 1.02 : 1 }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F58122]/20">
              <svg
                className="h-5 w-5 text-[#F58122]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="text-lg font-semibold text-[#F58122]">
              Input Layer
            </div>
          </div>
          <p className="text-sm text-[#64748B]">
            User messages are tokenized and converted into numerical vectors for
            processing.
          </p>
        </motion.div>

        <motion.div
          className={`rounded-xl border p-6 transition-all ${
            stage === 'processing'
              ? 'border-[#37AFE1] bg-[#37AFE1]/10 shadow-lg shadow-[#37AFE1]/20'
              : 'border-[#37AFE1]/20 bg-black'
          }`}
          animate={{ scale: stage === 'processing' ? 1.02 : 1 }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#37AFE1]/20">
              <svg
                className="h-5 w-5 text-[#37AFE1]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="text-lg font-semibold text-[#37AFE1]">
              Hidden Layers
            </div>
          </div>
          <p className="text-sm text-[#64748B]">
            Multiple neural layers analyze context, intent, and generate
            intelligent understanding.
          </p>
        </motion.div>

        <motion.div
          className={`rounded-xl border p-6 transition-all ${
            stage === 'output'
              ? 'border-[#31A4DB] bg-[#31A4DB]/10 shadow-lg shadow-[#31A4DB]/20'
              : 'border-[#37AFE1]/20 bg-black'
          }`}
          animate={{ scale: stage === 'output' ? 1.02 : 1 }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#31A4DB]/20">
              <svg
                className="h-5 w-5 text-[#31A4DB]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-lg font-semibold text-[#31A4DB]">
              Output Layer
            </div>
          </div>
          <p className="text-sm text-[#64748B]">
            Final layer produces natural language responses tailored to user
            queries.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
