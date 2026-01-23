'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PlansPage() {
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: '$1,999',
      description: 'Perfecto para pequeños negocios',
      maxTenants: 1,
      tenantLabel: '1 profesional/sucursal',
      features: [
        '1 Doctor/Barbero/Sucursal',
        '1,000 conversaciones WhatsApp/mes',
        '100 documentos en Knowledge Base',
        'Dashboard multiusuario',
        'Soporte por email',
        'Integración con WhatsApp',
        'Agendado automático 24/7'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$2,999',
      description: 'Ideal para equipos en crecimiento',
      maxTenants: 5,
      tenantLabel: 'Hasta 5 profesionales',
      features: [
        'Hasta 5 Doctores/Barberos/Sucursales',
        '3,000 conversaciones WhatsApp/mes',
        'Documentos ilimitados en KB',
        'Analytics avanzados',
        'Acceso a API',
        'Soporte prioritario',
        'Marca personalizada',
        'Múltiples horarios independientes'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$5,999',
      description: 'Para organizaciones grandes',
      maxTenants: 15,
      tenantLabel: 'Hasta 15 profesionales',
      features: [
        'Hasta 15 Doctores/Barberos/Sucursales',
        'Conversaciones ilimitadas',
        'Solución white-label completa',
        'SLA 99.9% garantizado',
        'Integraciones personalizadas',
        'Gerente de soporte dedicado',
        'Opción on-premise disponible',
        'Configuración multi-sede'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AUTOPILOT
              </span>
            </Link>
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition text-sm"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Elige el Plan Perfecto para tu Negocio
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Sin costos ocultos. Cancela cuando quieras. Prueba gratuita de 14 días.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-slate-900 p-8 rounded-2xl border ${
                  plan.popular
                    ? 'border-purple-500 relative transform scale-105'
                    : 'border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400"> MXN/mes</span>
                  </div>
                  <p className="text-purple-400 text-sm font-semibold">
                    {plan.tenantLabel}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-slate-300">
                      <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={`/onboarding?plan=${plan.id}`}
                  className={`w-full py-3 rounded-lg font-semibold transition inline-block text-center ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                      : 'border border-slate-600 text-white hover:bg-slate-800'
                  }`}
                >
                  Comenzar con {plan.name}
                </Link>

                {/* Trial Notice */}
                {plan.popular && (
                  <p className="text-center text-slate-400 text-xs mt-3">
                    14 días gratis • Sin tarjeta
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Preguntas Frecuentes sobre Planes
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: '¿Puedo cambiar de plan después?',
                  a: 'Sí, puedes hacer upgrade o downgrade en cualquier momento desde tu dashboard. Los cambios se aplican inmediatamente.'
                },
                {
                  q: '¿Qué pasa si supero el límite de tenants?',
                  a: 'El sistema te notificará cuando llegues al límite. Puedes hacer upgrade a un plan superior para agregar más profesionales.'
                },
                {
                  q: '¿Los precios incluyen todos los tenants?',
                  a: 'Sí, el precio es fijo mensual sin importar cuántos tenants uses (dentro del límite de tu plan).'
                },
                {
                  q: '¿Hay descuentos por pago anual?',
                  a: 'Sí, con pago anual obtienes 2 meses gratis (ahorra 16%). Contáctanos para más detalles.'
                }
              ].map((faq, i) => (
                <details
                  key={i}
                  className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer text-white font-semibold hover:bg-slate-700 transition flex justify-between items-center">
                    {faq.q}
                    <span className="text-purple-400 group-open:rotate-180 transition">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-slate-400">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 mb-4">
              ¿Necesitas un plan personalizado para tu organización?
            </p>
            <a
              href="mailto:ventas@autopilot.com"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Contáctanos para planes Enterprise personalizados →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
