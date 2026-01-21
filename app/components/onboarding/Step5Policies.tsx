import React from 'react';
import { BusinessPolicies } from '@/lib/onboarding-types';
import { ADVANCE_BOOKING_OPTIONS, CANCELLATION_HOURS_OPTIONS } from '@/lib/onboarding-constants';
import { FormSelect } from './shared/FormSelect';
import { FormCheckbox } from './shared/FormCheckbox';
import { FormInput } from './shared/FormInput';
import { StepContainer } from './StepContainer';
import { Info } from 'lucide-react';

interface Step5PoliciesProps {
  data: BusinessPolicies;
  onChange: (data: BusinessPolicies) => void;
  errors?: string[];
}

export const Step5Policies: React.FC<Step5PoliciesProps> = ({
  data,
  onChange,
  errors = []
}) => {
  const updateField = (field: keyof BusinessPolicies, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <StepContainer
      title="Políticas del Negocio"
      description="Define las reglas para reservas y cancelaciones"
      errors={errors}
    >
      <div className="space-y-8">
        {/* Advance booking */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⏰</span>
            <h3 className="text-lg font-semibold text-gray-900">Reserva Anticipada</h3>
          </div>
          <FormSelect
            label="Mínimo de horas de anticipación"
            name="minAdvanceBooking"
            value={data.minAdvanceBooking}
            onChange={(value) => updateField('minAdvanceBooking', parseInt(value))}
            options={ADVANCE_BOOKING_OPTIONS}
            required
          />
          <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mt-2">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p>
              Tiempo mínimo que debe pasar entre el momento de la reserva y la cita programada
            </p>
          </div>
        </div>

        {/* Cancellations */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">❌</span>
            <h3 className="text-lg font-semibold text-gray-900">Cancelaciones</h3>
          </div>

          <FormCheckbox
            label="Permitir cancelaciones"
            name="allowCancellation"
            checked={data.allowCancellation}
            onChange={(checked) => updateField('allowCancellation', checked)}
            description="Los clientes podrán cancelar sus citas a través de WhatsApp"
            className="mb-4"
          />

          {data.allowCancellation && (
            <FormSelect
              label="Tiempo mínimo para cancelar"
              name="minCancellationHours"
              value={data.minCancellationHours}
              onChange={(value) => updateField('minCancellationHours', parseInt(value))}
              options={CANCELLATION_HOURS_OPTIONS}
              required
            />
          )}
        </div>

        {/* Deposit */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💰</span>
            <h3 className="text-lg font-semibold text-gray-900">Depósito</h3>
          </div>

          <FormCheckbox
            label="Requiere depósito"
            name="requireDeposit"
            checked={data.requireDeposit}
            onChange={(checked) => updateField('requireDeposit', checked)}
            description="Solicitar un pago anticipado para confirmar la reserva"
            className="mb-4"
          />

          {data.requireDeposit && (
            <>
              <FormInput
                label="Monto del depósito"
                name="depositAmount"
                type="number"
                value={data.depositAmount || 0}
                onChange={(value) => updateField('depositAmount', parseFloat(value) || 0)}
                placeholder="0.00"
                required
              />
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-amber-50 p-3 rounded-lg mt-2 border border-amber-200">
                <span className="text-lg">ℹ️</span>
                <p>
                  Este monto será solicitado al cliente antes de confirmar su reserva.
                  Puedes configurar el método de pago más adelante.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Summary card */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Resumen de Políticas</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>
                Los clientes deben reservar con al menos{' '}
                <strong>{data.minAdvanceBooking} hora{data.minAdvanceBooking !== 1 ? 's' : ''}</strong> de anticipación
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>
                Cancelaciones:{' '}
                {data.allowCancellation ? (
                  <>
                    permitidas con{' '}
                    <strong>
                      {data.minCancellationHours === 0
                        ? 'sin restricción'
                        : `${data.minCancellationHours} hora${data.minCancellationHours !== 1 ? 's' : ''} de anticipación`}
                    </strong>
                  </>
                ) : (
                  <strong>no permitidas</strong>
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>
                Depósito:{' '}
                {data.requireDeposit ? (
                  <strong>${data.depositAmount || 0} requerido</strong>
                ) : (
                  <strong>no requerido</strong>
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </StepContainer>
  );
};
