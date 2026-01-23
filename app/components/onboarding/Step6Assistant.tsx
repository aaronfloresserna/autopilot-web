import React, { useState, useEffect } from 'react';
import { AssistantConfig } from '@/lib/onboarding-types';
import { ASSISTANT_TONES, LANGUAGES } from '@/lib/onboarding-constants';
import { FormInput } from './shared/FormInput';
import { StepContainer } from './StepContainer';
import { Plus, Edit, Trash2, Lightbulb, Info, MessageSquare, CheckCircle, X } from 'lucide-react';

interface Step6AssistantProps {
  data: AssistantConfig;
  onChange: (data: AssistantConfig) => void;
  errors?: string[];
  industryType?: string;
}

export const Step6Assistant: React.FC<Step6AssistantProps> = ({
  data,
  onChange,
  errors = [],
  industryType = ''
}) => {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [ruleText, setRuleText] = useState('');

  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showRuleModal) {
        closeRuleModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showRuleModal]);

  const updateField = (field: keyof AssistantConfig, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const openRuleModal = (index?: number) => {
    if (index !== undefined) {
      setEditingRuleIndex(index);
      setRuleText(data.customRules[index]);
    } else {
      setEditingRuleIndex(null);
      setRuleText('');
    }
    setShowRuleModal(true);
  };

  const closeRuleModal = () => {
    setShowRuleModal(false);
    setEditingRuleIndex(null);
    setRuleText('');
  };

  const saveRule = () => {
    if (!ruleText.trim() || ruleText.length < 10) return;

    const newRules = [...data.customRules];

    if (editingRuleIndex !== null) {
      newRules[editingRuleIndex] = ruleText.trim();
    } else {
      newRules.push(ruleText.trim());
    }

    updateField('customRules', newRules);
    closeRuleModal();
  };

  const deleteRule = (index: number, rule: string) => {
    if (window.confirm(`¿Eliminar esta regla?\n\n"${rule}"`)) {
      const newRules = data.customRules.filter((_, i) => i !== index);
      updateField('customRules', newRules);
    }
  };

  const getIndustryExamples = (): string[] => {
    const normalized = industryType.toLowerCase().trim();

    if (normalized.includes('barber') || normalized.includes('barbería')) {
      return [
        'Siempre ofrecer corte + barba como paquete',
        'Preguntar si es primera visita del cliente',
        'Mencionar promoción de lunes a miércoles',
        'Preguntar preferencia de barbero específico'
      ];
    }

    if (normalized.includes('hospital') || normalized.includes('clínica') || normalized.includes('médico')) {
      return [
        'Preguntar si es primera consulta o seguimiento',
        'Solicitar número de seguro médico si aplica',
        'Recordar traer estudios previos si los tiene',
        'Confirmar edad del paciente para pediatría'
      ];
    }

    if (normalized.includes('gym') || normalized.includes('gimnasio')) {
      return [
        'Preguntar si tiene plan de membresía activo',
        'Ofrecer clase de prueba gratis para nuevos',
        'Mencionar horarios de menor afluencia',
        'Preguntar objetivos de entrenamiento'
      ];
    }

    if (normalized.includes('spa') || normalized.includes('masaj')) {
      return [
        'Preguntar si tiene alergias o condiciones especiales',
        'Ofrecer paquetes de tratamientos múltiples',
        'Mencionar promociones de cumpleaños',
        'Preguntar preferencia de música/aromaterapia'
      ];
    }

    if (normalized.includes('restaurant') || normalized.includes('comida')) {
      return [
        'Preguntar cantidad de personas para la reserva',
        'Consultar si es ocasión especial (cumpleaños, aniversario)',
        'Mencionar menú del día o promociones',
        'Preguntar preferencia de mesa (interior, terraza, etc.)'
      ];
    }

    // Default examples
    return [
      'Siempre confirmar datos antes de finalizar la reserva',
      'Preguntar si es primera visita del cliente',
      'Mencionar promociones o paquetes especiales',
      'Recordar política de cancelación al confirmar'
    ];
  };

  const getPreviewMessage = (): string => {
    const selectedTone = ASSISTANT_TONES.find(t => t.value === data.tone);
    const assistantName = data.assistantName || 'tu asistente';

    if (!selectedTone) return '';

    const greetings = {
      friendly: `¡Hola! Soy ${assistantName} 😊 ¿En qué te puedo ayudar hoy?`,
      professional: `Buenos días, soy ${assistantName}. ¿En qué puedo asistirle?`,
      formal: `Reciba un cordial saludo. Mi nombre es ${assistantName}. ¿Cómo podría ayudarle el día de hoy?`
    };

    return greetings[data.tone as keyof typeof greetings] || greetings.friendly;
  };

  const industryExamples = getIndustryExamples();

  return (
    <StepContainer
      title="Configuración del Asistente IA"
      description="Personaliza la personalidad y comportamiento de tu recepcionista virtual"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Información contextual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                ¿Qué es el asistente de IA?
              </h4>
              <p className="text-sm text-blue-800">
                Tu asistente virtual es quien conversará con tus clientes por WhatsApp las 24 horas.
                Aquí defines su nombre, cómo se comunica (tono), en qué idioma, y reglas especiales
                que debe seguir. El asistente usará toda la configuración anterior (servicios, horarios,
                políticas) para responder automáticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Assistant name */}
        <div>
          <FormInput
            label="Nombre del asistente"
            name="assistantName"
            value={data.assistantName}
            onChange={(value) => updateField('assistantName', value)}
            placeholder="Ej: María, Luis, Ana, Carlos..."
            required
            helpText="Dale un nombre humano y amigable. Los clientes se sentirán más cómodos."
          />
        </div>

        {/* Tone selection */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tono de comunicación <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Define cómo quieres que tu asistente se exprese con los clientes
          </p>
          <div className="space-y-3">
            {ASSISTANT_TONES.map((tone) => (
              <div
                key={tone.value}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  data.tone === tone.value
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
                onClick={() => updateField('tone', tone.value)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="tone"
                    value={tone.value}
                    checked={data.tone === tone.value}
                    onChange={() => updateField('tone', tone.value)}
                    className="w-4 h-4 text-purple-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{tone.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{tone.description}</div>
                    <div className="text-sm text-purple-600 italic mt-2 bg-purple-50 p-2 rounded border border-purple-200">
                      💬 {tone.example}
                    </div>
                  </div>
                  {data.tone === tone.value && (
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language selection */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Idioma principal <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-3">
            El asistente responderá principalmente en este idioma
          </p>
          <div className="grid grid-cols-2 gap-4">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.value}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  data.language === lang.value
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
                onClick={() => updateField('language', lang.value)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="language"
                      value={lang.value}
                      checked={data.language === lang.value}
                      onChange={() => updateField('language', lang.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="font-medium text-gray-900">{lang.label}</span>
                  </div>
                  {data.language === lang.value && (
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {data.assistantName && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <MessageSquare className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-2">
                  Vista previa del saludo inicial
                </h4>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                      {data.assistantName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{data.assistantName}</div>
                      <div className="text-sm text-gray-900">{getPreviewMessage()}</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-2 italic">
                  Así es como los clientes verán el primer mensaje de tu asistente en WhatsApp
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom rules */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reglas personalizadas (opcional)
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Instrucciones especiales que el asistente debe seguir
              </p>
            </div>
            <button
              type="button"
              onClick={() => openRuleModal()}
              disabled={data.customRules.length >= 10}
              className="flex items-center px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title={data.customRules.length >= 10 ? 'Máximo 10 reglas alcanzado' : 'Agregar nueva regla'}
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar regla
            </button>
          </div>

          {data.customRules.length > 0 ? (
            <div className="space-y-2">
              {data.customRules.map((rule, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-gray-700 flex-1">
                      <span className="text-purple-600 font-bold">#{index + 1}</span> {rule}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openRuleModal(index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        aria-label="Editar regla"
                        title="Editar regla"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRule(index, rule)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        aria-label="Eliminar regla"
                        title="Eliminar regla"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">No hay reglas personalizadas</p>
              <p className="text-xs text-gray-500 mt-1">
                Las reglas ayudan al asistente a comportarse según las necesidades de tu negocio
              </p>
              <button
                type="button"
                onClick={() => openRuleModal()}
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                + Agregar tu primera regla
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              {data.customRules.length}/10 reglas configuradas
            </p>
            {data.customRules.length > 0 && (
              <p className="text-xs text-green-600">
                ✓ El asistente seguirá estas {data.customRules.length} regla{data.customRules.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            Resumen de Configuración
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Nombre: <strong className="text-purple-700">{data.assistantName || 'Sin configurar'}</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Tono: <strong className="text-purple-700">
                  {ASSISTANT_TONES.find(t => t.value === data.tone)?.label || 'Sin configurar'}
                </strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Idioma: <strong className="text-purple-700">
                  {LANGUAGES.find(l => l.value === data.language)?.label || 'Sin configurar'}
                </strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Reglas personalizadas: <strong className="text-purple-700">
                  {data.customRules.length} configurada{data.customRules.length !== 1 ? 's' : ''}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rule modal */}
      {showRuleModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRuleModal();
          }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRuleIndex !== null ? 'Editar Regla Personalizada' : 'Nueva Regla Personalizada'}
              </h3>
              <button
                type="button"
                onClick={closeRuleModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la regla
              </label>
              <textarea
                value={ruleText}
                onChange={(e) => setRuleText(e.target.value)}
                placeholder="Ej: Siempre preguntar si es primera visita del cliente"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={500}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                {ruleText.length}/500 caracteres (mínimo 10)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Ejemplos de reglas para {industryType || 'tu negocio'}:
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                {industryExamples.map((example, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setRuleText(example)}
                      className="text-left hover:text-blue-900 hover:underline"
                    >
                      {example}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeRuleModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveRule}
                disabled={!ruleText.trim() || ruleText.length < 10}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {editingRuleIndex !== null ? 'Actualizar' : 'Guardar Regla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </StepContainer>
  );
};
