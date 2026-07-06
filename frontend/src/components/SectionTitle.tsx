interface SectionTitleProps {
  title: string;
  description?: string;
}

export function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <div className="min-w-0">
      <h2 className="text-lg font-semibold leading-7 text-slate-950 sm:text-xl">{title}</h2>
      {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
  );
}
