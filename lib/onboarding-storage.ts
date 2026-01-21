import { OnboardingState, OnboardingFormData } from './onboarding-types';

const STORAGE_KEY = 'receptionist-ai-onboarding-v1';

export const saveOnboardingState = (currentStep: number, formData: OnboardingFormData): void => {
  try {
    const dataToSave: OnboardingState = {
      currentStep,
      formData,
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

    const parsed: OnboardingState = JSON.parse(saved);

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
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear onboarding state:', error);
  }
};

export const hasInProgressOnboarding = (): boolean => {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return false;
  }
};
