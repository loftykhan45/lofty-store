import Image from "next/image";

export default function MediaFill({ image, label, sizes }: { image: string; label: string; sizes?: string }) {
  return (
    <Image
      src={image}
      alt={label}
      fill
      sizes={sizes || "(max-width: 480px) 45vw, (max-width: 900px) 33vw, 280px"}
      style={{ objectFit: "cover" }}
    />
  );
}
