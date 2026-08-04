/* eslint-disable @next/next/no-img-element */
type Props = {
  src: string;
  alt: string;
  className?: string;
  framed?: boolean;
};

export default function ArchImage({ src, alt, className = "", framed = true }: Props) {
  return (
    <div
      className={`overflow-hidden rounded-t-full ${
        framed ? "border border-champagne/60 p-2" : ""
      } ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-t-full object-cover"
      />
    </div>
  );
}
