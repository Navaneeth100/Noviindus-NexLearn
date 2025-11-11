export default function Container({children}){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 p-6">
        <div className="hidden md:flex items-center justify-center">
          <div className="card w-full">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.svg" className="w-8 h-8" alt="logo"/>
              <div className="text-2xl font-semibold text-brand">NexLearn</div>
            </div>
            <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop" alt="" className="rounded-xl shadow w-full object-cover h-72"/>
            <div className="mt-6 text-slate-600">Futuristic learning platform with secure OTP login and timed exams.</div>
          </div>
        </div>
        <div className="card">{children}</div>
      </div>
    </div>
  )
}
