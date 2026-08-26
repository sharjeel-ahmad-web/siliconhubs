'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Play, Save } from 'lucide-react';
import { AnimationPreset, TimelineKeyframe } from './AnimationPresetLibrary';

interface TimelineEditorProps {
  preset: AnimationPreset;
  onChange: (preset: AnimationPreset) => void;
  onSave: (preset: AnimationPreset) => void;
}

export function TimelineEditor({
  preset,
  onChange,
  onSave,
}: TimelineEditorProps) {
  const [keyframes, setKeyframes] = useState<TimelineKeyframe[]>(
    preset.config.timeline || []
  );
  const [selectedKeyframe, setSelectedKeyframe] = useState<number | null>(null);
  const [draggingKeyframe, setDraggingKeyframe] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatedPreset = {
      ...preset,
      config: {
        ...preset.config,
        timeline: keyframes,
      },
    };
    onChange(updatedPreset);
  }, [keyframes]);

  const handleAddKeyframe = () => {
    const newKeyframe: TimelineKeyframe = {
      time:
        keyframes.length > 0
          ? Math.min(keyframes[keyframes.length - 1].time + 0.2, 1)
          : 0,
      properties: { opacity: 1, y: 0, scale: 1 },
    };
    setKeyframes([...keyframes, newKeyframe].sort((a, b) => a.time - b.time));
  };

  const handleDeleteKeyframe = (index: number) => {
    setKeyframes(keyframes.filter((_, i) => i !== index));
    if (selectedKeyframe === index) {
      setSelectedKeyframe(null);
    }
  };

  const handleKeyframeMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingKeyframe(index);
    setSelectedKeyframe(index);
  };

  const handleTimelineMouseMove = (e: React.MouseEvent) => {
    if (draggingKeyframe === null || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(1, x / rect.width));

    const updatedKeyframes = [...keyframes];
    updatedKeyframes[draggingKeyframe] = {
      ...updatedKeyframes[draggingKeyframe],
      time,
    };
    setKeyframes(updatedKeyframes.sort((a, b) => a.time - b.time));
  };

  const handleTimelineMouseUp = () => {
    setDraggingKeyframe(null);
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedKeyframe === null) return;

    const updatedKeyframes = [...keyframes];
    updatedKeyframes[selectedKeyframe] = {
      ...updatedKeyframes[selectedKeyframe],
      properties: {
        ...updatedKeyframes[selectedKeyframe].properties,
        [property]: value,
      },
    };
    setKeyframes(updatedKeyframes);
  };

  const handlePlayAnimation = () => {
    setIsPlaying(true);
    setPlayheadPosition(0);

    const duration = preset.config.duration;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setPlayheadPosition(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        setPlayheadPosition(0);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Timeline Editor</h2>
          <p className="mt-1 text-sm text-slate-600">
            Drag keyframes to adjust timing. Click to edit properties.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePlayAnimation}
            disabled={isPlaying || keyframes.length === 0}
            className="flex items-center gap-2 rounded-lg bg-[#10B981] px-4 py-2 text-white transition-colors hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => onSave(preset)}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1d4ed8]"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4 rounded-lg bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Duration: {preset.config.duration}ms
          </span>
          <button
            onClick={handleAddKeyframe}
            className="flex items-center gap-2 rounded bg-[#2563EB] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#1d4ed8]"
          >
            <Plus className="h-4 w-4" />
            Add Keyframe
          </button>
        </div>

        {/* Timeline Track */}
        <div
          ref={timelineRef}
          className="relative h-24 cursor-crosshair rounded-lg border-2 border-slate-200 bg-white"
          onMouseMove={handleTimelineMouseMove}
          onMouseUp={handleTimelineMouseUp}
          onMouseLeave={handleTimelineMouseUp}
        >
          {/* Time Markers */}
          <div className="absolute inset-0 flex">
            {[0, 0.25, 0.5, 0.75, 1].map((time) => (
              <div
                key={time}
                className="absolute bottom-0 top-0 border-l border-slate-300"
                style={{ left: `${time * 100}%` }}
              >
                <span className="absolute -bottom-6 -translate-x-1/2 text-xs text-slate-500">
                  {(time * preset.config.duration).toFixed(0)}ms
                </span>
              </div>
            ))}
          </div>

          {/* Playhead */}
          {isPlaying && (
            <div
              className="absolute bottom-0 top-0 z-10 w-0.5 bg-[#10B981]"
              style={{ left: `${playheadPosition * 100}%` }}
            >
              <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#10B981]" />
            </div>
          )}

          {/* Keyframes */}
          {keyframes.map((keyframe, index) => (
            <div
              key={index}
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-move rounded-full transition-all ${
                selectedKeyframe === index
                  ? 'scale-125 bg-[#2563EB] ring-4 ring-[#2563EB]/30'
                  : 'bg-[#7C3AED] hover:scale-110'
              }`}
              style={{
                left: `${keyframe.time * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseDown={(e) => handleKeyframeMouseDown(index, e)}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-slate-700">
                {(keyframe.time * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe Properties Editor */}
      {selectedKeyframe !== null && keyframes[selectedKeyframe] && (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Keyframe Properties (
              {(keyframes[selectedKeyframe].time * 100).toFixed(0)}%)
            </h3>
            <button
              onClick={() => handleDeleteKeyframe(selectedKeyframe)}
              className="rounded p-2 text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Opacity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Opacity
              </label>
              <input
                type="number"
                value={keyframes[selectedKeyframe].properties.opacity ?? 1}
                onChange={(e) =>
                  handlePropertyChange('opacity', parseFloat(e.target.value))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                min="0"
                max="1"
                step="0.1"
              />
            </div>

            {/* Scale */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Scale
              </label>
              <input
                type="number"
                value={keyframes[selectedKeyframe].properties.scale ?? 1}
                onChange={(e) =>
                  handlePropertyChange('scale', parseFloat(e.target.value))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                step="0.1"
              />
            </div>

            {/* X Position */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                X Position
              </label>
              <input
                type="number"
                value={keyframes[selectedKeyframe].properties.x ?? 0}
                onChange={(e) =>
                  handlePropertyChange('x', parseFloat(e.target.value))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* Y Position */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Y Position
              </label>
              <input
                type="number"
                value={keyframes[selectedKeyframe].properties.y ?? 0}
                onChange={(e) =>
                  handlePropertyChange('y', parseFloat(e.target.value))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Rotation (deg)
              </label>
              <input
                type="number"
                value={keyframes[selectedKeyframe].properties.rotation ?? 0}
                onChange={(e) =>
                  handlePropertyChange('rotation', parseFloat(e.target.value))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* SkewX */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Skew X (deg)
              </label>
              <input
                type="number"
                value={keyframes[selectedKeyframe].properties.skewX ?? 0}
                onChange={(e) =>
                  handlePropertyChange('skewX', parseFloat(e.target.value))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {keyframes.length === 0 && (
        <div className="rounded-lg bg-slate-50 py-12 text-center">
          <p className="mb-4 text-slate-600">
            No keyframes yet. Add your first keyframe to start building the
            timeline.
          </p>
          <button
            onClick={handleAddKeyframe}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1d4ed8]"
          >
            <Plus className="h-4 w-4" />
            Add First Keyframe
          </button>
        </div>
      )}
    </div>
  );
}
