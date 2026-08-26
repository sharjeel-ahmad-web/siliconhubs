'use client';

import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { AnimationPreset, ConditionConfig } from './AnimationPresetLibrary';

interface ConditionBuilderProps {
  preset: AnimationPreset;
  onChange: (preset: AnimationPreset) => void;
  onSave: (preset: AnimationPreset) => void;
}

const CONDITION_TYPES = [
  { value: 'viewport_width', label: 'Viewport Width', unit: 'px' },
  { value: 'viewport_height', label: 'Viewport Height', unit: 'px' },
  { value: 'device_type', label: 'Device Type', unit: '' },
  { value: 'scroll_position', label: 'Scroll Position', unit: 'px' },
  { value: 'time_of_day', label: 'Time of Day', unit: '' },
  { value: 'user_preference', label: 'User Preference', unit: '' },
  { value: 'battery_level', label: 'Battery Level', unit: '%' },
  { value: 'connection_speed', label: 'Connection Speed', unit: '' },
  { value: 'reduced_motion', label: 'Reduced Motion', unit: '' },
];

const OPERATORS = [
  { value: 'equals', label: 'Equals (=)' },
  { value: 'not_equals', label: 'Not Equals (≠)' },
  { value: 'greater_than', label: 'Greater Than (>)' },
  { value: 'less_than', label: 'Less Than (<)' },
  { value: 'greater_or_equal', label: 'Greater or Equal (≥)' },
  { value: 'less_or_equal', label: 'Less or Equal (≤)' },
];

export function ConditionBuilder({
  preset,
  onChange,
  onSave,
}: ConditionBuilderProps) {
  const [conditions, setConditions] = useState<ConditionConfig>(
    preset.config.conditions || { operator: 'AND', conditions: [] }
  );

  const handleAddCondition = () => {
    const newCondition = {
      type: 'viewport_width',
      operator: 'greater_than',
      value: 768,
    };

    const updatedConditions = {
      ...conditions,
      conditions: [...conditions.conditions, newCondition],
    };
    setConditions(updatedConditions);
    updatePreset(updatedConditions);
  };

  const handleDeleteCondition = (index: number) => {
    const updatedConditions = {
      ...conditions,
      conditions: conditions.conditions.filter((_, i) => i !== index),
    };
    setConditions(updatedConditions);
    updatePreset(updatedConditions);
  };

  const handleUpdateCondition = (index: number, field: string, value: any) => {
    const updatedConditions = {
      ...conditions,
      conditions: conditions.conditions.map((cond, i) =>
        i === index ? { ...cond, [field]: value } : cond
      ),
    };
    setConditions(updatedConditions);
    updatePreset(updatedConditions);
  };

  const handleOperatorChange = (operator: 'AND' | 'OR') => {
    const updatedConditions = {
      ...conditions,
      operator,
    };
    setConditions(updatedConditions);
    updatePreset(updatedConditions);
  };

  const updatePreset = (updatedConditions: ConditionConfig) => {
    const updatedPreset = {
      ...preset,
      config: {
        ...preset.config,
        conditions: updatedConditions,
      },
    };
    onChange(updatedPreset);
  };

  const getConditionTypeInfo = (type: string) => {
    return CONDITION_TYPES.find((t) => t.value === type) || CONDITION_TYPES[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Condition Builder
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Define conditions that must be met for the animation to trigger
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

      {/* Logical Operator */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Logical Operator
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleOperatorChange('AND')}
            className={`flex-1 rounded-lg border-2 px-6 py-4 transition-all ${
              conditions.operator === 'AND'
                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-lg font-semibold">AND</div>
            <div className="mt-1 text-sm opacity-90">
              All conditions must be true
            </div>
          </button>
          <button
            onClick={() => handleOperatorChange('OR')}
            className={`flex-1 rounded-lg border-2 px-6 py-4 transition-all ${
              conditions.operator === 'OR'
                ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-lg font-semibold">OR</div>
            <div className="mt-1 text-sm opacity-90">
              At least one condition must be true
            </div>
          </button>
        </div>
      </div>

      {/* Conditions List */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Conditions ({conditions.conditions.length})
          </h3>
          <button
            onClick={handleAddCondition}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1d4ed8]"
          >
            <Plus className="h-4 w-4" />
            Add Condition
          </button>
        </div>

        {conditions.conditions.length === 0 ? (
          <div className="rounded-lg bg-slate-50 p-8 text-center">
            <p className="text-slate-600">
              No conditions set. Animation will trigger without restrictions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conditions.conditions.map((condition, index) => {
              const typeInfo = getConditionTypeInfo(condition.type);

              return (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Condition Number */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB] font-semibold text-white">
                      {index + 1}
                    </div>

                    {/* Condition Fields */}
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                      {/* Type */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Condition Type
                        </label>
                        <select
                          value={condition.type}
                          onChange={(e) =>
                            handleUpdateCondition(index, 'type', e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                        >
                          {CONDITION_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Operator */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Operator
                        </label>
                        <select
                          value={condition.operator || 'equals'}
                          onChange={(e) =>
                            handleUpdateCondition(
                              index,
                              'operator',
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                        >
                          {OPERATORS.map((op) => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Value */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Value {typeInfo.unit && `(${typeInfo.unit})`}
                        </label>
                        {condition.type === 'device_type' ? (
                          <select
                            value={condition.value}
                            onChange={(e) =>
                              handleUpdateCondition(
                                index,
                                'value',
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                          >
                            <option value="mobile">Mobile</option>
                            <option value="tablet">Tablet</option>
                            <option value="desktop">Desktop</option>
                          </select>
                        ) : condition.type === 'reduced_motion' ? (
                          <select
                            value={condition.value}
                            onChange={(e) =>
                              handleUpdateCondition(
                                index,
                                'value',
                                e.target.value === 'true'
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                          >
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                          </select>
                        ) : condition.type === 'connection_speed' ? (
                          <select
                            value={condition.value}
                            onChange={(e) =>
                              handleUpdateCondition(
                                index,
                                'value',
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                          >
                            <option value="slow-2g">Slow 2G</option>
                            <option value="2g">2G</option>
                            <option value="3g">3G</option>
                            <option value="4g">4G</option>
                          </select>
                        ) : (
                          <input
                            type="number"
                            value={condition.value}
                            onChange={(e) =>
                              handleUpdateCondition(
                                index,
                                'value',
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
                          />
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteCondition(index)}
                      className="flex-shrink-0 rounded p-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Logical Operator Between Conditions */}
                  {index < conditions.conditions.length - 1 && (
                    <div className="mt-3 border-t border-slate-300 pt-3 text-center">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          conditions.operator === 'AND'
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#7C3AED] text-white'
                        }`}
                      >
                        {conditions.operator}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Condition Summary */}
      {conditions.conditions.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Condition Summary
          </h3>
          <div className="space-y-1 text-sm text-slate-700">
            <p className="font-medium">Animation will trigger when:</p>
            <ul className="ml-2 list-inside list-disc space-y-1">
              {conditions.conditions.map((condition, index) => {
                const typeInfo = getConditionTypeInfo(condition.type);
                const operator =
                  OPERATORS.find((o) => o.value === condition.operator)
                    ?.label || condition.operator;
                return (
                  <li key={index}>
                    {typeInfo.label} {operator} {condition.value}
                    {typeInfo.unit}
                    {index < conditions.conditions.length - 1 && (
                      <span className="ml-2 font-semibold text-[#2563EB]">
                        {conditions.operator}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
