import React, { useState } from 'react';
import { OnboardingFormData, OnboardingOutput } from '@/lib/onboarding-types';
import { StepContainer } from './StepContainer';
import { Edit, Copy, Download, Check, RotateCcw } from 'lucide-react';

interface Step7SummaryProps {
  data: OnboardingFormData;
  onEdit: (step: number) => void;
  onReset: () => void;
}

export const Step7Summary: React.FC<Step7SummaryProps> = ({
  data,
  onEdit,
  onReset
}) => {
  const [copied, setCopied] = useState(false);

  const generateJSON = (): OnboardingOutput => {
    return {
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString(),
        completedBy: 'landing-form'
      },
      client: data,
      nextSteps: [
        '1. Crear registro en tabla Clients de DynamoDB',
        '2. Crear Bedrock Agent con clientId generado',
        '3. Configurar Knowledge Base en Aurora pgvector',
        '4. Registrar webhook de WhatsApp en Meta Cloud API',
        '5. Subir documentos de servicios al Knowledge Base',
        '6. Realizar prueba completa de conversación'
      ]
    };
  };

  const jsonOutput = generateJSON();
  const jsonString = JSON.stringify(jsonOutput, null, 2);

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receptionist-ai-${data.business.clientName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDaySchedule = (schedule: any) => {
    const days = Object.entries(schedule)
      .filter(([_, config]: any) => config.enabled)
      .map(([day]: any) => {
        const dayNames: Record<string, string> = {
          monday: 'Lun',
          tuesday: 'Mar',
          wednesday: 'Mié',
          thursday: 'Jue',
          friday: 'Vie',
          saturday: 'Sáb',
          sunday: 'Dom'
        };
        return dayNames[day];
      });

    return days.join(', ');
  };

  return (
    <StepContainer
      title="✅ Configuración Completa"
      description="Revisa tu configuración y descarga el archivo JSON"
    >
      <div className="space-y-6">
        {/* Summary sections */}
        <div className="space-y-4">
          {/* Business */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🏢</span> Negocio
              </h3>
              <button
                onClick={() => onEdit(1)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• {data.business.clientName}</li>
              <li>• {data.business.location.city}, {data.business.location.state}</li>
              <li>• Zona horaria: {data.business.timezone}</li>
            </ul>
          </div>

          {/* WhatsApp */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>📱</span> WhatsApp
              </h3>
              <button
                onClick={() => onEdit(2)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• {data.whatsapp.phoneNumber}</li>
              <li>• Credenciales: {data.whatsapp.hasAccount ? 'Configuradas ✓' : 'Pendientes'}</li>
            </ul>
          </div>

          {/* Services */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>💇</span> Servicios ({data.services.services.length})
              </h3>
              <button
                onClick={() => onEdit(3)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {data.services.services.slice(0, 3).map((service) => (
                <li key={service.id}>
                  • {service.name} - ${service.price} - {service.duration}min
                </li>
              ))}
              {data.services.services.length > 3 && (
                <li className="text-gray-500">... y {data.services.services.length - 3} más</li>
              )}
            </ul>
          </div>

          {/* Schedule */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🕐</span> Horarios
              </h3>
              <button
                onClick={() => onEdit(4)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Días: {formatDaySchedule(data.schedule)}</li>
              <li>• Horario típico: {Object.values(data.schedule).find((d: any) => d.enabled)?.open} - {Object.values(data.schedule).find((d: any) => d.enabled)?.close}</li>
            </ul>
          </div>

          {/* Policies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>📋</span> Políticas
              </h3>
              <button
                onClick={() => onEdit(5)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Anticipación: {data.policies.minAdvanceBooking} hora(s)</li>
              <li>• Cancelación: {data.policies.allowCancellation ? `${data.policies.minCancellationHours}h anticipación` : 'No permitida'}</li>
              <li>• Depósito: {data.policies.requireDeposit ? `$${data.policies.depositAmount}` : 'No requerido'}</li>
            </ul>
          </div>

          {/* Assistant */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🤖</span> Asistente IA
              </h3>
              <button
                onClick={() => onEdit(6)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Nombre: {data.assistant.assistantName}</li>
              <li>• Tono: {data.assistant.tone === 'friendly' ? 'Amigable' : data.assistant.tone === 'professional' ? 'Profesional' : 'Formal'}</li>
              <li>• Idioma: {data.assistant.language === 'es' ? 'Español' : 'English'}</li>
              <li>• Reglas personalizadas: {data.assistant.customRules.length}</li>
            </ul>
          </div>
        </div>

        {/* JSON output */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📄 JSON de Configuración
          </h3>

          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-xs max-h-96 overflow-y-auto">
              <code>{jsonString}</code>
            </pre>

            <div className="flex gap-2 mt-3">
              <button
                onClick={copyJSON}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copiado!' : 'Copiar JSON'}
              </button>

              <button
                onClick={downloadJSON}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar JSON
              </button>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📝 Próximos Pasos:</h3>
          <ol className="text-sm text-gray-700 space-y-2">
            {jsonOutput.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Reset button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onReset}
            className="flex items-center px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpiar y Empezar de Nuevo
          </button>
        </div>
      </div>
    </StepContainer>
  );
};
