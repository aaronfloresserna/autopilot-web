'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { OnboardingFormData } from '@/lib/onboarding-types';
import { DEFAULT_FORM_DATA } from '@/lib/onboarding-constants';
import { STEP_SCHEMAS } from '@/lib/onboarding-schema';
import {
  saveOnboardingState,
  loadOnboardingState,
  clearOnboardingState
} from '@/lib/onboarding-storage';

const STEP_KEYS: Record<number, keyof OnboardingFormData> = {
  1: 'business',
  2: 'whatsapp',
  3: 'services',
  4: 'schedule',
  5: 'policies',
  6: 'assistant'
};

export const useOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadOnboardingState();
    if (saved) {
      setFormData(saved.formData);
      setCurrentStep(saved.currentStep);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoading) {
      saveOnboardingState(currentStep, formData);
    }
  }, [currentStep, formData, isLoading]);

  // Update specific step data
  const updateStep = (step: keyof OnboardingFormData, data: any) => {
    setFormData(prev => ({ ...prev, [step]: data }));
  };

  // Validate current step before navigation
  const validateStep = (step: number): boolean => {
    // Step 7 (Summary) doesn't need validation
    if (step === 7) return true;

    const schema = STEP_SCHEMAS[step as keyof typeof STEP_SCHEMAS];
    const stepKey = STEP_KEYS[step];
    const data = formData[stepKey];

    if (!schema) {
      console.warn(`No schema found for step ${step}`);
      return true;
    }

    try {
      schema.parse(data);
      setErrors(prev => ({ ...prev, [step]: [] }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map(e => `${e.path.join('.')}: ${e.message}`);
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
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
    }
  };

  // Reset entire form
  const reset = () => {
    clearOnboardingState();
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStep(1);
    setErrors({});
  };

  return {
    currentStep,
    formData,
    errors,
    isLoading,
    updateStep,
    validateStep,
    goNext,
    goBack,
    goToStep,
    reset
  };
};
