import { z } from 'zod';

// Helper function to parse time to minutes
function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Step 1: Business Info
export const businessSchema = z.object({
  clientName: z.string()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),

  industry: z.enum([
    'barberia',
    'hospital',
    'gym',
    'spa',
    'restaurant',
    'consultorio',
    'other'
  ], { message: "Selecciona una industria" }),

  location: z.object({
    street: z.string().optional(),
    city: z.string().min(2, "Ciudad es requerida"),
    state: z.string().min(2, "Estado es requerido"),
    country: z.string().default("México")
  }),

  timezone: z.string().min(1, "Selecciona una zona horaria"),

  contactPerson: z.object({
    name: z.string().min(2, "Nombre es requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string()
      .regex(/^\+?\d{10,15}$/, "Formato: +52 614 123 4567")
  })
});

// Step 2: WhatsApp
export const whatsappSchema = z.object({
  hasAccount: z.boolean(),
  phoneNumber: z.string()
    .regex(/^\+\d{10,15}$/, "Formato: +52 614 123 4567"),
  phoneNumberId: z.string().optional(),
  accessToken: z.string().optional(),
  businessAccountId: z.string().optional()
}).refine(data => {
  if (data.hasAccount) {
    return data.phoneNumberId && data.accessToken && data.businessAccountId;
  }
  return true;
}, {
  message: "Completa todos los campos de credenciales",
  path: ["phoneNumberId"]
});

// Step 3: Services
const serviceSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  price: z.number()
    .nonnegative("Precio debe ser 0 o mayor"),
  duration: z.number()
    .int()
    .refine(val => [15, 30, 45, 60, 90, 120, 180, 240].includes(val), {
      message: "Selecciona una duración válida"
    }),
  description: z.string()
    .max(500, "Máximo 500 caracteres")
    .optional()
});

export const servicesSchema = z.object({
  currency: z.enum(['MXN', 'USD']),
  services: z.array(serviceSchema)
    .min(1, "Agrega al menos un servicio")
});

// Step 4: Schedule
const dayScheduleSchema = z.object({
  enabled: z.boolean(),
  open: z.string().regex(/^\d{2}:\d{2}$/, "Formato: 09:00"),
  close: z.string().regex(/^\d{2}:\d{2}$/, "Formato: 18:00")
}).refine(data => {
  if (!data.enabled) return true;
  const openMinutes = parseTimeToMinutes(data.open);
  const closeMinutes = parseTimeToMinutes(data.close);
  return closeMinutes > openMinutes;
}, {
  message: "Hora de cierre debe ser después de apertura"
});

export const scheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema
}).refine(data => {
  const days = Object.values(data);
  return days.some(day => day.enabled);
}, {
  message: "Debes tener al menos un día habilitado"
});

// Step 5: Policies
export const policiesSchema = z.object({
  minAdvanceBooking: z.number()
    .int()
    .min(1, "Mínimo 1 hora")
    .max(168, "Máximo 1 semana (168 horas)"),

  allowCancellation: z.boolean(),

  minCancellationHours: z.number()
    .int()
    .min(0)
    .max(72, "Máximo 72 horas"),

  requireDeposit: z.boolean(),

  depositAmount: z.number()
    .positive("Monto debe ser mayor a 0")
    .optional()
}).refine(data => {
  if (data.requireDeposit) {
    return data.depositAmount && data.depositAmount > 0;
  }
  return true;
}, {
  message: "Especifica el monto del depósito",
  path: ["depositAmount"]
});

// Step 6: Assistant
export const assistantSchema = z.object({
  assistantName: z.string()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),

  tone: z.enum(['friendly', 'professional', 'formal'], {
    message: "Selecciona un tono"
  }),

  language: z.enum(['es', 'en'], {
    message: "Selecciona un idioma"
  }),

  customRules: z.array(
    z.string()
      .min(10, "Mínimo 10 caracteres")
      .max(500, "Máximo 500 caracteres")
  ).max(10, "Máximo 10 reglas personalizadas")
  .default([])
});

// Map steps to schemas
export const STEP_SCHEMAS = {
  1: businessSchema,
  2: whatsappSchema,
  3: servicesSchema,
  4: scheduleSchema,
  5: policiesSchema,
  6: assistantSchema
};
