'use client';

import { useState, useEffect } from 'react';
import { Plus, Play, Edit, Trash2, Copy } from 'lucide-react';
import { PresetCard } from './PresetCard';
import { PresetEditor } from './PresetEditor';
import { TimelineEditor } from './TimelineEditor';
import { EasingCurveEditor } from './EasingCurveEditor';
import { TriggerManager } from './TriggerManager';
import { ConditionBuilder } from './ConditionBuilder';
import { DebugMode } from './DebugMode';

export interface AnimationPreset {
  id: number;
  name: string;
  description: string;
  preset_type: 'scroll' | 'hover' | 'entrance';
  config: {
    duration: number;
    easing: string;
    properties: Record<string, any>;
    timeline?: TimelineKeyframe[];
    triggers?: TriggerConfig[];
    conditions?: ConditionConfig;
  };
  created_at: string;
  updated_at: string;
}

export interface TimelineKeyframe {
  time: number; // 0-1 normalized time
  properties: Record<string, any>;
}

export interface TriggerConfig {
  type: 'scroll' | 'hover' | 'click' | 'time' | 'visibility';
  options: Record<string, any>;
}

export interface ConditionConfig {
  operator: 'AND' | 'OR';
  conditions: Array<{
    type: string;
    operator?: string;
    value: any;
  }>;
}

export function AnimationPresetLibrary() {
  const [presets, setPresets] = useState<AnimationPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<AnimationPreset | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'presets' | 'timeline' | 'easing' | 'triggers' | 'conditions' | 'debug'
  >('presets');
  const [loading, setLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const response = await fetch('/api/admin/animation-presets');
      if (response.ok) {
        const data = await response.json();
        setPresets(data);
      }
    } catch (error) {
      console.error('Failed to fetch presets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePreset = () => {
    setSelectedPreset({
      id: 0,
      name: 'New Preset',
      description: '',
      preset_type: 'entrance',
      config: {
        duration: 1000,
        easing: 'power2.out',
        properties: {},
        timeline: [],
        triggers: [],
        conditions: { operator: 'AND', conditions: [] },
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleSavePreset = async (preset: AnimationPreset) => {
    try {
      const url =
        preset.id === 0
          ? '/api/admin/animation-presets'
          : `/api/admin/animation-presets/${preset.id}`;

      const method = preset.id === 0 ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preset),
      });

      if (response.ok) {
        await fetchPresets();
        setIsEditing(false);
        setIsCreating(false);
        setSelectedPreset(null);
      }
    } catch (error) {
      console.error('Failed to save preset:', error);
    }
  };

  const handleDeletePreset = async (id: number) => {
    if (!confirm('Are you sure you want to delete this preset?')) return;

    try {
      const response = await fetch(`/api/admin/animation-presets/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPresets();
        if (selectedPreset?.id === id) {
          setSelectedPreset(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete preset:', error);
    }
  };

  const handleDuplicatePreset = async (preset: AnimationPreset) => {
    const duplicated = {
      ...preset,
      id: 0,
      name: `${preset.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSelectedPreset(duplicated);
    setIsCreating(true);
    setIsEditing(true);
  };

  const filterPresetsByType = (type: string) => {
    if (type === 'all') return presets;
    return presets.filter((p) => p.preset_type === type);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Animation Presets
          </h1>
          <p className="mt-1 text-slate-600">
            Create and manage animation presets with visual timeline editor
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`rounded-lg px-4 py-2 transition-colors ${
              debugMode
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {debugMode ? 'Debug On' : 'Debug Off'}
          </button>
          <button
            onClick={handleCreatePreset}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1d4ed8]"
          >
            <Plus className="h-5 w-5" />
            New Preset
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="flex gap-1 p-2">
            {[
              { id: 'presets', label: 'Presets' },
              {
                id: 'timeline',
                label: 'Timeline Editor',
                disabled: !selectedPreset,
              },
              {
                id: 'easing',
                label: 'Easing Curves',
                disabled: !selectedPreset,
              },
              { id: 'triggers', label: 'Triggers', disabled: !selectedPreset },
              {
                id: 'conditions',
                label: 'Conditions',
                disabled: !selectedPreset,
              },
              { id: 'debug', label: 'Debug', disabled: !debugMode },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                disabled={tab.disabled}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#2563EB] text-white'
                    : tab.disabled
                      ? 'cursor-not-allowed text-slate-400'
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Presets Tab */}
          {activeTab === 'presets' && (
            <div className="space-y-6">
              {/* Filter Tabs */}
              <div className="flex gap-2">
                {['all', 'scroll', 'hover', 'entrance'].map((type) => (
                  <button
                    key={type}
                    className="rounded-lg bg-slate-100 px-4 py-2 capitalize text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    {type} (
                    {type === 'all'
                      ? presets.length
                      : filterPresetsByType(type).length}
                    )
                  </button>
                ))}
              </div>

              {/* Preset Grid */}
              {presets.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-slate-600">
                    No presets yet. Create your first preset!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {presets.map((preset) => (
                    <PresetCard
                      key={preset.id}
                      preset={preset}
                      onSelect={() => {
                        setSelectedPreset(preset);
                        setIsEditing(false);
                      }}
                      onEdit={() => {
                        setSelectedPreset(preset);
                        setIsEditing(true);
                      }}
                      onDelete={() => handleDeletePreset(preset.id)}
                      onDuplicate={() => handleDuplicatePreset(preset)}
                      isSelected={selectedPreset?.id === preset.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timeline Editor Tab */}
          {activeTab === 'timeline' && selectedPreset && (
            <TimelineEditor
              preset={selectedPreset}
              onChange={(updatedPreset) => setSelectedPreset(updatedPreset)}
              onSave={handleSavePreset}
            />
          )}

          {/* Easing Curve Editor Tab */}
          {activeTab === 'easing' && selectedPreset && (
            <EasingCurveEditor
              preset={selectedPreset}
              onChange={(updatedPreset) => setSelectedPreset(updatedPreset)}
              onSave={handleSavePreset}
            />
          )}

          {/* Trigger Manager Tab */}
          {activeTab === 'triggers' && selectedPreset && (
            <TriggerManager
              preset={selectedPreset}
              onChange={(updatedPreset) => setSelectedPreset(updatedPreset)}
              onSave={handleSavePreset}
            />
          )}

          {/* Condition Builder Tab */}
          {activeTab === 'conditions' && selectedPreset && (
            <ConditionBuilder
              preset={selectedPreset}
              onChange={(updatedPreset) => setSelectedPreset(updatedPreset)}
              onSave={handleSavePreset}
            />
          )}

          {/* Debug Mode Tab */}
          {activeTab === 'debug' && debugMode && (
            <DebugMode presets={presets} />
          )}
        </div>
      </div>

      {/* Preset Editor Modal */}
      {isEditing && selectedPreset && (
        <PresetEditor
          preset={selectedPreset}
          isOpen={isEditing}
          onClose={() => {
            setIsEditing(false);
            if (isCreating) {
              setSelectedPreset(null);
              setIsCreating(false);
            }
          }}
          onSave={handleSavePreset}
        />
      )}
    </div>
  );
}
