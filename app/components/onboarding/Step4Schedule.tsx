import React from 'react';
import { ScheduleConfig, DaySchedule } from '@/lib/onboarding-types';
import { SCHEDULE_PRESETS } from '@/lib/onboarding-constants';
import { FormCheckbox } from './shared/FormCheckbox';
import { FormTimePicker } from './shared/FormTimePicker';
import { StepContainer } from './StepContainer';
import { Zap } from 'lucide-react';

interface Step4ScheduleProps {
  data: ScheduleConfig;
  onChange: (data: ScheduleConfig) => void;
  errors?: string[];
}

const DAYS = [
  { key: 'monday' as keyof ScheduleConfig, label: 'Lunes' },
  { key: 'tuesday' as keyof ScheduleConfig, label: 'Martes' },
  { key: 'wednesday' as keyof ScheduleConfig, label: 'Miércoles' },
  { key: 'thursday' as keyof ScheduleConfig, label: 'Jueves' },
  { key: 'friday' as keyof ScheduleConfig, label: 'Viernes' },
  { key: 'saturday' as keyof ScheduleConfig, label: 'Sábado' },
  { key: 'sunday' as keyof ScheduleConfig, label: 'Domingo' }
];

export const Step4Schedule: React.FC<Step4ScheduleProps> = ({
  data,
  onChange,
  errors = []
}) => {
  const updateDay = (day: keyof ScheduleConfig, field: keyof DaySchedule, value: any) => {
    onChange({
      ...data,
      [day]: {
        ...data[day],
        [field]: value
      }
    });
  };

  const applyPreset = (presetKey: string) => {
    const preset = SCHEDULE_PRESETS[presetKey as keyof typeof SCHEDULE_PRESETS];
    if (preset) {
      onChange(preset.schedule);
    }
  };

  return (
    <StepContainer
      title="Horarios de Operación"
      description="Define los días y horarios en que tu negocio atiende"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Quick presets */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Plantillas rápidas:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SCHEDULE_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Days schedule */}
        <div className="space-y-3">
          {DAYS.map(({ key, label }) => {
            const dayData = data[key];
            return (
              <div
                key={key}
                className={`border rounded-lg p-4 transition ${
                  dayData.enabled ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${key}-enabled`}
                      checked={dayData.enabled}
                      onChange={(e) => updateDay(key, 'enabled', e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                  </div>

                  {/* Day label */}
                  <label
                    htmlFor={`${key}-enabled`}
                    className="min-w-[100px] font-medium text-gray-900 cursor-pointer"
                  >
                    {label}
                  </label>

                  {/* Time pickers */}
                  {dayData.enabled ? (
                    <div className="flex items-center gap-3 flex-1">
                      <FormTimePicker
                        label=""
                        name={`${key}-open`}
                        value={dayData.open}
                        onChange={(value) => updateDay(key, 'open', value)}
                        className="mb-0 flex-1"
                      />
                      <span className="text-gray-500">a</span>
                      <FormTimePicker
                        label=""
                        name={`${key}-close`}
                        value={dayData.close}
                        onChange={(value) => updateDay(key, 'close', value)}
                        className="mb-0 flex-1"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">Cerrado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation message */}
        {!Object.values(data).some(day => day.enabled) && (
          <p className="text-sm text-red-600 text-center">
            Debes habilitar al menos un día de operación
          </p>
        )}
      </div>
    </StepContainer>
  );
};
