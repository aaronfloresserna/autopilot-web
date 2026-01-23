// TypeScript interfaces for onboarding wizard

// Plan tiers
export type PlanTier = 'basic' | 'pro' | 'enterprise';

// Main form data structure
export interface OnboardingFormData {
  plan: PlanTier;
  business: BusinessInfo;
  whatsapp: WhatsAppConfig;
  services: ServicesConfig;
  tenants: TenantConfig[];  // New: multiple tenants
  schedule: ScheduleConfig; // Deprecated: moved to tenant level
  policies: BusinessPolicies; // Deprecated: moved to tenant level
  assistant: AssistantConfig;
}

// Step 1: Business Information
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

// Industry is now free text (not restricted to enum)
export type IndustryType = string;

// Step 2: WhatsApp Configuration
export interface WhatsAppConfig {
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookVerifyToken: string;
  appId?: string;
  appSecret?: string;
}

// Step 3: Services
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

// Step 4: Schedule
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

// Step 5: Business Policies
export interface BusinessPolicies {
  minAdvanceBooking: number;
  allowCancellation: boolean;
  minCancellationHours: number;
  requireDeposit: boolean;
  depositAmount?: number;
}

// Step 6: Assistant Configuration
export interface AssistantConfig {
  assistantName: string;
  tone: 'friendly' | 'professional' | 'formal';
  language: 'es' | 'en';
  customRules: string[];
}

// Step 4 (New): Tenant Configuration
export interface TenantConfig {
  id: string;
  tenantName: string;
  email?: string;
  specialty?: string; // For hospitals: "Medicina General", "Pediatría", etc.
  services: string[]; // Service IDs from Step 3
  businessHours: ScheduleConfig;
  appointmentSettings: {
    slotInterval: number;
    allowSameDayBooking: boolean;
    maxAdvanceBookingDays: number;
    minAdvanceBookingHours: number;
    allowCancellation: boolean;
    minCancellationHours: number;
  };
}

// Final JSON output
export interface OnboardingOutput {
  metadata: {
    version: string;
    createdAt: string;
    completedBy: string;
  };
  client: {
    plan: PlanTier;
    clientName: string;
    industry: IndustryType;
    location: BusinessInfo['location'];
    timezone: string;
    contactPerson: BusinessInfo['contactPerson'];
    whatsappConfig: Omit<WhatsAppConfig, 'hasAccount'>;
    assistantConfig: AssistantConfig;
    status: 'trial' | 'active' | 'suspended';
    tier: PlanTier;
  };
  services: Service[];
  tenants: TenantConfig[];
  nextSteps: string[];
}

// localStorage state
export interface OnboardingState {
  currentStep: number;
  formData: OnboardingFormData;
  savedAt: string;
}
