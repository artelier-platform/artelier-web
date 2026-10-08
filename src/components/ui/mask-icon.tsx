import { cn } from "@/lib/utils"

/**
 * Pinta un SVG de un solo color con el color del texto actual (currentColor).
 * Sirve para los íconos de marca (instagram, facebook, whatsapp) en claro y oscuro.
 */
export function MaskIcon({ src, className }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-6 shrink-0 bg-current", className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  )
}
