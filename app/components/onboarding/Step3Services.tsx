import React, { useState } from 'react';
import { ServicesConfig, Service } from '@/lib/onboarding-types';
import { CURRENCIES, DURATIONS, SERVICE_TEMPLATES } from '@/lib/onboarding-constants';
import { FormSelect } from './shared/FormSelect';
import { FormInput } from './shared/FormInput';
import { StepContainer } from './StepContainer';
import { Plus, Edit, Trash2, Sparkles } from 'lucide-react';

interface Step3ServicesProps {
  data: ServicesConfig;
  onChange: (data: ServicesConfig) => void;
  errors?: string[];
  industryType?: string;
}

export const Step3Services: React.FC<Step3ServicesProps> = ({
  data,
  onChange,
  errors = [],
  industryType = 'barberia'
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Omit<Service, 'id'>>({
    name: '',
    price: 0,
    duration: 30,
    description: ''
  });

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description || ''
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '',
        price: 0,
        duration: 30,
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const saveService = () => {
    if (!serviceForm.name || serviceForm.price < 0) return;

    const newServices = [...data.services];

    if (editingService) {
      const index = newServices.findIndex(s => s.id === editingService.id);
      if (index !== -1) {
        newServices[index] = { ...serviceForm, id: editingService.id };
      }
    } else {
      const newService: Service = {
        ...serviceForm,
        id: `svc-${Date.now()}`
      };
      newServices.push(newService);
    }

    onChange({ ...data, services: newServices });
    closeModal();
  };

  const deleteService = (id: string) => {
    const newServices = data.services.filter(s => s.id !== id);
    onChange({ ...data, services: newServices });
  };

  const loadTemplates = () => {
    const templates = SERVICE_TEMPLATES[industryType] || SERVICE_TEMPLATES['barberia'];
    const newServices: Service[] = templates.map((template, index) => ({
      ...template,
      id: `svc-${Date.now()}-${index}`,
      description: ''
    }));
    onChange({ ...data, services: newServices });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: data.currency
    }).format(price);
  };

  return (
    <StepContainer
      title="Servicios y Precios"
      description="Define los servicios que ofreces y sus precios"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Currency selector */}
        <div className="flex items-center justify-between">
          <FormSelect
            label="Moneda"
            name="currency"
            value={data.currency}
            onChange={(value) => onChange({ ...data, currency: value as 'MXN' | 'USD' })}
            options={CURRENCIES}
            className="w-64"
          />

          {data.services.length === 0 && (
            <button
              type="button"
              onClick={loadTemplates}
              className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Cargar plantilla
            </button>
          )}
        </div>

        {/* Services list */}
        <div className="space-y-3">
          {data.services.map((service) => (
            <div
              key={service.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="font-medium text-green-600">
                      {formatPrice(service.price)}
                    </span>
                    <span>•</span>
                    <span>{service.duration} minutos</span>
                  </div>
                  {service.description && (
                    <p className="mt-2 text-sm text-gray-500">{service.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => openModal(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    aria-label="Editar servicio"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteService(service.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    aria-label="Eliminar servicio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add service button */}
        <button
          type="button"
          onClick={() => openModal()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Servicio
        </button>

        {data.services.length === 0 && (
          <p className="text-sm text-red-600 text-center">
            Debes agregar al menos un servicio para continuar
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>

            <div className="space-y-4">
              <FormInput
                label="Nombre"
                name="serviceName"
                value={serviceForm.name}
                onChange={(value) => setServiceForm({ ...serviceForm, name: value })}
                placeholder="Ej: Corte clásico"
                required
              />

              <FormInput
                label={`Precio (${data.currency})`}
                name="servicePrice"
                type="number"
                value={serviceForm.price}
                onChange={(value) => setServiceForm({ ...serviceForm, price: parseFloat(value) || 0 })}
                placeholder="0.00"
                required
              />

              <FormSelect
                label="Duración"
                name="serviceDuration"
                value={serviceForm.duration}
                onChange={(value) => setServiceForm({ ...serviceForm, duration: parseInt(value) })}
                options={DURATIONS}
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Breve descripción del servicio"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {serviceForm.description?.length || 0}/500 caracteres
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveService}
                disabled={!serviceForm.name || serviceForm.price < 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Guardar Servicio
              </button>
            </div>
          </div>
        </div>
      )}
    </StepContainer>
  );
};
