import AIAgent from './components/AIAgent';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AUTOPILOT</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition">Funcionalidades</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition">Precios</a>
              <a href="#faq" className="text-slate-300 hover:text-white transition">Preguntas</a>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition">
              Activa tu Autopilot
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Tu Negocio en
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Piloto Automático
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Duerme tranquilo mientras tu IA maneja atención al cliente, citas, ventas y operaciones. 24/7, sin empleados, sin estrés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition transform hover:scale-105">
              Activa tu Autopilot
            </button>
            <button className="border border-slate-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-800 transition">
              Ver Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {[
              { value: "95%", label: "Uptime" },
              { value: "24/7", label: "Operación" },
              { value: "$0", label: "Empleados" },
              { value: "0", label: "Estrés" }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-6 px-4">
        <div className="max-w-xs mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold text-white">
              Demo
            </h2>
          </div>

          <div className="relative rounded overflow-hidden shadow-lg border border-purple-500/30">
            <video
              className="w-full h-auto"
              controls
            >
              <source src="/demo-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tu Negocio Trabaja Por Ti
            </h2>
            <p className="text-xl text-slate-400">Mientras duermes, tu IA trabaja sin parar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Atención al Cliente 24/7",
                description: "Responde en WhatsApp, resuelve dudas, y atiende a tus clientes como si fueras tú, todo el día, todos los días."
              },
              {
                title: "Agendado Automático",
                description: "Tus clientes agendan citas directamente por WhatsApp. Sin llamadas, sin confusiones, sin dobles reservas."
              },
              {
                title: "Ventas y Seguimiento",
                description: "Cierra ventas, da seguimiento a cotizaciones, y recupera carritos abandonados automáticamente."
              },
              {
                title: "Cobranza Inteligente",
                description: "Envía recordatorios de pago, facturas, y hace seguimiento hasta que cobres. Sin pena, sin esfuerzo."
              },
              {
                title: "Multi-Sucursal",
                description: "Gestiona múltiples sucursales, barberos, o consultores desde una sola plataforma."
              },
              {
                title: "100% Seguro",
                description: "Infraestructura de nivel bancario. Tus datos y los de tus clientes siempre protegidos."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition group">
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Activa tu Autopilot en Minutos
            </h2>
            <p className="text-xl text-slate-400">3 pasos y tu negocio opera solo</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"></div>

            {[
              {
                step: "1",
                title: "Conecta WhatsApp",
                description: "Vincula tu número de WhatsApp Business en menos de 2 minutos"
              },
              {
                step: "2",
                title: "Configura tu Negocio",
                description: "Define horarios, servicios, precios y personaliza la IA"
              },
              {
                step: "3",
                title: "Déjalo Trabajar",
                description: "Tu Autopilot está activo. Tus clientes ya pueden agendar 24/7"
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto relative z-10">
                  {step.step}
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Conoce tu Equipo de IA
            </h2>
            <p className="text-xl text-slate-400">
              Agentes especializados listos para trabajar en tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Lupita - Receptionist AI */}
            <AIAgent
              name="Lupita"
              role="Recepcionista Virtual"
              image="/images/agents/lupita.png"
              gradient="from-pink-500 to-purple-600"
              features={[
                "Responde mensajes de WhatsApp 24/7 con tono profesional y amigable",
                "Agenda citas automáticamente verificando disponibilidad en tiempo real",
                "Envía recordatorios de citas por WhatsApp el día anterior",
                "Maneja cancelaciones y reagendados sin intervención humana",
                "Responde preguntas frecuentes sobre servicios y precios",
                "Confirma citas y envía detalles de la reservación",
                "Gestiona múltiples conversaciones simultáneas sin confundirse"
              ]}
            />

            {/* Oscar - Sales Executive */}
            <AIAgent
              name="Oscar"
              role="Ejecutivo de Ventas"
              image="/images/agents/oscar.png"
              gradient="from-blue-500 to-cyan-600"
              features={[
                "Califica leads automáticamente y detecta intención de compra",
                "Envía cotizaciones personalizadas según las necesidades del cliente",
                "Da seguimiento a prospectos hasta cerrar la venta",
                "Recupera carritos abandonados y cotizaciones pendientes",
                "Hace upselling y cross-selling de productos complementarios",
                "Registra toda la información del cliente en el CRM automáticamente",
                "Negocia precios dentro de los márgenes que configures",
                "Cierra ventas 24/7, incluso cuando duermes"
              ]}
            />

            {/* Sofia - Tech Support */}
            <AIAgent
              name="Sofía"
              role="Soporte Técnico"
              image="/images/agents/sofia.png"
              gradient="from-indigo-500 to-purple-600"
              features={[
                "Diagnostica problemas técnicos automáticamente paso a paso",
                "Resuelve incidencias comunes sin intervención humana",
                "Escala tickets críticos al equipo técnico de forma inteligente",
                "Mantiene base de conocimiento actualizada con soluciones",
                "Genera reportes de incidencias y tendencias de problemas",
                "Proporciona tutoriales y guías personalizadas por chat",
                "Programa mantenimientos preventivos y envía notificaciones",
                "Atiende soporte 24/7, incluso fines de semana y festivos"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Precios Simples y Transparentes
            </h2>
            <p className="text-xl text-slate-400">Sin costos ocultos. Cancela cuando quieras.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Básico",
                price: "$1,999",
                description: "Perfecto para pequeños negocios",
                features: [
                  "Hasta 5 colaboradores",
                  "1,000 conversaciones/mes",
                  "100 documentos en Base de Conocimiento",
                  "Dashboard multiusuario",
                  "Soporte por email",
                  "Integración con WhatsApp"
                ]
              },
              {
                name: "Pro",
                price: "$2,999",
                description: "Más popular para equipos en crecimiento",
                features: [
                  "Hasta 15 colaboradores",
                  "3,000 conversaciones/mes",
                  "Documentos ilimitados",
                  "Analytics avanzados",
                  "Acceso a API",
                  "Soporte prioritario",
                  "Marca personalizada"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "$5,999",
                description: "Para organizaciones grandes",
                features: [
                  "Colaboradores ilimitados",
                  "Conversaciones ilimitadas",
                  "Solución white-label",
                  "SLA 99.9%",
                  "Integraciones personalizadas",
                  "Gerente de soporte dedicado",
                  "Opción on-premise"
                ]
              }
            ].map((plan, i) => (
              <div key={i} className={`bg-slate-900 p-8 rounded-2xl border ${plan.popular ? 'border-purple-500 relative' : 'border-slate-700'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400"> MXN/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start text-slate-300">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                    : 'border border-slate-600 text-white hover:bg-slate-800'
                }`}>
                  Comenzar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Qué tan precisa es la IA?",
                a: "Nuestra IA logra más del 95% de precisión, entrenada específicamente para gestión de citas y atención al cliente."
              },
              {
                q: "¿Puede manejar múltiples idiomas?",
                a: "Actualmente está optimizada para español latino, con soporte para otros idiomas próximamente."
              },
              {
                q: "¿Qué pasa si la IA no entiende algo?",
                a: "La IA pedirá amablemente aclaración. También puedes configurar reglas para transferir a un agente humano cuando sea necesario."
              },
              {
                q: "¿Mis datos están seguros?",
                a: "Absolutamente. Usamos infraestructura con encriptación nivel bancario, aislamiento completo de datos por cliente, y cumplimos con GDPR/CCPA."
              },
              {
                q: "¿Puedo personalizar la personalidad de la IA?",
                a: "¡Sí! Puedes ajustar el tono, agregar respuestas personalizadas, y entrenarla con tus servicios y políticas específicas."
              },
              {
                q: "¿Qué incluye la prueba gratuita?",
                a: "Acceso completo a todas las funciones Pro por 14 días, sin tarjeta de crédito requerida."
              }
            ].map((faq, i) => (
              <details key={i} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer text-white font-semibold hover:bg-slate-700 transition flex justify-between items-center">
                  {faq.q}
                  <span className="text-purple-400 group-open:rotate-180 transition">▼</span>
                </summary>
                <div className="px-6 pb-4 text-slate-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo Para Poner tu Negocio en Autopilot?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Únete a cientos de negocios que operan sin empleados y sin estrés
          </p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105">
            Activa tu Autopilot Gratis
          </button>
          <p className="text-slate-400 mt-4 text-sm">Sin tarjeta • Prueba de 14 días • Cancela cuando quieras</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AUTOPILOT</span>
              </div>
              <p className="text-slate-400 text-sm">
                Negocios autónomos powered by AI. Opera sin ti, 24/7.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Precios</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Compañía</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            © 2026 AUTOPILOT. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
