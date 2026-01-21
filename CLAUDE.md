# CLAUDE.md - Receptionist AI Landing & Onboarding

> Última actualización: 2026-01-21
> Este archivo contiene el plan completo para implementar el wizard de onboarding

---

## 🎯 Objetivo del Proyecto

**Landing page con wizard de onboarding** para recopilar datos de clientes nuevos de Receptionist AI.

### Problema que Resuelve
Actualmente, cuando llega un cliente nuevo, se requiere configuración manual (~30 minutos):
1. Crear cliente en DynamoDB
2. Crear Bedrock Agent personalizado
3. Crear usuario en Cognito
4. Crear tenants (sucursales/doctores)

### Solución
**Formulario web de 7 pasos** que recopila TODA la información necesaria y al final genera un JSON completo para configuración manual.

---

## 📁 Estructura del Proyecto

```
landing/
├── app/
│   ├── page.tsx                      # Landing page (existente)
│   ├── layout.tsx                    # Layout principal
│   ├── globals.css                   # Estilos globales
│   └── onboarding/                   # NUEVO - Wizard de onboarding
│       ├── page.tsx                  # Orchestrador del wizard
│       └── layout.tsx                # Layout sin navbar
│
├── app/components/                   # Componentes compartidos
│   └── onboarding/                   # NUEVO - Componentes del wizard
│       ├── ProgressBar.tsx           # Barra de progreso (1 de 7)
│       ├── NavigationButtons.tsx     # Botones Atrás/Siguiente
│       ├── StepContainer.tsx         # Wrapper para todos los pasos
│       │
│       ├── Step1Business.tsx         # Paso 1: Info del negocio
│       ├── Step2WhatsApp.tsx         # Paso 2: WhatsApp API
│       ├── Step3Services.tsx         # Paso 3: Servicios y precios
│       ├── Step4Schedule.tsx         # Paso 4: Horarios
│       ├── Step5Policies.tsx         # Paso 5: Políticas
│       ├── Step6Assistant.tsx        # Paso 6: Config del asistente
│       ├── Step7Summary.tsx          # Paso 7: Resumen y JSON
│       │
│       └── shared/                   # Componentes reutilizables
│           ├── FormInput.tsx
│           ├── FormSelect.tsx
│           ├── FormCheckbox.tsx
│           ├── FormTimePicker.tsx
│           └── ServiceCard.tsx
│
├── lib/                              # NUEVO - Utilidades
│   ├── onboarding-schema.ts          # Validaciones Zod
│   ├── onboarding-storage.ts         # localStorage helpers
│   ├── onboarding-types.ts           # TypeScript interfaces
│   └── onboarding-constants.ts       # Dropdowns, defaults
│
├── hooks/                            # NUEVO - Custom hooks
│   └── useOnboardingForm.ts          # State management del wizard
│
├── public/                           # Assets
└── package.json                      # Dependencies
```

---

## 🎨 Wizard de Onboarding - 7 Pasos

### Paso 1: Información del Negocio

**Datos a recopilar:**
```typescript
interface BusinessInfo {
  clientName: string;           // "Barbería StyleCut"
  industry: string;             // barberia | hospital | gym | spa | restaurant | consultorio
  location: {
    street: string;
    city: string;
    state: string;
    country: string;            // default "México"
  };
  timezone: string;             // America/Chihuahua, America/Tijuana, etc.
  contactPerson: {
    name: string;
    email: string;
    phone: string;              // +52 614 123 4567
  };
}
```

**Validaciones (Zod):**
- `clientName`: 2-100 caracteres
- `industry`: uno de los valores del enum
- `location.city`: 2+ caracteres
- `contactPerson.email`: formato email válido
- `contactPerson.phone`: regex `/^\+?\d{10,15}$/`

**UI Design:**
```
┌────────────────────────────────────────┐
│  1 of 7 ●○○○○○○                       │
├────────────────────────────────────────┤
│  Información del Negocio               │
│                                        │
│  Nombre del negocio *                  │
│  [__________________________]          │
│                                        │
│  Industria *                           │
│  [Seleccionar tipo ▼]                  │
│                                        │
│  📍 Ubicación                          │
│  Calle: [_____________________]        │
│  Ciudad: [________]  Estado: [_____]   │
│                                        │
│  🕐 Zona Horaria *                     │
│  [America/Chihuahua ▼]                 │
│                                        │
│  👤 Contacto Principal                 │
│  Nombre: [______________]              │
│  Email:  [______________]              │
│  Teléfono: [____________]              │
│                                        │
│                    [Siguiente →]       │
└────────────────────────────────────────┘
```

