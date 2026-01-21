interface AIAgentProps {
  name: string;
  role: string;
  image?: string;
  features: string[];
  gradient: string;
}

export default function AIAgent({ name, role, image, features, gradient }: AIAgentProps) {
  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-purple-500/50 transition">
      <div className="flex flex-col items-center mb-6">
        {/* Profile Image Bubble */}
        {image ? (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 mb-4">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 20%' }}
            />
          </div>
        ) : (
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-4xl font-bold border-4 border-purple-500/30 mb-4`}>
            {name.charAt(0)}
          </div>
        )}

        {/* Name and Role */}
        <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
        <p className="text-purple-400 font-semibold">{role}</p>
      </div>

      {/* Features List */}
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-300 flex-1">{feature}</p>
          </div>
        ))}
      </div>

      {/* Status Badge */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Disponible 24/7</span>
        </div>
      </div>
    </div>
  );
}
