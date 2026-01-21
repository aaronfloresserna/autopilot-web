import React from 'react';

interface StepContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  errors?: string[];
}

export const StepContainer: React.FC<StepContainerProps> = ({
  title,
  description,
  children,
  errors = []
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Por favor corrige los siguientes errores:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
};