---

### Paso 2: WhatsApp API

**Datos a recopilar:**
```typescript
interface WhatsAppConfig {
  hasAccount: boolean;          // ¿Ya tiene Meta Business Account?
  phoneNumber: string;          // +52 614 123 4567
  phoneNumberId?: string;       // Si hasAccount = true
  accessToken?: string;         // Si hasAccount = true
  businessAccountId?: string;   // Si hasAccount = true
}
```

**Validaciones:**
- `phoneNumber`: formato E.164 obligatorio
- Si `hasAccount = true`:
  - `phoneNumberId`: 15-20 dígitos
  - `accessToken`: mínimo 100 caracteres
  - `businessAccountId`: requerido

**UI Design:**
```
┌────────────────────────────────────────┐
│  2 of 7 ●●○○○○○                       │
├────────────────────────────────────────┤
│  Configuración de WhatsApp             │
│                                        │
│  ¿Ya tienes Meta Business Account?    │
│  ○ Sí, ya tengo credenciales          │
│  ● No, necesito crearla                │
│                                        │
│  Número de WhatsApp *                  │
│  [+52 __________________]              │
│  ℹ️ Este será el número del asistente │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ 📖 Tutorial: Cómo obtener      │   │
│  │    credenciales de Meta        │   │
│  │    [Ver guía paso a paso]      │   │
│  └────────────────────────────────┘   │
│                                        │
│  [← Atrás]             [Siguiente →]   │
└────────────────────────────────────────┘
```

**Si hasAccount = true, mostrar campos adicionales:**
```
│  Credenciales de Meta                  │
│                                        │
│  Phone Number ID *                     │
│  [______________________________]      │
│                                        │
│  Access Token *                        │
│  [______________________________]      │
│  🔒 Se guardará de forma segura        │
│                                        │
│  Business Account ID *                 │
│  [______________________________]      │
```

---

### Paso 3: Servicios y Precios

**Datos a recopilar:**
```typescript
interface Service {
  id: string;                   // auto-generated UUID
  name: string;                 // "Corte de cabello"
  price: number;                // 200.00
  duration: number;             // minutos (15, 30, 45, 60, 90, 120)
  description?: string;         // "Incluye lavado y secado"
}

interface ServicesConfig {
  currency: string;             // "MXN" | "USD"
  services: Service[];          // mínimo 1 servicio
}
```

**Validaciones:**
- Mínimo 1 servicio requerido
- `service.name`: 2-100 caracteres
- `service.price`: número positivo
- `service.duration`: uno de [15, 30, 45, 60, 90, 120, 180, 240]

**UI Design:**
```
┌────────────────────────────────────────┐
│  3 of 7 ●●●○○○○                       │
├────────────────────────────────────────┤
│  Servicios y Precios                   │
│                                        │
│  Moneda: [MXN ▼]                       │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ Corte Clásico             $150 │   │
│  │ 30 minutos            [Editar][X]│  │
│  └────────────────────────────────┘   │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ Corte + Barba             $250 │   │
│  │ 45 minutos            [Editar][X]│  │
│  └────────────────────────────────┘   │
│                                        │
│  [+ Agregar Servicio]                  │
│                                        │
│  [← Atrás]             [Siguiente →]   │
└────────────────────────────────────────┘
```

**Modal para agregar/editar servicio:**
```
┌────────────────────────────────────────┐
│  Nuevo Servicio                   [X]  │
├────────────────────────────────────────┤
│  Nombre *                              │
│  [__________________________]          │
│                                        │
│  Precio * (MXN)                        │
│  [_______]                             │
│                                        │
│  Duración *                            │
│  [30 minutos ▼]                        │
│   • 15 minutos                         │
│   • 30 minutos                         │
│   • 45 minutos                         │
│   • 60 minutos                         │
│   • 90 minutos                         │
│   • 120 minutos                        │
│                                        │
│  Descripción (opcional)                │
│  [__________________________]          │
│  [__________________________]          │
│                                        │
│       [Cancelar]  [Guardar Servicio]   │
└────────────────────────────────────────┘
```

**Plantillas por Industria:**
```typescript
const SERVICE_TEMPLATES = {
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
  ]
};
```

---

### Paso 4: Horarios de Operación

**Datos a recopilar:**
```typescript
interface DaySchedule {
  enabled: boolean;              // ¿Abierto este día?
  open: string;                  // "09:00" (HH:MM formato 24h)
  close: string;                 // "18:00"
}

interface ScheduleConfig {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}
```

