import { HealthIndicator } from "@/components/HealthIndicator"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Red Bubble Background */}
      <div className="absolute top-20 right-16 w-96 h-96 bg-gradient-to-br from-red-500 via-pink-500 to-red-600 rounded-full opacity-20 blur-3xl cursor-pointer hover:cursor-crosshair" 
           style={{
             animation: 'pulse 2s infinite',
             transform: 'translateX(0px) translateY(0px)',
             animationName: 'pulse, sway',
             animationDuration: '2s, 4s',
             animationIterationCount: 'infinite, infinite',
             animationTimingFunction: 'ease-in-out, ease-in-out'
           }}></div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes sway {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            25% { transform: translateX(15px) translateY(-10px); }
            50% { transform: translateX(-10px) translateY(5px); }
            75% { transform: translateX(20px) translateY(-15px); }
          }
        `
      }} />
      
      {/* Header */}
      <header className="border-b border-gray-700 relative z-10">
        <div className="py-4 px-6">
          <h1 className="text-base font-semibold">
            <span className="text-yellow-400" style={{
              textShadow: '0 0 10px #facc15, 0 0 20px #facc15, 0 0 30px #facc15',
              filter: 'drop-shadow(0 0 8px #facc15)'
            }}>Your</span>
            <span className="text-yellow-300 font-normal" style={{
              textShadow: '0 0 10px #fde047, 0 0 20px #fde047, 0 0 30px #fde047',
              filter: 'drop-shadow(0 0 8px #fde047)'
            }}>Project</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 relative z-10">
        <div className="flex flex-col items-center max-w-xs w-full">
          {/* Welcome Section */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 leading-tight">
              Welcome to your <span className="underline">new web app</span>!
            </h2>
            <p className="text-base text-gray-400 dark:text-gray-500 leading-snug">
              Your web app is ready to launch. Start building amazing experiences.
            </p>
          </div>

          {/* Health Indicator */}
          <HealthIndicator />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 relative z-10">
        <div className="text-center">
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Your Project © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  )
}