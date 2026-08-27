'use client';

import { useState, useRef, useEffect } from 'react';
import { Save } from 'lucide-react';
import { AnimationPreset } from './AnimationPresetLibrary';

interface EasingCurveEditorProps {
  preset: AnimationPreset;
  onChange: (preset: AnimationPreset) => void;
  onSave: (preset: AnimationPreset) => void;
}

// Physics presets from requirements
const PHYSICS_PRESETS = {
  GENTLE: {
    mass: 0.8,
    tension: 120,
    friction: 20,
    label: 'Gentle (Subtle hover)',
  },
  BOUNCY: {
    mass: 1.2,
    tension: 200,
    friction: 15,
    label: 'Bouncy (Interactive buttons)',
  },
  STIFF: { mass: 1.0, tension: 170, friction: 26, label: 'Stiff (Navigation)' },
  MAGNETIC: {
    mass: 0.6,
    tension: 250,
    friction: 30,
    label: 'Magnetic (Cursor following)',
  },
  ELASTIC: {
    mass: 1.5,
    tension: 150,
    friction: 18,
    label: 'Elastic (Momentum scrolling)',
  },
};

const EASING_PRESETS = [
  { value: 'linear', label: 'Linear', curve: [0, 0, 1, 1] },
  { value: 'power1.in', label: 'Power 1 In', curve: [0.42, 0, 1, 1] },
  { value: 'power1.out', label: 'Power 1 Out', curve: [0, 0, 0.58, 1] },
  { value: 'power1.inOut', label: 'Power 1 InOut', curve: [0.42, 0, 0.58, 1] },
  { value: 'power2.in', label: 'Power 2 In', curve: [0.55, 0.085, 0.68, 0.53] },
  {
    value: 'power2.out',
    label: 'Power 2 Out',
    curve: [0.25, 0.46, 0.45, 0.94],
  },
  {
    value: 'power2.inOut',
    label: 'Power 2 InOut',
    curve: [0.455, 0.03, 0.515, 0.955],
  },
  {
    value: 'back.out(1.7)',
    label: 'Back Out (1.7)',
    curve: [0.34, 1.56, 0.64, 1],
  },
  {
    value: 'elastic.out',
    label: 'Elastic Out',
    curve: [0.68, -0.55, 0.265, 1.55],
  },
  {
    value: 'bounce.out',
    label: 'Bounce Out',
    curve: [0.68, -0.55, 0.265, 1.55],
  },
];

export function EasingCurveEditor({
  preset,
  onChange,
  onSave,
}: EasingCurveEditorProps) {
  const [selectedEasing, setSelectedEasing] = useState(preset.config.easing);
  const [customCurve, setCustomCurve] = useState<number[]>([0.42, 0, 0.58, 1]);
  const [selectedPhysicsPreset, setSelectedPhysicsPreset] = useState<
    keyof typeof PHYSICS_PRESETS | null
  >(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawEasingCurve();
  }, [selectedEasing, customCurve]);

  const drawEasingCurve = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i * (width - 2 * padding)) / 4;
      const y = padding + (i * (height - 2 * padding)) / 4;

      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw curve
    const easingPreset = EASING_PRESETS.find((e) => e.value === selectedEasing);
    const curve = easingPreset?.curve || customCurve;

    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const bezierT = cubicBezier(curve[0], curve[1], curve[2], curve[3], t);
      const x = padding + t * (width - 2 * padding);
      const y = height - padding - bezierT * (height - 2 * padding);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw control points
    ctx.fillStyle = '#7C3AED';
    const cp1x = padding + curve[0] * (width - 2 * padding);
    const cp1y = height - padding - curve[1] * (height - 2 * padding);
    const cp2x = padding + curve[2] * (width - 2 * padding);
    const cp2y = height - padding - curve[3] * (height - 2 * padding);

    ctx.beginPath();
    ctx.arc(cp1x, cp1y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cp2x, cp2y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter';
    ctx.fillText('Time', width / 2 - 15, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Progress', -25, 0);
    ctx.restore();
  };

  const cubicBezier = (
    p1: number,
    p2: number,
    p3: number,
    p4: number,
    t: number
  ): number => {
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    return mt3 * 0 + 3 * mt2 * t * p2 + 3 * mt * t2 * p4 + t3 * 1;
  };

  const handleEasingChange = (easing: string) => {
    setSelectedEasing(easing);
    const updatedPreset = {
      ...preset,
      config: {
        ...preset.config,
        easing,
      },
    };
    onChange(updatedPreset);
  };

  const handlePhysicsPresetSelect = (
    presetKey: keyof typeof PHYSICS_PRESETS
  ) => {
    setSelectedPhysicsPreset(presetKey);
    const physics = PHYSICS_PRESETS[presetKey];

    // Convert physics parameters to easing curve approximation
    const updatedPreset = {
      ...preset,
      config: {
        ...preset.config,
        easing: `spring(${physics.mass}, ${physics.tension}, ${physics.friction})`,
        properties: {
          ...preset.config.properties,
          springPhysics: physics,
        },
      },
    };
    onChange(updatedPreset);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Easing Curve Editor
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Select easing functions or physics presets for natural motion
          </p>
        </div>
        <button
          onClick={() => onSave(preset)}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1d4ed8]"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Curve Visualization */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Curve Preview
          </h3>
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full rounded-lg border border-slate-200"
          />
          <div className="mt-4 rounded bg-slate-50 p-3 text-sm">
            <div className="mb-1 font-medium text-slate-700">
              Current Easing:
            </div>
            <code className="text-[#2563EB]">{selectedEasing}</code>
          </div>
        </div>

        {/* Easing Selection */}
        <div className="space-y-6">
          {/* Standard Easing Presets */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Standard Easing
            </h3>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {EASING_PRESETS.map((easing) => (
                <button
                  key={easing.value}
                  onClick={() => handleEasingChange(easing.value)}
                  className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                    selectedEasing === easing.value
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-medium">{easing.label}</div>
                  <div className="mt-1 text-xs opacity-75">
                    cubic-bezier({easing.curve.join(', ')})
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Physics Presets */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Physics Presets
            </h3>
            <div className="space-y-2">
              {Object.entries(PHYSICS_PRESETS).map(([key, physics]) => (
                <button
                  key={key}
                  onClick={() =>
                    handlePhysicsPresetSelect(
                      key as keyof typeof PHYSICS_PRESETS
                    )
                  }
                  className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                    selectedPhysicsPreset === key
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-medium">{key}</div>
                  <div className="mt-1 text-xs opacity-75">{physics.label}</div>
                  <div className="mt-1 text-xs opacity-75">
                    Mass: {physics.mass}, Tension: {physics.tension}, Friction:{' '}
                    {physics.friction}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