**Validaciones:**
- Al menos 1 día debe estar habilitado
- Si `enabled = true`: `open < close`
- Formato de hora: `HH:MM` (24 horas)

**UI Design:**
```
┌────────────────────────────────────────┐
│  4 of 7 ●●●●○○○                       │
├────────────────────────────────────────┤
│  Horarios de Operación                 │
│                                        │
│  ☑ Lunes      [09:00] a [18:00]       │
│  ☑ Martes     [09:00] a [18:00]       │
│  ☑ Miércoles  [09:00] a [18:00]       │
│  ☑ Jueves     [09:00] a [18:00]       │
│  ☑ Viernes    [09:00] a [20:00]       │
│  ☑ Sábado     [10:00] a [15:00]       │
│  ☐ Domingo    Cerrado                  │
│                                        │
│  ⚡ Plantillas rápidas:                │
│  [Lun-Vie 9-6] [Lun-Sáb 9-7]          │
│                                        │
│  [← Atrás]             [Siguiente →]   │
└────────────────────────────────────────┘
```

**Plantillas de Horario:**
```typescript
const SCHEDULE_PRESETS = {
  'weekdays-9-6': {
    monday: { enabled: true, open: '09:00', close: '18:00' },
    tuesday: { enabled: true, open: '09:00', close: '18:00' },
    wednesday: { enabled: true, open: '09:00', close: '18:00' },
    thursday: { enabled: true, open: '09:00', close: '18:00' },
    friday: { enabled: true, open: '09:00', close: '18:00' },
    saturday: { enabled: false },
    sunday: { enabled: false }
  },
  'weekdays-sat-9-7': {
    // Lunes-Sábado 9-7, Domingo cerrado
  }
};
```

---

### Paso 5: Políticas del Negocio

**Datos a recopilar:**
```typescript
interface BusinessPolicies {
  minAdvanceBooking: number;    // horas (1, 2, 4, 8, 12, 24, 48)
  allowCancellation: boolean;
  minCancellationHours: number; // 0-72
  requireDeposit: boolean;
  depositAmount?: number;       // si requireDeposit = true
}
```

**Validaciones:**
- `minAdvanceBooking`: 1-168 horas (1 hora a 1 semana)
- `minCancellationHours`: 0-72 horas
- Si `requireDeposit = true`: `depositAmount` es obligatorio y > 0

**UI Design:**
```
┌────────────────────────────────────────┐
│  5 of 7 ●●●●●○○                       │
├────────────────────────────────────────┤
│  Políticas del Negocio                 │
│                                        │
│  ⏰ Reserva Anticipada                 │
│  Mínimo de horas de anticipación       │
│  [2 horas ▼]                           │
│  ℹ️ Tiempo mínimo para agendar         │
│                                        │
│  ❌ Cancelaciones                      │
│  ☑ Permitir cancelaciones              │
│  Con mínimo de [4 horas ▼]            │
│                                        │
│  💰 Depósito                           │
│  ☐ Requiere depósito                   │
│  Monto: [___] MXN                      │
│  (Solo visible si checkbox activado)   │
│                                        │
│  [← Atrás]             [Siguiente →]   │
└────────────────────────────────────────┘
```

---

### Paso 6: Configuración del Asistente IA

**Datos a recopilar:**
```typescript
interface AssistantConfig {
  assistantName: string;        // "María"
  tone: string;                 // friendly | professional | formal
  language: string;             // es | en
  customRules: string[];        // array de reglas personalizadas
}
```

**Validaciones:**
- `assistantName`: 2-50 caracteres
- `tone`: uno de los valores del enum
- `language`: uno de los valores del enum
- `customRules`: máximo 10 reglas, cada una 10-500 caracteres

**UI Design:**
```
┌────────────────────────────────────────┐
│  6 of 7 ●●●●●●○                       │
├────────────────────────────────────────┤
│  Configuración del Asistente IA        │
│                                        │
│  Nombre del asistente *                │
│  [María_______________]                │
│  ℹ️ Cómo se presentará el bot          │
│                                        │
│  Tono de comunicación *                │
│  ● Amigable (casual, cercano)          │
│  ○ Profesional (cordial, formal)       │
│  ○ Formal (muy educado, distante)      │
│                                        │
│  Idioma principal *                    │
│  ● Español                             │
│  ○ English                             │
│                                        │
│  Reglas personalizadas (opcional)      │
│  [+ Agregar regla]                     │
│                                        │
│  • Siempre preguntar preferencia...   │
│    [editar] [X]                        │
│  • No agendar el mismo día             │
│    [editar] [X]                        │
│                                        │
│  [← Atrás]             [Siguiente →]   │
└────────────────────────────────────────┘
```

