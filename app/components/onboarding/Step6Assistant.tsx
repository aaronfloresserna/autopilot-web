import React, { useState } from 'react';
import { AssistantConfig } from '@/lib/onboarding-types';
import { ASSISTANT_TONES, LANGUAGES } from '@/lib/onboarding-constants';
import { FormInput } from './shared/FormInput';
import { StepContainer } from './StepContainer';
import { Plus, Edit, Trash2, Lightbulb } from 'lucide-react';

interface Step6AssistantProps {
  data: AssistantConfig;
  onChange: (data: AssistantConfig) => void;
  errors?: string[];
}

export const Step6Assistant: React.FC<Step6AssistantProps> = ({
  data,
  onChange,
  errors = []
}) => {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [ruleText, setRuleText] = useState('');

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

  const deleteRule = (index: number) => {
    const newRules = data.customRules.filter((_, i) => i !== index);
    updateField('customRules', newRules);
  };

  return (
    <StepContainer
      title="Configuración del Asistente IA"
      description="Personaliza cómo tu asistente se comunicará con tus clientes"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Assistant name */}
        <FormInput
          label="Nombre del asistente"
          name="assistantName"
          value={data.assistantName}
          onChange={(value) => updateField('assistantName', value)}
          placeholder="Ej: María, Luis, Ana..."
          required
        />
        <p className="text-sm text-gray-500 -mt-4">
          ℹ️ Así se presentará tu asistente al comunicarse con los clientes
        </p>

        {/* Tone selection */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tono de comunicación <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {ASSISTANT_TONES.map((tone) => (
              <div
                key={tone.value}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  data.tone === tone.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => updateField('tone', tone.value)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="tone"
                    value={tone.value}
                    checked={data.tone === tone.value}
                    onChange={() => updateField('tone', tone.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{tone.label}</div>
                    <div className="text-sm text-gray-600">{tone.description}</div>
                    <div className="text-sm text-purple-600 italic mt-1">{tone.example}</div>
                  </div>
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
          <div className="flex gap-4">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.value}
                className={`flex-1 border rounded-lg p-4 cursor-pointer transition ${
                  data.language === lang.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => updateField('language', lang.value)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="language"
                    value={lang.value}
                    checked={data.language === lang.value}
                    onChange={() => updateField('language', lang.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-gray-900">{lang.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom rules */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Reglas personalizadas (opcional)
            </label>
            <button
              type="button"
              onClick={() => openRuleModal()}
              disabled={data.customRules.length >= 10}
              className="flex items-center px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-gray-700 flex-1">• {rule}</p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openRuleModal(index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        aria-label="Editar regla"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRule(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        aria-label="Eliminar regla"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No hay reglas personalizadas</p>
              <p className="text-xs mt-1">Las reglas ayudan a tu asistente a comportarse según tus necesidades</p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            {data.customRules.length}/10 reglas
          </p>
        </div>
      </div>

      {/* Rule modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingRuleIndex !== null ? 'Editar Regla' : 'Nueva Regla Personalizada'}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la regla
              </label>
              <textarea
                value={ruleText}
                onChange={(e) => setRuleText(e.target.value)}
                placeholder="Ej: Siempre preguntar si es primera visita"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {ruleText.length}/500 caracteres (mínimo 10)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 font-medium mb-2">💡 Ejemplos de reglas:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Siempre ofrecer corte + barba como paquete</li>
                <li>• Preguntar si es primera visita del cliente</li>
                <li>• Confirmar edad para servicios con alcohol</li>
                <li>• Recordar política de cancelación al confirmar</li>
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
                Guardar Regla
              </button>
            </div>
          </div>
        </div>
      )}
    </StepContainer>
  );
};
