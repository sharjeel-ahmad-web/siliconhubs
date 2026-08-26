'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Eye,
  MousePointer,
  Clock,
  Scroll,
} from 'lucide-react';
import { AnimationPreset, TriggerConfig } from './AnimationPresetLibrary';

interface TriggerManagerProps {
  preset: AnimationPreset;
  onChange: (preset: AnimationPreset) => void;
  onSave: (preset: AnimationPreset) => void;
}

const TRIGGER_TYPES = [
  {
    value: 'scroll',
    label: 'Scroll Position',
    icon: Scroll,
    description: 'Trigger when element scrolls into view',
  },
  {
    value: 'visibility',
    label: 'Element Visibility',
    icon: Eye,
    description: 'Trigger when element becomes visible',
  },
  {
    value: 'hover',
    label: 'Hover',
    icon: MousePointer,
    description: 'Trigger on mouse hover',
  },
  {
    value: 'click',
    label: 'Click',
    icon: MousePointer,
    description: 'Trigger on click',
  },
  {
    value: 'time',
    label: 'Time Delay',
    icon: Clock,
    description: 'Trigger after time delay',
  },
];

export function TriggerManager({
  preset,
  onChange,
  onSave,
}: TriggerManagerProps) {
  const [triggers, setTriggers] = useState<TriggerConfig[]>(
    preset.config.triggers || []
  );
  const [selectedTrigger, setSelectedTrigger] = useState<number | null>(null);

  const handleAddTrigger = (type: string) => {
    const defaultOptions: Record<string, any> = {
      scroll: { start: 'top bottom', end: 'bottom top', scrub: false },
      visibility: { threshold: 0.5, once: true },
      hover: { delay: 0 },
      click: { preventDefault: false },
      time: { delay: 1000 },
    };

    const newTrigger: TriggerConfig = {
      type: type as any,
      options: defaultOptions[type] || {},
    };

    const updatedTriggers = [...triggers, newTrigger];
    setTriggers(updatedTriggers);
    updatePreset(updatedTriggers);
    setSelectedTrigger(updatedTriggers.length - 1);
  };

  const handleDeleteTrigger = (index: number) => {
    const updatedTriggers = triggers.filter((_, i) => i !== index);
    setTriggers(updatedTriggers);
    updatePreset(updatedTriggers);
    if (selectedTrigger === index) {
      setSelectedTrigger(null);
    }
  };

  const handleUpdateTrigger = (index: number, options: Record<string, any>) => {
    const updatedTriggers = [...triggers];
    updatedTriggers[index] = {
      ...updatedTriggers[index],
      options,
    };
    setTriggers(updatedTriggers);
    updatePreset(updatedTriggers);
  };

  const updatePreset = (updatedTriggers: TriggerConfig[]) => {
    const updatedPreset = {
      ...preset,
      config: {
        ...preset.config,
        triggers: updatedTriggers,
      },
    };
    onChange(updatedPreset);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Trigger Manager</h2>
          <p className="mt-1 text-sm text-slate-600">
            Configure when and how animations are triggered
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
        {/* Trigger Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Add Trigger</h3>
          <div className="space-y-2">
            {TRIGGER_TYPES.map((triggerType) => {
              const Icon = triggerType.icon;
              return (
                <button
                  key={triggerType.value}
                  onClick={() => handleAddTrigger(triggerType.value)}
                  className="flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-[#2563EB] hover:bg-slate-50"
                >
                  <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2563EB]" />
                  <div>
                    <div className="font-medium text-slate-900">
                      {triggerType.label}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {triggerType.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Triggers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Active Triggers ({triggers.length})
          </h3>

          {triggers.length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-8 text-center">
              <p className="text-slate-600">
                No triggers configured. Add a trigger to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {triggers.map((trigger, index) => {
                const triggerType = TRIGGER_TYPES.find(
                  (t) => t.value === trigger.type
                );
                const Icon = triggerType?.icon || MousePointer;

                return (
                  <div
                    key={index}
                    className={`rounded-lg border-2 bg-white transition-all ${
                      selectedTrigger === index
                        ? 'border-[#2563EB]'
                        : 'border-slate-200'
                    }`}
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between p-4"
                      onClick={() =>
                        setSelectedTrigger(
                          selectedTrigger === index ? null : index
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-[#2563EB]" />
                        <div>
                          <div className="font-medium capitalize text-slate-900">
                            {trigger.type}
                          </div>
                          <div className="text-sm text-slate-600">
                            {triggerType?.description}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrigger(index);
                        }}
                        className="rounded p-2 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Trigger Options */}
                    {selectedTrigger === index && (
                      <div className="space-y-4 border-t border-slate-200 bg-slate-50 p-4">
                        {trigger.type === 'scroll' && (
                          <>
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700">
                                Start Position
                              </label>
                              <input
                                type="text"
                                value={trigger.options.start || 'top bottom'}
                                onChange={(e) =>
                                  handleUpdateTrigger(index, {
                                    ...trigger.options,
                                    start: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="top bottom"
                              />
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700">
                                End Position
                              </label>
                              <input
                                type="text"
                                value={trigger.options.end || 'bottom top'}
                                onChange={(e) =>
                                  handleUpdateTrigger(index, {
                                    ...trigger.options,
                                    end: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="bottom top"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`scrub-${index}`}
                                checked={trigger.options.scrub || false}
                                onChange={(e) =>
                                  handleUpdateTrigger(index, {
                                    ...trigger.options,
                                    scrub: e.target.checked,
                                  })
                                }
                                className="h-4 w-4 rounded text-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
                              />
                              <label
                                htmlFor={`scrub-${index}`}
                                className="text-sm text-slate-700"
                              >
                                Scrub (link animation to scroll position)
                              </label>
                            </div>
                          </>
                        )}

                        {trigger.type === 'visibility' && (
                          <>
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700">
                                Threshold (0-1)
                              </label>
                              <input
                                type="number"
                                value={trigger.options.threshold || 0.5}
                                onChange={(e) =>
                                  handleUpdateTrigger(index, {
                                    ...trigger.options,
                                    threshold: parseFloat(e.target.value),
                                  })
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                                min="0"
                                max="1"
                                step="0.1"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`once-${index}`}
                                checked={trigger.options.once !== false}
                                onChange={(e) =>
                                  handleUpdateTrigger(index, {
                                    ...trigger.options,
                                    once: e.target.checked,
                                  })
                                }
                                className="h-4 w-4 rounded text-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
                              />
                              <label
                                htmlFor={`once-${index}`}
                                className="text-sm text-slate-700"
                              >
                                Trigger only once
                              </label>
                            </div>
                          </>
                        )}

                        {trigger.type === 'hover' && (
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Delay (ms)
                            </label>
                            <input
                              type="number"
                              value={trigger.options.delay || 0}
                              onChange={(e) =>
                                handleUpdateTrigger(index, {
                                  ...trigger.options,
                                  delay: parseInt(e.target.value),
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                              min="0"
                              step="100"
                            />
                          </div>
                        )}

                        {trigger.type === 'time' && (
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Delay (ms)
                            </label>
                            <input
                              type="number"
                              value={trigger.options.delay || 1000}
                              onChange={(e) =>
                                handleUpdateTrigger(index, {
                                  ...trigger.options,
                                  delay: parseInt(e.target.value),
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                              min="0"
                              step="100"
                            />
                          </div>
                        )}

                        {trigger.type === 'click' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`prevent-${index}`}
                              checked={trigger.options.preventDefault || false}
                              onChange={(e) =>
                                handleUpdateTrigger(index, {
                                  ...trigger.options,
                                  preventDefault: e.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded text-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
                            />
                            <label
                              htmlFor={`prevent-${index}`}
                              className="text-sm text-slate-700"
                            >
                              Prevent default action
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
