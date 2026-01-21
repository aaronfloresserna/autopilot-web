import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps = 7,
  onBack,
  onNext,
  isNextDisabled = false
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className={`
          flex items-center px-6 py-3 rounded-lg font-medium transition
          ${
            isFirstStep
              ? 'invisible'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }
        `}
        aria-label="Paso anterior"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Atrás
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className={`
          flex items-center px-6 py-3 rounded-lg font-medium transition
          ${
            isNextDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
          }
        `}
        aria-label={isLastStep ? 'Finalizar' : 'Siguiente paso'}
      >
        {isLastStep ? 'Finalizar' : 'Siguiente'}
        {!isLastStep && <ChevronRight className="w-5 h-5 ml-2" />}
      </button>
    </div>
  );
};
