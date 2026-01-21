// TypeScript interfaces for onboarding wizard

// Main form data structure
export interface OnboardingFormData {
  business: BusinessInfo;
  whatsapp: WhatsAppConfig;
  services: ServicesConfig;
  schedule: ScheduleConfig;
  policies: BusinessPolicies;
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

export type IndustryType =
  | 'barberia'
  | 'hospital'
  | 'gym'
  | 'spa'
  | 'restaurant'
  | 'consultorio'
  | 'other';

// Step 2: WhatsApp Configuration
export interface WhatsAppConfig {
  hasAccount: boolean;
  phoneNumber: string;
  phoneNumberId?: string;
  accessToken?: string;
  businessAccountId?: string;
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

// localStorage state
export interface OnboardingState {
  currentStep: number;
  formData: OnboardingFormData;
  savedAt: string;
}
