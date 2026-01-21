import { OnboardingFormData } from './onboarding-types';

// Industry options
export const INDUSTRIES = [
  { value: 'barberia', label: 'Barbería' },
  { value: 'hospital', label: 'Hospital/Clínica' },
  { value: 'gym', label: 'Gym/Fitness' },
  { value: 'spa', label: 'Spa/Salón de belleza' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'consultorio', label: 'Consultorio médico' },
  { value: 'other', label: 'Otro' }
];

// Timezone options (Mexico)
export const TIMEZONES = [
  { value: 'America/Tijuana', label: 'Tijuana (UTC-8, PST)' },
  { value: 'America/Hermosillo', label: 'Hermosillo (UTC-7, MST sin DST)' },
  { value: 'America/Chihuahua', label: 'Chihuahua (UTC-7, MST)' },
  { value: 'America/Mazatlan', label: 'Mazatlán (UTC-7, MST)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6, CST)' },
  { value: 'America/Cancun', label: 'Cancún (UTC-5, EST)' }
];

// Currency options
export const CURRENCIES = [
  { value: 'MXN', label: 'Peso Mexicano (MXN)', symbol: '$' },
  { value: 'USD', label: 'Dólar Americano (USD)', symbol: '$' }
];

// Service duration options
export const DURATIONS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1.5 horas' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
  { value: 240, label: '4 horas' }
];

// Advance booking options
export const ADVANCE_BOOKING_OPTIONS = [
  { value: 1, label: '1 hora' },
  { value: 2, label: '2 horas' },
  { value: 4, label: '4 horas' },
  { value: 8, label: '8 horas' },
  { value: 12, label: '12 horas' },
  { value: 24, label: '24 horas (1 día)' },
  { value: 48, label: '48 horas (2 días)' }
];

// Cancellation hours options
export const CANCELLATION_HOURS_OPTIONS = [
  { value: 0, label: 'Sin restricción' },
  { value: 1, label: '1 hora' },
  { value: 2, label: '2 horas' },
  { value: 4, label: '4 horas' },
  { value: 8, label: '8 horas' },
  { value: 12, label: '12 horas' },
  { value: 24, label: '24 horas (1 día)' },
  { value: 48, label: '48 horas (2 días)' },
  { value: 72, label: '72 horas (3 días)' }
];

// Assistant tone options
export const ASSISTANT_TONES = [
  {
    value: 'friendly',
    label: 'Amigable',
    description: 'Casual, cercano, usa "tú"',
    example: '"¡Hola! ¿En qué te puedo ayudar?"'
  },
  {
    value: 'professional',
    label: 'Profesional',
    description: 'Cordial, formal, usa "usted"',
    example: '"Buenos días. ¿En qué puedo asistirle?"'
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Muy educado, distante',
    example: '"Reciba un cordial saludo. ¿Cómo podría ayudarle?"'
  }
];

// Language options
export const LANGUAGES = [
  { value: 'es', label: 'Español', flag: '🇲🇽' },
  { value: 'en', label: 'English', flag: '🇺🇸' }
];

// Step titles
export const STEP_TITLES = [
  'Información del Negocio',
  'Configuración de WhatsApp',
  'Servicios y Precios',
  'Horarios de Operación',
  'Políticas del Negocio',
  'Configuración del Asistente',
  'Resumen y JSON'
];

// Default form data
export const DEFAULT_FORM_DATA: OnboardingFormData = {
  business: {
    clientName: '',
    industry: 'barberia',
    location: {
      street: '',
      city: '',
      state: '',
      country: 'México'
    },
    timezone: 'America/Mexico_City',
    contactPerson: {
      name: '',
      email: '',
      phone: ''
    }
  },
  whatsapp: {
    hasAccount: false,
    phoneNumber: '',
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: ''
  },
  services: {
    currency: 'MXN',
    services: []
  },
  schedule: {
    monday: { enabled: true, open: '09:00', close: '18:00' },
    tuesday: { enabled: true, open: '09:00', close: '18:00' },
    wednesday: { enabled: true, open: '09:00', close: '18:00' },
    thursday: { enabled: true, open: '09:00', close: '18:00' },
    friday: { enabled: true, open: '09:00', close: '18:00' },
    saturday: { enabled: false, open: '09:00', close: '18:00' },
    sunday: { enabled: false, open: '09:00', close: '18:00' }
  },
  policies: {
    minAdvanceBooking: 2,
    allowCancellation: true,
    minCancellationHours: 4,
    requireDeposit: false,
    depositAmount: undefined
  },
  assistant: {
    assistantName: '',
    tone: 'friendly',
    language: 'es',
    customRules: []
  }
};

