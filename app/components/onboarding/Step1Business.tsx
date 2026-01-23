import React from 'react';
import { BusinessInfo } from '@/lib/onboarding-types';
import { TIMEZONES } from '@/lib/onboarding-constants';
import { FormInput } from './shared/FormInput';
import { FormSelect } from './shared/FormSelect';
import { StepContainer } from './StepContainer';

interface Step1BusinessProps {
  data: BusinessInfo;
  onChange: (data: BusinessInfo) => void;
  errors?: string[];
}

export const Step1Business: React.FC<Step1BusinessProps> = ({
  data,
  onChange,
  errors = []
}) => {
  const updateField = (field: keyof BusinessInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateLocation = (field: string, value: string) => {
    onChange({
      ...data,
      location: { ...data.location, [field]: value }
    });
  };

  const updateContactPerson = (field: string, value: string) => {
    onChange({
      ...data,
      contactPerson: { ...data.contactPerson, [field]: value }
    });
  };

  return (
    <StepContainer
      title="Información del Negocio"
      description="Cuéntanos sobre tu negocio para personalizar tu asistente IA"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Business name */}
        <FormInput
          label="Nombre del negocio"
          name="clientName"
          value={data.clientName}
          onChange={(value) => updateField('clientName', value)}
          placeholder="Ej: Barbería StyleCut"
          required
        />

        {/* Industry */}
        <FormInput
          label="Industria / Tipo de negocio"
          name="industry"
          value={data.industry}
          onChange={(value) => updateField('industry', value)}
          placeholder="Ej: Barbería, Hospital, Clínica Dental, Gym, Spa, Restaurante"
          required
        />

        {/* Location section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📍</span>
            Ubicación
          </h3>

          <div className="space-y-4">
            <FormInput
              label="Calle y número"
              name="street"
              value={data.location.street || ''}
              onChange={(value) => updateLocation('street', value)}
              placeholder="Ej: Av. Universidad 123"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Ciudad"
                name="city"
                value={data.location.city}
                onChange={(value) => updateLocation('city', value)}
                placeholder="Ej: Chihuahua"
                required
              />

              <FormInput
                label="Estado"
                name="state"
                value={data.location.state}
                onChange={(value) => updateLocation('state', value)}
                placeholder="Ej: Chihuahua"
                required
              />
            </div>
          </div>
        </div>

        {/* Timezone */}
        <FormSelect
          label="Zona Horaria"
          name="timezone"
          value={data.timezone}
          onChange={(value) => updateField('timezone', value)}
          options={TIMEZONES}
          required
        />

        {/* Contact person section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👤</span>
            Contacto Principal
          </h3>

          <div className="space-y-4">
            <FormInput
              label="Nombre completo"
              name="contactName"
              value={data.contactPerson.name}
              onChange={(value) => updateContactPerson('name', value)}
              placeholder="Ej: Juan Pérez"
              required
            />

            <FormInput
              label="Email"
              name="contactEmail"
              type="email"
              value={data.contactPerson.email}
              onChange={(value) => updateContactPerson('email', value)}
              placeholder="juan@ejemplo.com"
              required
            />

            <FormInput
              label="Teléfono"
              name="contactPhone"
              type="tel"
              value={data.contactPerson.phone}
              onChange={(value) => updateContactPerson('phone', value)}
              placeholder="+52 614 123 4567"
              required
            />
          </div>
        </div>
      </div>
    </StepContainer>
  );
};