**Modal para agregar regla:**
```
┌────────────────────────────────────────┐
│  Nueva Regla Personalizada        [X]  │
├────────────────────────────────────────┤
│                                        │
│  [__________________________]          │
│  [__________________________]          │
│  [__________________________]          │
│  (max 500 caracteres)                  │
│                                        │
│  💡 Ejemplos:                          │
│  • Siempre ofrecer corte + barba       │
│  • Preguntar si es primera visita      │
│  • Confirmar edad para ciertos servicios│
│                                        │
│       [Cancelar]  [Agregar Regla]      │
└────────────────────────────────────────┘
```

**Descripción de Tonos:**
```typescript
const TONE_DESCRIPTIONS = {
  friendly: {
    label: 'Amigable',
    description: 'Casual, cercano, usa "tú"',
    example: '"¡Hola! ¿En qué te puedo ayudar?"'
  },
  professional: {
    label: 'Profesional',
    description: 'Cordial, formal, usa "usted"',
    example: '"Buenos días. ¿En qué puedo asistirle?"'
  },
  formal: {
    label: 'Formal',
    description: 'Muy educado, distante',
    example: '"Reciba un cordial saludo. ¿Cómo podría ayudarle el día de hoy?"'
  }
};
```

---

### Paso 7: Resumen y JSON

**Funcionalidad:**
- Mostrar resumen legible de todos los pasos
- Mostrar JSON formateado con syntax highlighting
- Botón "Copiar JSON"
- Botón "Descargar JSON"
- Botones "Editar" para volver a cualquier paso
- Botón "Limpiar y Empezar de Nuevo"

**UI Design:**
```
┌────────────────────────────────────────┐
│  7 of 7 ●●●●●●●                       │
├────────────────────────────────────────┤
│  ✅ Configuración Completa             │
│                                        │
│  📋 Resumen:                           │
│                                        │
│  🏢 Negocio                      [Editar]│
│  • Barbería StyleCut                   │
│  • Chihuahua, Chihuahua                │
│  • Zona: America/Chihuahua             │
│                                        │
│  📱 WhatsApp                     [Editar]│
│  • +52 614 123 4567                    │
│  • Credenciales: Configuradas ✓        │
│                                        │
│  💇 Servicios (3)                [Editar]│
│  • Corte Clásico - $150 - 30min        │
│  • Corte + Barba - $250 - 45min        │
│  • Afeitado - $100 - 20min             │
│                                        │
│  🕐 Horarios                     [Editar]│
│  • Lun-Vie: 9am-6pm                    │
│  • Sábado: 10am-3pm                    │
│  • Domingo: Cerrado                    │
│                                        │
│  📋 Políticas                    [Editar]│
│  • Anticipación: 2 horas               │
│  • Cancelación: 4 horas                │
│  • Depósito: No requerido              │
│                                        │
│  🤖 Asistente IA                 [Editar]│
│  • Nombre: María                       │
│  • Tono: Amigable                      │
│  • Idioma: Español                     │
│  • Reglas: 2 personalizadas            │
│                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│  📄 JSON de Configuración              │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ {                              │   │
│  │   "metadata": {                │   │
│  │     "version": "1.0",          │   │
│  │     "createdAt": "2026-01-21"  │   │
│  │   },                           │   │
│  │   "client": {                  │   │
│  │     "business": { ... },       │   │
│  │     "whatsapp": { ... },       │   │
│  │     ...                        │   │
│  │   }                            │   │
│  │ }                              │   │
│  │                                │   │
│  │  [📋 Copiar JSON]  [📥 Descargar] │
│  └────────────────────────────────┘   │
│                                        │
│  📝 Próximos Pasos:                    │
│  1. Crear cliente en DynamoDB          │
│  2. Crear Bedrock Agent                │
│  3. Configurar Knowledge Base          │
│  4. Registrar webhook de WhatsApp      │
│  5. Subir documentos iniciales         │
│  6. Prueba completa                    │
│                                        │
│  [🔄 Empezar de Nuevo]                 │
└────────────────────────────────────────┘
```