// Service templates by industry
export const SERVICE_TEMPLATES: Record<string, Array<{name: string, price: number, duration: number}>> = {
  barberia: [
    { name: 'Corte Clásico', price: 150, duration: 30 },
    { name: 'Corte + Barba', price: 250, duration: 45 },
    { name: 'Afeitado', price: 100, duration: 20 }
  ],
  hospital: [
    { name: 'Consulta General', price: 800, duration: 45 },
    { name: 'Consulta Especialidad', price: 1000, duration: 60 },
    { name: 'Check-up', price: 500, duration: 30 }
  ],
  gym: [
    { name: 'Clase Grupal', price: 150, duration: 60 },
    { name: 'Entrenamiento Personal', price: 300, duration: 60 },
    { name: 'Consulta Nutricional', price: 400, duration: 45 }
  ],
  spa: [
    { name: 'Masaje Relajante', price: 500, duration: 60 },
    { name: 'Facial', price: 400, duration: 45 },
    { name: 'Manicure', price: 200, duration: 30 }
  ],
  restaurant: [
    { name: 'Reservación Mesa 2 personas', price: 0, duration: 90 },
    { name: 'Reservación Mesa 4 personas', price: 0, duration: 120 },
    { name: 'Evento Privado', price: 5000, duration: 240 }
  ],
  consultorio: [
    { name: 'Consulta', price: 600, duration: 45 },
    { name: 'Seguimiento', price: 400, duration: 30 },
    { name: 'Valoración Inicial', price: 800, duration: 60 }
  ]
};

// Schedule presets
export const SCHEDULE_PRESETS = {
  'weekdays-9-6': {
    label: 'Lun-Vie 9am-6pm',
    schedule: {
      monday: { enabled: true, open: '09:00', close: '18:00' },
      tuesday: { enabled: true, open: '09:00', close: '18:00' },
      wednesday: { enabled: true, open: '09:00', close: '18:00' },
      thursday: { enabled: true, open: '09:00', close: '18:00' },
      friday: { enabled: true, open: '09:00', close: '18:00' },
      saturday: { enabled: false, open: '09:00', close: '18:00' },
      sunday: { enabled: false, open: '09:00', close: '18:00' }
    }
  },
  'weekdays-sat-9-7': {
    label: 'Lun-Sáb 9am-7pm',
    schedule: {
      monday: { enabled: true, open: '09:00', close: '19:00' },
      tuesday: { enabled: true, open: '09:00', close: '19:00' },
      wednesday: { enabled: true, open: '09:00', close: '19:00' },
      thursday: { enabled: true, open: '09:00', close: '19:00' },
      friday: { enabled: true, open: '09:00', close: '19:00' },
      saturday: { enabled: true, open: '09:00', close: '19:00' },
      sunday: { enabled: false, open: '09:00', close: '18:00' }
    }
  },
  '24-7': {
    label: '24/7 (Todos los días)',
    schedule: {
      monday: { enabled: true, open: '00:00', close: '23:59' },
      tuesday: { enabled: true, open: '00:00', close: '23:59' },
      wednesday: { enabled: true, open: '00:00', close: '23:59' },
      thursday: { enabled: true, open: '00:00', close: '23:59' },
      friday: { enabled: true, open: '00:00', close: '23:59' },
      saturday: { enabled: true, open: '00:00', close: '23:59' },
      sunday: { enabled: true, open: '00:00', close: '23:59' }
    }
  }
};
