type SectionPlaceholderProps = {
  id: string;
  title: string;
  note: string;
};

export function SectionPlaceholder({
  id,
  title,
  note,
}: SectionPlaceholderProps) {
  return (
    <section
      id={id}
      className="border-t border-neutral-300 py-8 dark:border-neutral-700"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm">{note}</p>
    </section>
  );
}