**JSON Output Format:**
```json
{
  "metadata": {
    "version": "1.0",
    "createdAt": "2026-01-21T20:30:00.000Z",
    "completedBy": "landing-form"
  },
  "client": {
    "business": {
      "clientName": "Barbería StyleCut",
      "industry": "barberia",
      "location": {
        "street": "Av. Universidad 123",
        "city": "Chihuahua",
        "state": "Chihuahua",
        "country": "México"
      },
      "timezone": "America/Chihuahua",
      "contactPerson": {
        "name": "Juan Pérez",
        "email": "juan@stylecut.com",
        "phone": "+52 614 123 4567"
      }
    },
    "whatsapp": {
      "hasAccount": true,
      "phoneNumber": "+52 614 123 4567",
      "phoneNumberId": "123456789",
      "accessToken": "EAAxxxxx...",
      "businessAccountId": "987654321"
    },
    "services": {
      "currency": "MXN",
      "services": [
        {
          "id": "svc-1",
          "name": "Corte Clásico",
          "price": 150,
          "duration": 30,
          "description": "Corte tradicional con tijera o máquina"
        },
        {
          "id": "svc-2",
          "name": "Corte + Barba",
          "price": 250,
          "duration": 45,
          "description": "Corte completo más arreglo de barba"
        }
      ]
    },
    "schedule": {
      "monday": { "enabled": true, "open": "09:00", "close": "18:00" },
      "tuesday": { "enabled": true, "open": "09:00", "close": "18:00" },
      "wednesday": { "enabled": true, "open": "09:00", "close": "18:00" },
      "thursday": { "enabled": true, "open": "09:00", "close": "18:00" },
      "friday": { "enabled": true, "open": "09:00", "close": "18:00" },
      "saturday": { "enabled": true, "open": "10:00", "close": "15:00" },
      "sunday": { "enabled": false }
    },
    "policies": {
      "minAdvanceBooking": 2,
      "allowCancellation": true,
      "minCancellationHours": 4,
      "requireDeposit": false
    },
    "assistant": {
      "assistantName": "María",
      "tone": "friendly",
      "language": "es",
      "customRules": [
        "Siempre preguntar preferencia de barbero",
        "Ofrecer corte + barba como paquete"
      ]
    }
  },
  "nextSteps": [
    "1. Crear registro en tabla Clients de DynamoDB",
    "2. Crear Bedrock Agent con clientId generado",
    "3. Configurar Knowledge Base en Aurora pgvector",
    "4. Registrar webhook de WhatsApp en Meta Cloud API",
    "5. Subir documentos de servicios al Knowledge Base",
    "6. Realizar prueba completa de conversación"
  ]
}
```

---

## 🧩 Arquitectura de Componentes

### State Management Hook: useOnboardingForm

**Ubicación:** `/hooks/useOnboardingForm.ts`

**Responsabilidades:**
- Gestionar estado global del wizard (currentStep, formData, errors)
- Validar cada paso antes de avanzar
- Persistir en localStorage después de cada cambio
- Recuperar datos guardados al montar
- Navegación entre pasos

**Interface:**
```typescript
const useOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingFormData>(DEFAULT_DATA);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadOnboardingState();
    if (saved) {
      setFormData(saved.formData);
      setCurrentStep(saved.currentStep);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    saveOnboardingState({ currentStep, formData });
  }, [currentStep, formData]);

  // Update specific step data
  const updateStep = (step: keyof OnboardingFormData, data: any) => {
    setFormData(prev => ({ ...prev, [step]: data }));
  };

  // Validate current step before navigation
  const validateStep = (step: number): boolean => {
    const schema = STEP_SCHEMAS[step];
    const data = formData[STEP_KEYS[step]];

    try {
      schema.parse(data);
      setErrors(prev => ({ ...prev, [step]: [] }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map(e => e.message);
        setErrors(prev => ({ ...prev, [step]: errorMessages }));
      }
      return false;
    }
  };

  // Navigate to next step (with validation)
  const goNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 7));
    }
  };

  // Navigate to previous step
  const goBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Jump to specific step (from summary edit buttons)
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Reset entire form
  const reset = () => {
    clearOnboardingState();
    setFormData(DEFAULT_DATA);
    setCurrentStep(1);
    setErrors({});
  };

  return {
    currentStep,
    formData,
    errors,
    updateStep,
    validateStep,
    goNext,
    goBack,
    goToStep,
    reset
  };
};
```

---

### Validation Schemas (Zod)

**Ubicación:** `/lib/onboarding-schema.ts`

```typescript
import { z } from 'zod';

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
  ], { errorMap: () => ({ message: "Selecciona una industria" }) }),

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
    .positive("Precio debe ser mayor a 0"),
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
    errorMap: () => ({ message: "Selecciona un tono" })
  }),

  language: z.enum(['es', 'en'], {
    errorMap: () => ({ message: "Selecciona un idioma" })
  }),

  customRules: z.array(
    z.string()
      .min(10, "Mínimo 10 caracteres")
      .max(500, "Máximo 500 caracteres")
  ).max(10, "Máximo 10 reglas personalizadas")
  .default([])
});

// Helper function
function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Map steps to schemas
export const STEP_SCHEMAS = {
  1: businessSchema,
  2: whatsappSchema,
  3: servicesSchema,
  4: scheduleSchema,
  5: policiesSchema,
  6: assistantSchema
};
```

