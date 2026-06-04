"use client";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { useState } from "react";


const footerSections = [
  {
    title: "LOREM",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Retours",
    content:
      "Retour et échange selon les conditions de la boutique.",
  },
  {
    title: "Paiement",
    links: [
      "Carte bancaire",
      "Paiement à la livraison",
      "Paiement sécurisé",
    ],
  },
  {
    title: "Aide",
    content:
      "Notre équipe reste disponible pour répondre à vos questions.",
  },
];

const NewsLetter = () => {
  return (
    <section className="relative overflow-hidden border-t border-white/10">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <Image src="/molina-footer_NL-bg.jpg" alt="" fill priority className="object-cover opacity-80" />
      </div>
      <div className="absolute inset-0 bg-[rgba(17,22,19,0.88)]" />
      <div className=" absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,154,90,0.12),transparent_60%)]" />

      {/* CONTENT */}
      <div className=" relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        {/* LEFT */}
        <div className="max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-(--gold)">
            Newsletter
          </p>
          <h2 className="font-heading text-3xl leading-tight text-(--cream) lg:text-4xl">
            Recevez nos collections et nouveautés exclusives
          </h2>
          <p className="mt-4 text-sm leading-7 text-(--gold) uppercase tracking-[0.15em]">
            Heritage • Precision • Presence
          </p>
        </div>
        {/* RIGHT */}
        <form className=" flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <input type="email" placeholder="Votre adresse email" className="h-12 w-full rounded-full border border-(--gold)/30 bg-white/5 px-6 text-sm text-white outline-none backdrop-blur-md transition-all duration-300 placeholder:text-white/35 focus:border-(--gold) focus:bg-white/10 focus:shadow-[0_0_25px_rgba(184,154,90,0.15)] sm:flex-1" />
          <button type="submit" className=" h-12 w-full shrink-0 rounded-full bg-(--gold) px-8 text-sm font-medium text-black transition-all duration-300 hover:bg-(--gold) hover:shadow-[0_10px_30px_rgba(184,154,90,0.25)] sm:w-auto"  >
            S’abonner
          </button>
        </form>
      </div>
    </section>
  );
};

const FooterLegal = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-sm border border-[--]">
        {/* INNER BLOCK */}
        <div className=" relative overflow-hidden border border-(--gold)/20 bg-black">
          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0">
            <Image src="/image.png" alt="molina legacy patterns" fill priority className=" object-cover opacity-100 scale-105" />
          </div>
          <div className="absolute inset-0 bg-[rgba(61,65,58,0.88)]" />
          <div className=" absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,154,90,0.12),transparent_60%)]" />
          {/* VIGNETTE */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />
          {/* CONTENT */}
          <div className="relative z-10 flex flex-col items-center
                px-4 py-10 text-center sm:px-6 lg:px-10 lg:py-14">
            <div
              className="absolute w-50 h-50 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(184,154,90,0.30) 0%)",
              }}
            />
            {/* LOGO */}
            <div className="relative mb-8 h-32 w-32 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
              <Image src="/molina-logo.png" alt="Molina Legacy" fill priority
                className="object-contain drop-shadow-[0_0_25px_rgba(184,154,90,0.18)]" />
            </div>

            {/* LINKS */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
              <Link href="/mentions-legales" className="text-[10px] uppercase tracking-[0.30em] text-white/65 transition-all duration-300 hover:text-(--gold)">
                Mentions légales
              </Link>
              <span className="hidden text-(--gold) sm:block"> •</span>
              <Link href="/privacy" className="text-[10px] uppercase tracking-[0.30em] text-white/65 transition-all duration-300 hover:text-(--gold)">
                Confidentialité
              </Link>
            </div>
            {/* DECORATION */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px w-10 bg-(--gold)" />
              <div className="h-2 w-2 rotate-45 border border-(--gold)" />
              <div className="h-px w-10 bg-(--gold)" />
            </div>
            <p className=" text-[12px] uppercase  tracking-[0.22em] text-(--gold)">
              © 2026 Molina Legacy. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

function GoldDivider() {
  return (
    <div className="my-1 flex items-center gap-3">
      <div className="h-px flex-1 bg-(--gold)/80" />
      <div className="h-1.25 w-1.25 rotate-45 border border-(--gold)/80" />
      <div className="h-px flex-1 bg-(--gold)/80" />
    </div>
  );
}

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  return (
    <footer className="relative overflow-hidden bg-(--forest) text-(--gold)">
      <NewsLetter />
      {/* Diamond pattern background */}
      <svg className="pointer-events-none absolute inset-0 opacity-[0.06]" width="100%" height="100%">
        <defs>
          <pattern id="diamonds-footer" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="#B89A5A" strokeWidth="0.8" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diamonds-footer)" />
      </svg>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 md:px-8">
        {/* Outer bordered box */}
        <div className="relative border border-(--gold)/50">
          {/* Corner decorations */}
          <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-(--gold)" />
          <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-(--gold)" />
          <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-(--gold)" />
          <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-(--gold)" />


          <div className="hidden md:grid md:grid-cols-4">
            {footerSections.map((section, index) => (
              <div
                key={section.title}
                className={`p-8 ${index !== footerSections.length - 1
                  ? "border-r border-(--gold)/15"
                  : ""
                  }`}
              >
                <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-(--gold)">
                  {section.title}
                </h3>

                <p className="text-xs leading-7 text-(--gold)/65">
                  {section.content}
                </p>
                {section.links && (
                  <ul className="mt-3 space-y-2">
                    {section.links.map((link) => (
                      <li key={link}>
                        <Link href="#" className="text-xs text-(--gold)/65 transition-colors duration-300 hover:text-(--cream)">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="md:hidden">
            {footerSections.map((section) => {
              const isOpen = openSection === section.title;

              return (
                <div
                  key={section.title}
                  className="border-b border-(--gold)/15"
                >
                  <button
                    onClick={() =>
                      setOpenSection(isOpen ? null : section.title)
                    }
                    className="flex w-full items-center justify-between px-6 py-5"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-(--gold)">
                      {section.title}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`transition-all duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ${isOpen
                      ? "max-h-[200px] opacity-100"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <p className="px-6 pb-5 text-xs leading-7 text-(--gold)/65">
                      {section.content}
                    </p>
                    {section.links && (
                      <ul className="space-y-2 px-6 pb-5">
                        {section.links.map((link) => (
                          <li key={link}>
                            <Link href="#" className="text-xs text-(--gold)/65 transition-colors duration-300 hover:text-(--cream)">
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <GoldDivider />

          {/* ── TAGLINE ── */}
          <div className="px-6 py-6 text-center">
            <p className="text-[12px] uppercase tracking-[0.5em] text-(--gold)/80 font-bold flex flex-col md:flex-row items-center justify-center gap-2">
              <span>Heritage</span>
              <span className="text-xl md:text-base leading-none">•</span>
              <span>Precision</span>
              <span className="text-xl md:text-base leading-none">•</span>
              <span>Presence</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}