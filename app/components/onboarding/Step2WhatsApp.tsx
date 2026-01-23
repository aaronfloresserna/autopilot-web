import React, { useState } from 'react';
import { WhatsAppConfig } from '@/lib/onboarding-types';
import { FormInput } from './shared/FormInput';
import { StepContainer } from './StepContainer';
import { ExternalLink, Copy, Check, RefreshCw, Info, AlertCircle } from 'lucide-react';

interface Step2WhatsAppProps {
  data: WhatsAppConfig;
  onChange: (data: WhatsAppConfig) => void;
  errors?: string[];
}

export const Step2WhatsApp: React.FC<Step2WhatsAppProps> = ({
  data,
  onChange,
  errors = []
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState(false);

  const updateField = (field: keyof WhatsAppConfig, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    const length = 32;
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    updateField('webhookVerifyToken', token);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <StepContainer
      title="Configuración de WhatsApp Business"
      description="Conecta tu cuenta de WhatsApp Business para recibir y responder mensajes automáticamente"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Instrucciones iniciales */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                ¿Aún no tienes WhatsApp Business API?
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Necesitas crear una aplicación en Meta Developers y obtener acceso a WhatsApp Cloud API.
              </p>
              <a
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver tutorial completo
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Paso 1: Número de WhatsApp */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📱 Número de WhatsApp Business
          </h3>
          <FormInput
            label="Número de WhatsApp"
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={(value) => updateField('phoneNumber', value)}
            placeholder="+52 614 123 4567"
            helpText="Incluye código de país (ej: +52 para México)"
            required
          />
        </div>

        {/* Paso 2: Credenciales de Meta */}
        <div className="border-t pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔑 Credenciales de Meta Cloud API
            </h3>
            <p className="text-sm text-gray-600">
              Obtén estas credenciales desde tu{' '}
              <a
                href="https://developers.facebook.com/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                App de Meta Developers
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <FormInput
              label="Phone Number ID"
              name="phoneNumberId"
              value={data.phoneNumberId}
              onChange={(value) => updateField('phoneNumberId', value)}
              placeholder="123456789012345"
              helpText="WhatsApp > API Setup > Phone Number ID"
              required
            />

            <FormInput
              label="Business Account ID"
              name="businessAccountId"
              value={data.businessAccountId}
              onChange={(value) => updateField('businessAccountId', value)}
              placeholder="987654321098765"
              helpText="WhatsApp > API Setup > WhatsApp Business Account ID"
              required
            />

            <FormInput
              label="Access Token (Permanente)"
              name="accessToken"
              type="password"
              value={data.accessToken}
              onChange={(value) => updateField('accessToken', value)}
              placeholder="EAAG..."
              helpText="WhatsApp > API Setup > Generate permanent token"
              required
            />
          </div>
        </div>

        {/* Paso 3: Webhook Verify Token */}
        <div className="border-t pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔐 Token de Verificación del Webhook
            </h3>
            <p className="text-sm text-gray-600">
              Crea un token secreto para verificar que los mensajes vienen de Meta
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <FormInput
                label="Webhook Verify Token"
                name="webhookVerifyToken"
                value={data.webhookVerifyToken}
                onChange={(value) => updateField('webhookVerifyToken', value)}
                placeholder="mi-token-super-secreto-12345"
                helpText="Guarda este token, lo necesitarás al configurar el webhook en Meta"
                required
              />
              <div className="absolute right-0 top-8 flex gap-2">
                <button
                  type="button"
                  onClick={generateToken}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                  title="Generar token aleatorio"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {data.webhookVerifyToken && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(data.webhookVerifyToken, 'verifyToken')}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition"
                    title="Copiar token"
                  >
                    {copiedField === 'verifyToken' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {data.webhookVerifyToken && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Guarda este token en un lugar seguro.
                    Lo necesitarás cuando configures el webhook en Meta Dashboard.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Paso 4: Campos opcionales (colapsables) */}
        <div className="border-t pt-6">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              ⚙️ Configuración Avanzada (Opcional)
            </h3>
            <span className="text-sm text-gray-500">
              {showOptional ? 'Ocultar' : 'Mostrar'}
            </span>
          </button>

          {showOptional && (
            <div className="mt-4 space-y-4">
              <FormInput
                label="App ID"
                name="appId"
                value={data.appId || ''}
                onChange={(value) => updateField('appId', value)}
                placeholder="1234567890123456"
                helpText="Settings > Basic > App ID (opcional)"
              />

              <FormInput
                label="App Secret"
                name="appSecret"
                type="password"
                value={data.appSecret || ''}
                onChange={(value) => updateField('appSecret', value)}
                placeholder="a1b2c3d4..."
                helpText="Settings > Basic > App Secret (opcional, para mayor seguridad)"
              />

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <strong>Nota:</strong> App ID y App Secret son opcionales.
                  Solo agrégalos si necesitas features avanzadas o mayor seguridad.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Instrucciones finales */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">
            ✅ Próximos pasos después de completar este formulario:
          </h4>
          <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
            <li>Recibirás un Webhook URL al finalizar el onboarding</li>
            <li>Ve a tu App de Meta {'>'} WhatsApp {'>'} Configuration</li>
            <li>Agrega el Webhook URL y el Verify Token que generaste</li>
            <li>Suscribe tu webhook a los eventos "messages"</li>
            <li>¡Listo! Tu asistente IA empezará a responder mensajes automáticamente</li>
          </ol>
        </div>
      </div>
    </StepContainer>
  );
};