---

### localStorage Utilities

**Ubicación:** `/lib/onboarding-storage.ts`

```typescript
const STORAGE_KEY = 'receptionist-ai-onboarding-v1';

interface OnboardingState {
  currentStep: number;
  formData: OnboardingFormData;
  savedAt: string;
}

export const saveOnboardingState = (state: OnboardingState): void => {
  try {
    const dataToSave = {
      ...state,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Failed to save onboarding state:', error);
  }
};

export const loadOnboardingState = (): OnboardingState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    // Check if data is expired (7 days)
    const savedDate = new Date(parsed.savedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      clearOnboardingState();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load onboarding state:', error);
    clearOnboardingState();
    return null;
  }
};

export const clearOnboardingState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasInProgressOnboarding = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};
```

---

### Constants

**Ubicación:** `/lib/onboarding-constants.ts`

```typescript
export const INDUSTRIES = [
  { value: 'barberia', label: 'Barbería' },
  { value: 'hospital', label: 'Hospital/Clínica' },
  { value: 'gym', label: 'Gym/Fitness' },
  { value: 'spa', label: 'Spa/Salón de belleza' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'consultorio', label: 'Consultorio médico' },
  { value: 'other', label: 'Otro' }
];

export const TIMEZONES = [
  { value: 'America/Tijuana', label: 'Tijuana (UTC-8, PST)' },
  { value: 'America/Hermosillo', label: 'Hermosillo (UTC-7, MST sin DST)' },
  { value: 'America/Chihuahua', label: 'Chihuahua (UTC-7, MST)' },
  { value: 'America/Mazatlan', label: 'Mazatlán (UTC-7, MST)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6, CST)' },
  { value: 'America/Cancun', label: 'Cancún (UTC-5, EST)' }
];

export const CURRENCIES = [
  { value: 'MXN', label: 'Peso Mexicano (MXN)', symbol: '$' },
  { value: 'USD', label: 'Dólar Americano (USD)', symbol: '$' }
];

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

export const ADVANCE_BOOKING_OPTIONS = [
  { value: 1, label: '1 hora' },
  { value: 2, label: '2 horas' },
  { value: 4, label: '4 horas' },
  { value: 8, label: '8 horas' },
  { value: 12, label: '12 horas' },
  { value: 24, label: '24 horas (1 día)' },
  { value: 48, label: '48 horas (2 días)' }
];

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

export const LANGUAGES = [
  { value: 'es', label: 'Español', flag: '🇲🇽' },
  { value: 'en', label: 'English', flag: '🇺🇸' }
];

export const STEP_TITLES = [
  'Información del Negocio',
  'Configuración de WhatsApp',
  'Servicios y Precios',
  'Horarios de Operación',
  'Políticas del Negocio',
  'Configuración del Asistente',
  'Resumen y JSON'
];

export const DEFAULT_FORM_DATA: OnboardingFormData = {
  business: {
    clientName: '',
    industry: '',
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
```

---

## 🎨 UI/UX Guidelines

### Design System

**Colores:**
```css
:root {
  --color-primary: #2563eb;      /* Blue 600 */
  --color-primary-hover: #1d4ed8; /* Blue 700 */
  --color-secondary: #10b981;    /* Green 500 */
  --color-danger: #ef4444;       /* Red 500 */
  --color-warning: #f59e0b;      /* Amber 500 */

  --color-text: #111827;         /* Gray 900 */
  --color-text-muted: #6b7280;   /* Gray 500 */

  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb; /* Gray 50 */
  --color-border: #e5e7eb;       /* Gray 200 */
}
```

**Tipografía:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Headings */
h1: 2rem (32px), font-weight: 700
h2: 1.5rem (24px), font-weight: 600
h3: 1.25rem (20px), font-weight: 600

/* Body */
body: 1rem (16px), font-weight: 400
small: 0.875rem (14px)
```

**Espaciado:**
```css
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
```

**Bordes:**
```css
border-radius: 0.5rem;  /* 8px */
border-width: 1px;
```

**Sombras:**
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

---

### Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
};

// Mobile first approach
@media (min-width: 640px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

---

### Accessibility (a11y)

**Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators (blue ring)
- ARIA labels for all interactive elements
- Screen reader friendly
- Color contrast 4.5:1 minimum

**Implementation:**
```tsx
<button
  aria-label="Siguiente paso"
  aria-describedby="step-description"
  className="focus:ring-2 focus:ring-blue-500"
