export default function Footer() {
  return (
    <footer className="bg-[#1A56DB]">
      <div className="w-full px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white/70 inline-block" />
          <span className="font-mono text-[12px] font-medium tracking-[0.2em] text-white">VIZON</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[13px] text-white/60 hover:text-white transition-colors cursor-pointer">Privacy</span>
          <span className="text-[13px] text-white/60 hover:text-white transition-colors cursor-pointer">Terms</span>
        </div>
        <span className="text-[13px] text-white/40">&copy; 2026 Vizon</span>
      </div>
    </footer>
  );
}
