'use client';

import React from 'react';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';
import { ProgressBar } from '@/app/components/onboarding/ProgressBar';
import { NavigationButtons } from '@/app/components/onboarding/NavigationButtons';
import { Step1Business } from '@/app/components/onboarding/Step1Business';
import { Step2WhatsApp } from '@/app/components/onboarding/Step2WhatsApp';
import { Step3Services } from '@/app/components/onboarding/Step3Services';
import { Step4Schedule } from '@/app/components/onboarding/Step4Schedule';
import { Step5Policies } from '@/app/components/onboarding/Step5Policies';
import { Step6Assistant } from '@/app/components/onboarding/Step6Assistant';
import { Step7Summary } from '@/app/components/onboarding/Step7Summary';

export default function OnboardingPage() {
  const {
    currentStep,
    formData,
    errors,
    isLoading,
    updateStep,
    goNext,
    goBack,
    goToStep,
    reset
  } = useOnboardingForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Business
            data={formData.business}
            onChange={(data) => updateStep('business', data)}
            errors={errors[1]}
          />
        );
      case 2:
        return (
          <Step2WhatsApp
            data={formData.whatsapp}
            onChange={(data) => updateStep('whatsapp', data)}
            errors={errors[2]}
          />
        );
      case 3:
        return (
          <Step3Services
            data={formData.services}
            onChange={(data) => updateStep('services', data)}
            errors={errors[3]}
            industryType={formData.business.industry}
          />
        );
      case 4:
        return (
          <Step4Schedule
            data={formData.schedule}
            onChange={(data) => updateStep('schedule', data)}
            errors={errors[4]}
          />
        );
      case 5:
        return (
          <Step5Policies
            data={formData.policies}
            onChange={(data) => updateStep('policies', data)}
            errors={errors[5]}
          />
        );
      case 6:
        return (
          <Step6Assistant
            data={formData.assistant}
            onChange={(data) => updateStep('assistant', data)}
            errors={errors[6]}
          />
        );
      case 7:
        return (
          <Step7Summary
            data={formData}
            onEdit={goToStep}
            onReset={() => {
              if (confirm('¿Estás seguro de que quieres empezar de nuevo? Se perderán todos los datos.')) {
                reset();
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProgressBar currentStep={currentStep} />

      <div className="mt-8">
        {renderStep()}
      </div>

      <NavigationButtons
        currentStep={currentStep}
        onBack={goBack}
        onNext={goNext}
      />
    </div>
  );
}
