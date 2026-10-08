import Image from "next/image";
import Link from "next/link";
import { Clock, CreditCard, Lock, Mail, MapPin, Phone } from "lucide-react";

import CustomOrderTrigger from "@/components/shop/CustomOrderTrigger";
import { MaskIcon } from "@/components/ui/mask-icon";
import { NAV_LINKS, SITE } from "@/lib/site";

const SOCIALS = [
    { label: "Instagram", href: SITE.social.instagram, icon: "/icons/instagram.svg" },
    { label: "Facebook", href: SITE.social.facebook, icon: "/icons/facebook.svg" },
    { label: "WhatsApp", href: SITE.social.whatsapp, icon: "/icons/whatsapp.svg" },
].filter((s) => s.href);

const linkClass = "text-sm font-medium underline underline-offset-4 transition-colors hover:text-primary dark:hover:text-secondary";
const iconClass = "size-5 shrink-0 text-primary dark:text-secondary";

export default function Footer() {
    return (
        <footer className="rounded-t-md border border-b-0 border-border bg-card text-foreground">
            <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-10 md:grid-cols-[1fr_1fr_1fr_1.3fr] md:items-center">
                {/* Logo */}
                <Link href="/" aria-label="Artelier — inicio" className="w-fit">
                    <Image
                        src="/images/logo-vertical.svg"
                        alt="Artelier"
                        width={152}
                        height={140}
                        className="h-36 w-auto dark:hidden"
                    />
                    <Image
                        src="/images/logo-vertical-negativo.svg"
                        alt="Artelier"
                        width={152}
                        height={140}
                        className="hidden h-36 w-auto dark:block"
                    />
                </Link>

                {/* Frase + redes */}
                <div className="flex max-w-60 flex-col gap-4">
                    <p className="text-sm font-medium">“{SITE.tagline}”</p>
                    <ul className="flex items-center gap-5">
                        {SOCIALS.map((s) => (
                            <li key={s.label}>
                                <a
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="block transition-opacity hover:opacity-70"
                                >
                                    <MaskIcon src={s.icon} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Explorar */}
                <div>
                    <h2 className="mb-4 font-heading text-3xl font-medium">Explorar</h2>
                    <ul className="flex flex-col gap-3">
                        {NAV_LINKS.map((item) => (
                            <li key={item.label}>
                                {item.href ? (
                                    <Link href={item.href} className={linkClass}>
                                        {item.label}
                                    </Link>
                                ) : (
                                    <CustomOrderTrigger className={linkClass}>{item.label}</CustomOrderTrigger>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contacto */}
                <div>
                    <h2 className="mb-4 font-heading text-3xl font-medium">Contacto</h2>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li className="flex items-center gap-3">
                            <Mail className={iconClass} />
                            <a href={`mailto:${SITE.email}`} className="hover:underline">
                                {SITE.email}
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className={iconClass} />
                            <a href={`tel:+${SITE.phoneDigits}`} className="hover:underline">
                                {SITE.phone}
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className={iconClass} />
                            <span>{SITE.location}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Clock className={iconClass} />
                            <span>
                                {SITE.hours.map((h) => (
                                    <span key={h} className="block">
                                        {h}
                                    </span>
                                ))}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Franja inferior */}
            <div className="mx-auto flex max-w-[1440px] flex-col gap-5 border-t border-border px-6 py-5 text-xs md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-sm">Método de pago</span>
                    <div className="flex items-center gap-4">
                        <Image src="/icons/nequi.png" alt="Nequi" width={24} height={24} className="size-6 object-contain" />
                        <Image src="/icons/pse.png" alt="PSE" width={24} height={24} className="size-6 object-contain" />
                        <CreditCard aria-label="Tarjeta" className="size-6" />
                    </div>
                </div>

                <p className="md:max-w-60">
                    © {new Date().getFullYear()} Artelier. Todos los derechos reservados.
                    <br />
                    Diseñado y desarrollado por {SITE.credit}.
                </p>

                <div className="flex items-center gap-4 md:border-l md:border-border md:pl-6">
                    <p>
                        Sitio seguro
                        <br />
                        Tus datos están protegidos
                    </p>
                    <Lock aria-hidden className="size-4" />
                </div>
            </div>
        </footer>
    );
}
