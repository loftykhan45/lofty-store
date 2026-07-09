import Image from "next/image";

export default function MediaFill({
  image,
  label,
  sizes,
  fit = "cover",
}: {
  image: string;
  label: string;
  sizes?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <Image
      src={image}
      alt={label}
      fill
      sizes={sizes || "(max-width: 480px) 45vw, (max-width: 900px) 33vw, 280px"}
      style={{ objectFit: fit }}
    />
  );
}
