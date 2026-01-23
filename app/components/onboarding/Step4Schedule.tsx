import React, { useState } from 'react';
import { ScheduleConfig, DaySchedule } from '@/lib/onboarding-types';
import { SCHEDULE_PRESETS } from '@/lib/onboarding-constants';
import { FormTimePicker } from './shared/FormTimePicker';
import { StepContainer } from './StepContainer';
import { Zap, Copy, Info, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface Step4ScheduleProps {
  data: ScheduleConfig;
  onChange: (data: ScheduleConfig) => void;
  errors?: string[];
}

const DAYS = [
  { key: 'monday' as keyof ScheduleConfig, label: 'Lunes', short: 'Lun' },
  { key: 'tuesday' as keyof ScheduleConfig, label: 'Martes', short: 'Mar' },
  { key: 'wednesday' as keyof ScheduleConfig, label: 'Miércoles', short: 'Mié' },
  { key: 'thursday' as keyof ScheduleConfig, label: 'Jueves', short: 'Jue' },
  { key: 'friday' as keyof ScheduleConfig, label: 'Viernes', short: 'Vie' },
  { key: 'saturday' as keyof ScheduleConfig, label: 'Sábado', short: 'Sáb' },
  { key: 'sunday' as keyof ScheduleConfig, label: 'Domingo', short: 'Dom' }
];

export const Step4Schedule: React.FC<Step4ScheduleProps> = ({
  data,
  onChange,
  errors = []
}) => {
  const [copyFromDay, setCopyFromDay] = useState<keyof ScheduleConfig | null>(null);

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

  const copyToAllDays = (sourceDay: keyof ScheduleConfig) => {
    const sourceSchedule = data[sourceDay];
    const newSchedule = { ...data };

    DAYS.forEach(({ key }) => {
      newSchedule[key] = { ...sourceSchedule };
    });

    onChange(newSchedule);
    setCopyFromDay(null);
  };

  const copyToWeekdays = (sourceDay: keyof ScheduleConfig) => {
    const sourceSchedule = data[sourceDay];
    const newSchedule = { ...data };

    const weekdays: (keyof ScheduleConfig)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    weekdays.forEach((key) => {
      newSchedule[key] = { ...sourceSchedule };
    });

    onChange(newSchedule);
    setCopyFromDay(null);
  };

  const validateTime = (day: DaySchedule): boolean => {
    if (!day.enabled) return true;

    const [openHours, openMinutes] = day.open.split(':').map(Number);
    const [closeHours, closeMinutes] = day.close.split(':').map(Number);

    const openTime = openHours * 60 + openMinutes;
    const closeTime = closeHours * 60 + closeMinutes;

    return closeTime > openTime;
  };

  const getEnabledDays = () => {
    return DAYS.filter(({ key }) => data[key].enabled);
  };

  const getTotalHoursPerWeek = (): number => {
    let totalMinutes = 0;

    DAYS.forEach(({ key }) => {
      const day = data[key];
      if (day.enabled) {
        const [openHours, openMinutes] = day.open.split(':').map(Number);
        const [closeHours, closeMinutes] = day.close.split(':').map(Number);

        const openTime = openHours * 60 + openMinutes;
        const closeTime = closeHours * 60 + closeMinutes;

        totalMinutes += closeTime - openTime;
      }
    });

    return Math.round(totalMinutes / 60);
  };

  const formatTimeRange = (day: DaySchedule): string => {
    if (!day.enabled) return 'Cerrado';
    return `${day.open} - ${day.close}`;
  };

  return (
    <StepContainer
      title="Horarios de Operación"
      description="Define los días y horarios en que tu negocio atiende clientes"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Información contextual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                ¿Para qué sirven los horarios?
              </h4>
              <p className="text-sm text-blue-800">
                Tu asistente de IA usará estos horarios para saber cuándo puede agendar citas.
                Solo ofrecerá disponibilidad dentro de estos rangos de tiempo. Por ejemplo, si
                configuras "9:00 - 18:00", el asistente NUNCA agendará citas a las 7:00 PM.
              </p>
            </div>
          </div>
        </div>

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
                title={`Aplicar horario: ${preset.label}`}
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
            const isValid = validateTime(dayData);

            return (
              <div
                key={key}
                className={`border rounded-lg p-4 transition ${
                  dayData.enabled
                    ? isValid
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      id={`${key}-enabled`}
                      checked={dayData.enabled}
                      onChange={(e) => updateDay(key, 'enabled', e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      aria-label={`Habilitar ${label}`}
                    />
                  </div>

                  <div className="flex-1">
                    {/* Day label */}
                    <label
                      htmlFor={`${key}-enabled`}
                      className="block font-medium text-gray-900 cursor-pointer mb-2"
                    >
                      {label}
                    </label>

                    {/* Time pickers */}
                    {dayData.enabled ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <FormTimePicker
                            label=""
                            name={`${key}-open`}
                            value={dayData.open}
                            onChange={(value) => updateDay(key, 'open', value)}
                            className="mb-0 flex-1"
                          />
                          <span className="text-gray-500 font-medium">a</span>
                          <FormTimePicker
                            label=""
                            name={`${key}-close`}
                            value={dayData.close}
                            onChange={(value) => updateDay(key, 'close', value)}
                            className="mb-0 flex-1"
                          />
                        </div>

                        {/* Validation error */}
                        {!isValid && (
                          <div className="flex items-start text-sm text-red-600">
                            <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                            <span>La hora de cierre debe ser después de la hora de apertura</span>
                          </div>
                        )}

                        {/* Copy buttons */}
                        {isValid && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => copyToWeekdays(key)}
                              className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center"
                              title="Copiar este horario a Lunes-Viernes"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copiar a días laborables
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              type="button"
                              onClick={() => copyToAllDays(key)}
                              className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center"
                              title="Copiar este horario a todos los días"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copiar a todos
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic text-sm">Cerrado</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation message */}
        {!Object.values(data).some(day => day.enabled) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <strong>Error:</strong> Debes habilitar al menos un día de operación para que
                tu asistente pueda agendar citas.
              </div>
            </div>
          </div>
        )}

        {/* Warning for 24/7 schedule */}
        {DAYS.every(({ key }) => {
          const day = data[key];
          return day.enabled && day.open === '00:00' && day.close === '23:59';
        }) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Nota:</strong> Has configurado un horario 24/7. Asegúrate de tener
                personal disponible en todo momento o considera ajustar los horarios.
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {getEnabledDays().length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-2">
                  Resumen de horarios
                </h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Días habilitados:</span>
                      <div className="font-medium text-gray-900 mt-1">
                        {getEnabledDays().map(({ short }) => short).join(', ')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total de horas por semana:</span>
                      <div className="font-medium text-gray-900 mt-1">
                        {getTotalHoursPerWeek()} horas
                      </div>
                    </div>
                  </div>

                  {/* Quick view of all days */}
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="text-xs text-gray-600 mb-2 font-medium">Vista rápida:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                      {DAYS.map(({ key, label }) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-700">{label}:</span>
                          <span className={data[key].enabled ? 'text-green-700 font-medium' : 'text-gray-500'}>
                            {formatTimeRange(data[key])}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help tips */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <strong className="text-gray-900">Consejos útiles:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Usa las plantillas rápidas para configurar horarios comunes</li>
                <li>Puedes copiar el horario de un día a todos los demás con el botón "Copiar"</li>
                <li>El asistente de IA respetará estrictamente estos horarios</li>
                <li>Puedes ajustar los horarios más adelante desde el dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};
