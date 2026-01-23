import React, { useState, useEffect } from 'react';
import { ServicesConfig, Service } from '@/lib/onboarding-types';
import { CURRENCIES, DURATIONS, SERVICE_TEMPLATES } from '@/lib/onboarding-constants';
import { FormSelect } from './shared/FormSelect';
import { FormInput } from './shared/FormInput';
import { StepContainer } from './StepContainer';
import { Plus, Edit, Trash2, Sparkles, Copy, Info, AlertCircle, X } from 'lucide-react';

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
  industryType = ''
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Omit<Service, 'id'>>({
    name: '',
    price: 0,
    duration: 30,
    description: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; price?: string }>({});

  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  const normalizeIndustryKey = (industry: string): string => {
    const normalized = industry.toLowerCase().trim();

    // Map common variations to template keys
    if (normalized.includes('barber') || normalized.includes('barbería')) return 'barberia';
    if (normalized.includes('hospital') || normalized.includes('clínica')) return 'hospital';
    if (normalized.includes('gym') || normalized.includes('gimnasio')) return 'gym';
    if (normalized.includes('spa') || normalized.includes('masaj')) return 'spa';
    if (normalized.includes('restaurant') || normalized.includes('comida')) return 'restaurant';
    if (normalized.includes('consult') || normalized.includes('doctor') || normalized.includes('médico')) return 'consultorio';

    return 'barberia'; // Default fallback
  };

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
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; price?: string } = {};

    if (!serviceForm.name || serviceForm.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (serviceForm.price < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveService = () => {
    if (!validateForm()) return;

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

  const deleteService = (id: string, serviceName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${serviceName}"?`)) {
      const newServices = data.services.filter(s => s.id !== id);
      onChange({ ...data, services: newServices });
    }
  };

  const duplicateService = (service: Service) => {
    const duplicated: Service = {
      ...service,
      id: `svc-${Date.now()}`,
      name: `${service.name} (Copia)`
    };
    const newServices = [...data.services, duplicated];
    onChange({ ...data, services: newServices });
  };

  const loadTemplates = () => {
    const industryKey = normalizeIndustryKey(industryType);
    const templates = SERVICE_TEMPLATES[industryKey] || SERVICE_TEMPLATES['barberia'];

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

  const hasTemplateForIndustry = (): boolean => {
    const industryKey = normalizeIndustryKey(industryType);
    return !!SERVICE_TEMPLATES[industryKey];
  };

  return (
    <StepContainer
      title="Servicios y Precios"
      description="Define los servicios que ofreces, sus precios y duración"
      errors={errors}
    >
      <div className="space-y-6">
        {/* Información contextual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                ¿Qué son los servicios?
              </h4>
              <p className="text-sm text-blue-800">
                Los servicios son los productos o tratamientos que ofreces a tus clientes.
                Cada servicio tiene un nombre, precio y duración. Tu asistente de IA usará
                esta información para agendar citas y responder preguntas sobre disponibilidad.
              </p>
            </div>
          </div>
        </div>

        {/* Currency selector and template loader */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <FormSelect
            label="Moneda"
            name="currency"
            value={data.currency}
            onChange={(value) => onChange({ ...data, currency: value as 'MXN' | 'USD' })}
            options={CURRENCIES}
            className="w-64"
          />

          {data.services.length === 0 && hasTemplateForIndustry() && (
            <button
              type="button"
              onClick={loadTemplates}
              className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              title="Cargar servicios predefinidos para tu industria"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Cargar plantilla de {normalizeIndustryKey(industryType)}
            </button>
          )}
        </div>

        {/* Warning if too many services */}
        {data.services.length > 10 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Sugerencia:</strong> Tienes {data.services.length} servicios.
                Para una mejor experiencia, te recomendamos mantener entre 5-10 servicios principales.
                Demasiados servicios pueden confundir a tus clientes.
              </div>
            </div>
          </div>
        )}

        {/* Services list */}
        <div className="space-y-3">
          {data.services.map((service) => (
            <div
              key={service.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition group"
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
                    <p className="mt-2 text-sm text-gray-500 italic">{service.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => duplicateService(service)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    aria-label="Duplicar servicio"
                    title="Duplicar servicio"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openModal(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    aria-label="Editar servicio"
                    title="Editar servicio"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteService(service.id, service.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    aria-label="Eliminar servicio"
                    title="Eliminar servicio"
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
          <div className="text-center py-4">
            <p className="text-sm text-red-600 font-medium">
              ⚠️ Debes agregar al menos un servicio para continuar
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {hasTemplateForIndustry()
                ? 'Usa el botón "Cargar plantilla" para comenzar rápido, o agrega manualmente.'
                : 'Haz clic en "Agregar Servicio" para comenzar.'
              }
            </p>
          </div>
        )}

        {/* Summary */}
        {data.services.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                <strong>{data.services.length}</strong> servicio{data.services.length !== 1 ? 's' : ''} configurado{data.services.length !== 1 ? 's' : ''}
              </span>
              <span className="text-gray-600">
                Rango de precios: {formatPrice(Math.min(...data.services.map(s => s.price)))} - {formatPrice(Math.max(...data.services.map(s => s.price)))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <FormInput
                label="Nombre del servicio"
                name="serviceName"
                value={serviceForm.name}
                onChange={(value) => setServiceForm({ ...serviceForm, name: value })}
                placeholder="Ej: Corte clásico"
                required
                error={formErrors.name}
                helpText="Dale un nombre claro y descriptivo"
              />

              <FormInput
                label={`Precio (${data.currency})`}
                name="servicePrice"
                type="number"
                value={serviceForm.price}
                onChange={(value) => setServiceForm({ ...serviceForm, price: parseFloat(value) || 0 })}
                placeholder="0.00"
                required
                error={formErrors.price}
                helpText="El precio que cobrarás por este servicio"
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
                  placeholder="Breve descripción del servicio (visible para clientes)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {serviceForm.description?.length || 0}/500 caracteres
                </p>
              </div>

              {/* Preview */}
              {serviceForm.name && (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-2 font-medium">Vista previa en WhatsApp:</p>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-semibold text-gray-900">{serviceForm.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatPrice(serviceForm.price)} • {serviceForm.duration} min
                    </div>
                    {serviceForm.description && (
                      <div className="text-xs text-gray-500 mt-2 italic">
                        {serviceForm.description}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                {editingService ? 'Actualizar' : 'Guardar Servicio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </StepContainer>
  );
};
