import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-purple-900 to-black flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white">
          Card<span className="text-purple-400">Value</span>
        </h1>
        <p className="text-xl text-purple-200 max-w-md mx-auto">
          TCG Collection Visualizer - Track your card collection with style
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
        >
          Enter Dashboard
          <span className="text-xl">→</span>
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl">
        {[
          { icon: "📊", title: "Value Tracking", desc: "Monitor collection worth" },
          { icon: "📈", title: "Trend Analysis", desc: "See value over time" },
          { icon: "🎴", title: "TCG Distribution", desc: "Visual breakdown by game" },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
          >
            <span className="text-3xl">{feature.icon}</span>
            <h3 className="text-white font-medium mt-2">{feature.title}</h3>
            <p className="text-purple-300/70 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