>
  Siguiente →
</button>

<input
  id="email"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>

{error && (
  <p id="email-error" role="alert" className="text-red-600">
    {error}
  </p>
)}
```

---

## 📝 TypeScript Interfaces

**Ubicación:** `/lib/onboarding-types.ts`

```typescript
// Main form data structure
export interface OnboardingFormData {
  business: BusinessInfo;
  whatsapp: WhatsAppConfig;
  services: ServicesConfig;
  schedule: ScheduleConfig;
  policies: BusinessPolicies;
  assistant: AssistantConfig;
}

// Step 1
export interface BusinessInfo {
  clientName: string;
  industry: IndustryType;
  location: {
    street?: string;
    city: string;
    state: string;
    country: string;
  };
  timezone: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
}

export type IndustryType =
  | 'barberia'
  | 'hospital'
  | 'gym'
  | 'spa'
  | 'restaurant'
  | 'consultorio'
  | 'other';

// Step 2
export interface WhatsAppConfig {
  hasAccount: boolean;
  phoneNumber: string;
  phoneNumberId?: string;
  accessToken?: string;
  businessAccountId?: string;
}

// Step 3
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface ServicesConfig {
  currency: 'MXN' | 'USD';
  services: Service[];
}

// Step 4
export interface DaySchedule {
  enabled: boolean;
  open: string;
  close: string;
}

