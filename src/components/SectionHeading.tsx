type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
};

export default function SectionHeading({ eyebrow, title, subtitle, as = "h2" }: Props) {
  const Tag = as;
  return (
    <div className="text-center">
      {eyebrow && (
        <p className="mb-2 font-script text-3xl text-sage-deep md:text-4xl">{eyebrow}</p>
      )}
      <Tag className="font-display text-4xl font-light uppercase tracking-[0.22em] md:text-5xl">
        {title}
      </Tag>
      <span className="mx-auto mt-6 block h-px w-16 bg-champagne" />
      {subtitle && (
        <p className="mx-auto mt-6 max-w-xl text-balance text-taupe">{subtitle}</p>
      )}
    </div>
  );
}
