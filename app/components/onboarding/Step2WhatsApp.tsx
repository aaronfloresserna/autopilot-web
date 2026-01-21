import React from 'react';
import { WhatsAppConfig } from '@/lib/onboarding-types';
import { FormInput } from './shared/FormInput';
import { FormCheckbox } from './shared/FormCheckbox';
import { StepContainer } from './StepContainer';
import { Info } from 'lucide-react';

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
  const updateField = (field: keyof WhatsAppConfig, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <StepContainer
      title="Configuración de WhatsApp"
      description="Conecta tu número de WhatsApp Business para que tu asistente pueda comunicarse con tus clientes"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Has account checkbox */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <FormCheckbox
            label="Ya tengo una cuenta de Meta Business y credenciales"
            name="hasAccount"
            checked={data.hasAccount}
            onChange={(checked) => updateField('hasAccount', checked)}
            description="Si ya configuraste WhatsApp Business API, marca esta opción"
          />
        </div>

        {/* Phone number */}
        <FormInput
          label="Número de WhatsApp"
          name="phoneNumber"
          type="tel"
          value={data.phoneNumber}
          onChange={(value) => updateField('phoneNumber', value)}
          placeholder="+52 614 123 4567"
          required
        />

        <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p>
            Este será el número desde el cual tu asistente IA enviará y recibirá mensajes.
            Debe ser un número de WhatsApp Business válido.
          </p>
        </div>

        {/* Credentials section - only show if hasAccount is true */}
        {data.hasAccount && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Credenciales de Meta
            </h3>

            <div className="space-y-4">
              <FormInput
                label="Phone Number ID"
                name="phoneNumberId"
                value={data.phoneNumberId || ''}
                onChange={(value) => updateField('phoneNumberId', value)}
                placeholder="123456789012345"
                required={data.hasAccount}
              />

              <FormInput
                label="Access Token"
                name="accessToken"
                value={data.accessToken || ''}
                onChange={(value) => updateField('accessToken', value)}
                placeholder="EAAxxxxxxxxxxxxxxxxxxxxx"
                required={data.hasAccount}
              />

              <div className="flex items-start gap-2 text-sm text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <span className="text-lg">🔒</span>
                <p>
                  Este token será almacenado de forma segura y encriptada en nuestros servidores.
                </p>
              </div>

              <FormInput
                label="Business Account ID"
                name="businessAccountId"
                value={data.businessAccountId || ''}
                onChange={(value) => updateField('businessAccountId', value)}
                placeholder="987654321098765"
                required={data.hasAccount}
              />
            </div>
          </div>
        )}

        {/* Tutorial section */}
        {!data.hasAccount && (
          <div className="border-t pt-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                <span className="mr-2">📖</span>
                ¿Necesitas ayuda?
              </h3>
              <p className="text-purple-800 mb-4">
                Te guiaremos paso a paso para crear tu cuenta de Meta Business y obtener las credenciales necesarias.
              </p>
              <a
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Ver guía oficial de Meta
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </StepContainer>
  );
};