export interface ScheduleConfig {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

// Step 5
export interface BusinessPolicies {
  minAdvanceBooking: number;
  allowCancellation: boolean;
  minCancellationHours: number;
  requireDeposit: boolean;
  depositAmount?: number;
}

// Step 6
export interface AssistantConfig {
  assistantName: string;
  tone: 'friendly' | 'professional' | 'formal';
  language: 'es' | 'en';
  customRules: string[];
}

// Final JSON output
export interface OnboardingOutput {
  metadata: {
    version: string;
    createdAt: string;
    completedBy: string;
  };
  client: OnboardingFormData;
  nextSteps: string[];
}
```

---

## 🚀 Implementación - Orden de Desarrollo

### Fase 1: Setup y Estructura (1-2 horas)
- [x] Crear carpeta `/app/onboarding/`
- [ ] Crear `/lib/onboarding-types.ts`
- [ ] Crear `/lib/onboarding-constants.ts`
- [ ] Crear `/lib/onboarding-schema.ts` (Zod schemas)
- [ ] Crear `/lib/onboarding-storage.ts` (localStorage)
- [ ] Crear `/hooks/useOnboardingForm.ts`
- [ ] Configurar Tailwind (si no está)

### Fase 2: Componentes Compartidos (2-3 horas)
- [ ] `/app/components/onboarding/shared/FormInput.tsx`
- [ ] `/app/components/onboarding/shared/FormSelect.tsx`
- [ ] `/app/components/onboarding/shared/FormCheckbox.tsx`
- [ ] `/app/components/onboarding/shared/FormTimePicker.tsx`
- [ ] `/app/components/onboarding/ProgressBar.tsx`
- [ ] `/app/components/onboarding/NavigationButtons.tsx`
- [ ] `/app/components/onboarding/StepContainer.tsx`

### Fase 3: Pasos del Wizard (6-8 horas)
- [ ] `Step1Business.tsx` (2 horas)
- [ ] `Step2WhatsApp.tsx` (1.5 horas)
- [ ] `Step3Services.tsx` (2 horas - más complejo)
- [ ] `Step4Schedule.tsx` (1.5 horas)
- [ ] `Step5Policies.tsx` (1 hora)
- [ ] `Step6Assistant.tsx` (1.5 horas)
- [ ] `Step7Summary.tsx` (2 horas)

### Fase 4: Orchestrador y Layout (1-2 horas)
- [ ] `/app/onboarding/page.tsx` (wizard main)
- [ ] `/app/onboarding/layout.tsx` (clean layout)

### Fase 5: Testing y Refinamiento (2-3 horas)
- [ ] Probar navegación entre pasos
- [ ] Probar validaciones
- [ ] Probar persistencia localStorage
- [ ] Probar responsive mobile
- [ ] Probar copy/download JSON
- [ ] Fix bugs y edge cases

**TOTAL ESTIMADO: 14-20 horas de desarrollo**

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] Navegar todos los pasos sin errores
- [ ] Validación muestra errores correctos
- [ ] No permite avanzar si hay errores
- [ ] Botón "Atrás" funciona
- [ ] localStorage persiste datos
- [ ] Recupera datos al recargar página
- [ ] Botones "Editar" desde resumen funcionan
- [ ] Copiar JSON funciona
- [ ] Descargar JSON funciona
- [ ] "Limpiar y Empezar de Nuevo" limpia todo
- [ ] Responsive en mobile funciona
- [ ] Keyboard navigation funciona (Tab, Enter)
- [ ] Accesibilidad (screen reader test)

### Edge Cases
- [ ] Cerrar browser mid-flow y volver
- [ ] Intentar skip steps (debe validar)
- [ ] Agregar 10+ servicios
- [ ] Nombres muy largos de servicios
- [ ] Horarios inválidos (close < open)
- [ ] localStorage lleno/corrupto
- [ ] Sin JavaScript habilitado

---

## 📦 Dependencies Necesarias

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.22.4",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

---

## 🔧 Utilities Helpers

**Ubicación:** `/lib/onboarding-utils.ts`

```typescript
import { v4 as uuidv4 } from 'uuid';

// Generate unique ID for services
export const generateId = (): string => {
  return uuidv4();
};

// Format phone number as user types
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.startsWith('52')) {
    // Mexican number
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`;
  }

  return `+${cleaned}`;
};

// Parse time string to minutes (for validation)
export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Format date for filename
export const getFilenameDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Download JSON file
export const downloadJSON = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate phone format (E.164)
export const isValidPhone = (phone: string): boolean => {
  const regex = /^\+\d{10,15}$/;
  return regex.test(phone);
};
```

---

## 📍 Routing

**URLs:**
- Landing page: `https://receptionist-ai.com/`
- Onboarding wizard: `https://receptionist-ai.com/onboarding`

**Navegación:**
- Desde landing: Botón "Crear Cuenta" → `/onboarding`
- Desde onboarding: No hay navbar, solo wizard
- Después de completar: Botón "Volver al inicio" → `/`

---

## ✅ Checklist Final de Implementación

### Archivos a Crear
- [ ] `/app/onboarding/page.tsx`
- [ ] `/app/onboarding/layout.tsx`
- [ ] `/lib/onboarding-types.ts`
- [ ] `/lib/onboarding-schema.ts`
- [ ] `/lib/onboarding-storage.ts`
- [ ] `/lib/onboarding-constants.ts`
- [ ] `/lib/onboarding-utils.ts`
- [ ] `/hooks/useOnboardingForm.ts`
- [ ] `/app/components/onboarding/ProgressBar.tsx`
- [ ] `/app/components/onboarding/NavigationButtons.tsx`
- [ ] `/app/components/onboarding/StepContainer.tsx`
- [ ] `/app/components/onboarding/Step1Business.tsx`
- [ ] `/app/components/onboarding/Step2WhatsApp.tsx`
- [ ] `/app/components/onboarding/Step3Services.tsx`
- [ ] `/app/components/onboarding/Step4Schedule.tsx`
- [ ] `/app/components/onboarding/Step5Policies.tsx`
- [ ] `/app/components/onboarding/Step6Assistant.tsx`
- [ ] `/app/components/onboarding/Step7Summary.tsx`
- [ ] `/app/components/onboarding/shared/FormInput.tsx`
- [ ] `/app/components/onboarding/shared/FormSelect.tsx`
- [ ] `/app/components/onboarding/shared/FormCheckbox.tsx`
- [ ] `/app/components/onboarding/shared/FormTimePicker.tsx`

### Funcionalidad Core
- [ ] Navegación entre 7 pasos
- [ ] Validación Zod en cada paso
- [ ] Persistencia en localStorage
- [ ] Recuperación de datos al reload
- [ ] Generación de JSON final
- [ ] Copiar JSON al clipboard
- [ ] Descargar JSON como archivo
- [ ] Botones "Editar" desde resumen
- [ ] Reset completo del form

### UI/UX
- [ ] Responsive mobile
- [ ] Progress bar visual
- [ ] Transiciones suaves
- [ ] Loading states
- [ ] Error messages claros
- [ ] Success feedback
- [ ] Tooltips informativos

### Accesibilidad
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Focus indicators
- [ ] Screen reader compatible
- [ ] Color contrast WCAG AA

---

## 📞 Contacto

Para preguntas o soporte sobre la implementación:
- **Email:** dev@receptionist-ai.com
- **Documentation:** Este archivo (CLAUDE.md)

---

**Última actualización:** 2026-01-21
**Versión:** 1.0.0
**Status:** ✅ Plan completo - Listo para implementación
