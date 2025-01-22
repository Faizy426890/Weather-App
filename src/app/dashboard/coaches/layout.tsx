export default function CoachesLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-blue-950 to-slate-900">
        {children}
      </div>
    )
  }
  
  