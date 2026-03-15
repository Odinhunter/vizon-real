export default function SectionLabel({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6 md:mb-10">
      <span className={`w-2 h-2 rounded-full shrink-0 ${dark ? 'bg-[#6391ff]' : 'bg-[#1A56DB]'}`} />
      <p className={`text-[12px] font-mono font-medium uppercase tracking-[0.2em] shrink-0 ${dark ? 'text-[#6391ff]' : 'text-[#1A56DB]'}`}>
        {label}
      </p>
      <span className={`flex-1 h-px bg-gradient-to-r to-transparent ${dark ? 'from-[#6391ff]/30' : 'from-[#1A56DB]/20'}`} />
    </div>
  );
}
