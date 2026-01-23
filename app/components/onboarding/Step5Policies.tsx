import React, { useState } from 'react';
import { BusinessPolicies } from '@/lib/onboarding-types';
import { ADVANCE_BOOKING_OPTIONS, CANCELLATION_HOURS_OPTIONS } from '@/lib/onboarding-constants';
import { FormSelect } from './shared/FormSelect';
import { FormCheckbox } from './shared/FormCheckbox';
import { FormInput } from './shared/FormInput';
import { StepContainer } from './StepContainer';
import { Info, AlertCircle, CheckCircle, Clock, XCircle, DollarSign, Lightbulb } from 'lucide-react';

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
  const [depositError, setDepositError] = useState<string>('');

  const updateField = (field: keyof BusinessPolicies, value: any) => {
    // Clear deposit error when toggling requireDeposit off
    if (field === 'requireDeposit' && value === false) {
      setDepositError('');
    }

    // Validate deposit amount
    if (field === 'depositAmount') {
      const amount = parseFloat(value) || 0;
      if (data.requireDeposit && amount <= 0) {
        setDepositError('El depósito debe ser mayor a 0');
      } else {
        setDepositError('');
      }
    }

    onChange({ ...data, [field]: value });
  };

  const getPolicyFlexibilityLevel = (): 'very-flexible' | 'balanced' | 'strict' => {
    const advanceBookingScore = data.minAdvanceBooking <= 2 ? 1 : data.minAdvanceBooking <= 12 ? 2 : 3;
    const cancellationScore = !data.allowCancellation ? 3 : data.minCancellationHours === 0 ? 1 : data.minCancellationHours <= 4 ? 2 : 3;
    const depositScore = !data.requireDeposit ? 1 : 3;

    const totalScore = advanceBookingScore + cancellationScore + depositScore;

    if (totalScore <= 4) return 'very-flexible';
    if (totalScore >= 8) return 'strict';
    return 'balanced';
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];

    // Very short advance booking
    if (data.minAdvanceBooking < 2) {
      recommendations.push('Con solo ' + data.minAdvanceBooking + ' hora de anticipación, podrías tener problemas con clientes que cancelan a último momento. Considera aumentar a 2-4 horas.');
    }

    // No cancellation policy
    if (!data.allowCancellation) {
      recommendations.push('No permitir cancelaciones puede frustrar a clientes con emergencias legítimas. Considera permitir cancelaciones con anticipación.');
    }

    // Deposit without cancellation policy
    if (data.requireDeposit && !data.allowCancellation) {
      recommendations.push('Requieres depósito pero no permites cancelaciones. Esto puede ser demasiado estricto para algunos clientes.');
    }

    // Very long cancellation window
    if (data.allowCancellation && data.minCancellationHours >= 48) {
      recommendations.push('Requieres ' + (data.minCancellationHours / 24) + ' días para cancelar. Esto puede ser muy restrictivo. La mayoría de negocios usan 4-24 horas.');
    }

    // Same-day cancellation allowed
    if (data.allowCancellation && data.minCancellationHours === 0) {
      recommendations.push('Permites cancelaciones sin restricción. Considera requerir al menos 2-4 horas de anticipación para evitar pérdida de tiempo.');
    }

    return recommendations;
  };

  const getExampleScenario = () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + data.minAdvanceBooking * 60 * 60 * 1000);

    const timeString = futureDate.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const dateString = futureDate.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    return {
      bookingExample: `Si un cliente quiere reservar AHORA (${now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })}), la cita más temprana será para ${timeString} (${dateString})`,
      cancellationExample: data.allowCancellation
        ? data.minCancellationHours === 0
          ? 'Clientes pueden cancelar en cualquier momento sin restricción'
          : `Clientes deben cancelar con al menos ${data.minCancellationHours} hora${data.minCancellationHours !== 1 ? 's' : ''} de anticipación`
        : 'No se permiten cancelaciones una vez confirmada la cita'
    };
  };

  const flexibilityLevel = getPolicyFlexibilityLevel();
  const recommendations = getRecommendations();
  const examples = getExampleScenario();

  return (
    <StepContainer
      title="Políticas del Negocio"
      description="Define las reglas para reservas, cancelaciones y pagos anticipados"
      errors={errors}
    >
      <div className="space-y-8">
        {/* Información contextual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                ¿Para qué sirven las políticas?
              </h4>
              <p className="text-sm text-blue-800">
                Tu asistente de IA aplicará estas reglas automáticamente cuando los clientes
                intenten agendar o cancelar citas. Por ejemplo, si configuras "4 horas de anticipación",
                el asistente rechazará automáticamente citas con menos tiempo y explicará al cliente
                cuándo puede reservar.
              </p>
            </div>
          </div>
        </div>

        {/* Advance booking */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Reserva Anticipada</h3>
          </div>
          <FormSelect
            label="Mínimo de horas de anticipación para reservar"
            name="minAdvanceBooking"
            value={data.minAdvanceBooking}
            onChange={(value) => updateField('minAdvanceBooking', parseInt(value))}
            options={ADVANCE_BOOKING_OPTIONS}
            required
          />
          <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2 border border-gray-200">
            <Info className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <p>
              Tiempo mínimo que debe pasar entre el momento de la reserva y la cita programada.
              Ejemplo: con 2 horas, si son las 10:00 AM, la cita más temprana será a las 12:00 PM.
            </p>
          </div>

          {/* Live example */}
          <div className="mt-3 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <strong>Ejemplo en vivo:</strong> {examples.bookingExample}
              </div>
            </div>
          </div>
        </div>

        {/* Cancellations */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-6 h-6 text-purple-600" />
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
            <>
              <FormSelect
                label="Tiempo mínimo para cancelar antes de la cita"
                name="minCancellationHours"
                value={data.minCancellationHours}
                onChange={(value) => updateField('minCancellationHours', parseInt(value))}
                options={CANCELLATION_HOURS_OPTIONS}
                required
              />
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2 border border-gray-200">
                <Info className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <p>
                  {data.minCancellationHours === 0
                    ? 'Sin restricción: clientes pueden cancelar hasta el último momento.'
                    : `Los clientes deben cancelar con al menos ${data.minCancellationHours} hora${data.minCancellationHours !== 1 ? 's' : ''} de anticipación. Si la cita es a las 3:00 PM y requieres 4 horas, deben cancelar antes de las 11:00 AM.`
                  }
                </p>
              </div>
            </>
          )}

          {!data.allowCancellation && (
            <div className="flex items-start gap-2 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p>
                No permitir cancelaciones puede ser frustrante para clientes con emergencias legítimas.
                Considera permitir cancelaciones con anticipación razonable.
              </p>
            </div>
          )}

          {/* Live example for cancellation */}
          <div className="mt-3 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <strong>Política aplicada:</strong> {examples.cancellationExample}
              </div>
            </div>
          </div>
        </div>

        {/* Deposit */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Depósito / Anticipo</h3>
          </div>

          <FormCheckbox
            label="Requiere depósito para confirmar la reserva"
            name="requireDeposit"
            checked={data.requireDeposit}
            onChange={(checked) => updateField('requireDeposit', checked)}
            description="Solicitar un pago anticipado ayuda a reducir ausencias sin aviso"
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
                error={depositError}
                helpText="Monto en la moneda que configuraste en Servicios"
              />
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-amber-50 p-3 rounded-lg mt-2 border border-amber-200">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 mb-1">Nota importante:</p>
                  <p className="text-amber-800">
                    El asistente de IA informará a los clientes sobre el depósito requerido,
                    pero el cobro debe configurarse manualmente con tu método de pago preferido
                    (transferencia, Stripe, PayPal, etc.)
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Recomendaciones
                </h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Flexibility indicator */}
        <div className={`border rounded-lg p-4 ${
          flexibilityLevel === 'very-flexible' ? 'bg-green-50 border-green-200' :
          flexibilityLevel === 'strict' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start">
            <CheckCircle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
              flexibilityLevel === 'very-flexible' ? 'text-green-600' :
              flexibilityLevel === 'strict' ? 'text-red-600' :
              'text-blue-600'
            }`} />
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${
                flexibilityLevel === 'very-flexible' ? 'text-green-900' :
                flexibilityLevel === 'strict' ? 'text-red-900' :
                'text-blue-900'
              }`}>
                {flexibilityLevel === 'very-flexible' ? '✅ Políticas Muy Flexibles' :
                 flexibilityLevel === 'strict' ? '⚠️ Políticas Estrictas' :
                 '✓ Políticas Balanceadas'}
              </h4>
              <p className={`text-sm ${
                flexibilityLevel === 'very-flexible' ? 'text-green-800' :
                flexibilityLevel === 'strict' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {flexibilityLevel === 'very-flexible'
                  ? 'Tus políticas son muy permisivas, lo que atraerá más clientes pero puede aumentar cancelaciones y ausencias.'
                  : flexibilityLevel === 'strict'
                  ? 'Tus políticas son restrictivas, lo que reduce ausencias pero puede desanimar a algunos clientes.'
                  : 'Tus políticas tienen un buen balance entre flexibilidad y protección de tu tiempo.'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            Resumen de Políticas
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Los clientes deben reservar con al menos{' '}
                <strong className="text-purple-700">
                  {data.minAdvanceBooking} hora{data.minAdvanceBooking !== 1 ? 's' : ''}
                </strong> de anticipación
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Cancelaciones:{' '}
                {data.allowCancellation ? (
                  <>
                    <strong className="text-green-700">Permitidas</strong> con{' '}
                    <strong className="text-purple-700">
                      {data.minCancellationHours === 0
                        ? 'sin restricción'
                        : `${data.minCancellationHours} hora${data.minCancellationHours !== 1 ? 's' : ''} de anticipación`}
                    </strong>
                  </>
                ) : (
                  <strong className="text-red-700">No permitidas</strong>
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Depósito:{' '}
                {data.requireDeposit ? (
                  <>
                    <strong className="text-purple-700">${data.depositAmount || 0} requerido</strong> antes de confirmar
                  </>
                ) : (
                  <strong className="text-gray-600">No requerido</strong>
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </StepContainer>
  );
};
