"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"
import { useToast } from "@/hooks/use-toast"

const fieldClass = "luxury-input w-full"
const MAPS_URL = "https://www.google.com/maps/search/Pasticeri+Amanda+Saranda+Albania"
const PHONE = "+355693520462"
const WHATSAPP_NUMBER = "355693520462"
const EMAIL = "pasticeriamanda@gmail.com"

export default function ContactPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name")?.toString().trim() || ""
    const phone = formData.get("phone")?.toString().trim() || ""
    const email = formData.get("email")?.toString().trim() || ""
    const message = formData.get("message")?.toString().trim() || ""

    const whatsappText = [
      t("contactWhatsAppGreeting"),
      "",
      `${t("contactFormName")}: ${name}`,
      `${t("phoneNumber")}: ${phone}`,
      `${t("email")}: ${email}`,
      "",
      `${t("contactFormMessage")}:`,
      message,
    ].join("\n")

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`, "_blank", "noopener,noreferrer")

    toast({
      title: t("contactFormSent"),
      description: t("contactFormSentMessage"),
    })

    event.currentTarget.reset()
    setLoading(false)
  }

  const infoItems = [
    {
      icon: MapPin,
      title: t("visitUs"),
      content: t("locatedIn"),
      href: MAPS_URL,
      external: true,
    },
    {
      icon: Phone,
      title: t("callUs"),
      content: "+355 69 352 0462",
      href: `tel:${PHONE}`,
    },
    {
      icon: Mail,
      title: t("writeUs"),
      content: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      icon: Clock,
      title: t("hoursLabel"),
      content: t("hours"),
    },
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-cream">
      <div className="pointer-events-none absolute inset-0 vintage-paper opacity-70" />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <header className="mb-10 text-center md:mb-14">
          <p className="mb-2 font-script text-xl text-antique-gold md:text-2xl">Pastiçeri Amanda</p>
          <h1 className="font-display text-4xl font-light text-charcoal md:text-5xl">{t("contactUs")}</h1>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-antique-gold to-transparent" />
          <p className="mx-auto mt-6 max-w-2xl font-serif text-base leading-relaxed text-charcoal/75 md:text-lg">
            {t("contactPageSubtitle")}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div className="space-y-4">
            {infoItems.map((item) => (
              <div key={item.title} className="luxury-panel p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-antique-gold/30 bg-antique-gold/10">
                    <item.icon className="h-5 w-5 text-antique-gold-dark" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-antique-gold-dark">
                      {item.title}
                    </h2>
                    {item.href ? (
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="mt-1 block font-serif text-base text-charcoal/80 transition-colors hover:text-antique-gold"
                      >
                        {item.content}
                      </Link>
                    ) : (
                      <p className="mt-1 font-serif text-base text-charcoal/80">{item.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="luxury-panel p-5 md:p-6">
              <h2 className="mb-4 font-serif text-sm uppercase tracking-[0.2em] text-antique-gold-dark">
                {t("followUs")}
              </h2>
              <div className="flex gap-4">
                <Link
                  href="https://www.instagram.com/pasticeri_amanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-antique-gold/30 text-charcoal/70 transition-all hover:border-antique-gold hover:text-antique-gold"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.facebook.com/pasticeri_amanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-antique-gold/30 text-charcoal/70 transition-all hover:border-antique-gold hover:text-antique-gold"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="luxury-panel p-6 md:p-8">
            <div className="mb-8 border-b border-antique-gold/20 pb-6">
              <h2 className="font-display text-2xl font-light text-charcoal md:text-3xl">{t("getInTouch")}</h2>
              <p className="mt-2 font-serif text-sm text-charcoal/60 md:text-base">{t("contactFormHint")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="contactName" className="luxury-label">
                  {t("contactFormName")}
                </Label>
                <Input id="contactName" name="name" required className={fieldClass} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactPhone" className="luxury-label">
                  {t("phoneNumber")}
                </Label>
                <Input
                  id="contactPhone"
                  name="phone"
                  type="tel"
                  placeholder="+355 69 123 4567"
                  required
                  className={fieldClass}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactEmail" className="luxury-label">
                  {t("email")}
                </Label>
                <Input id="contactEmail" name="email" type="email" required className={fieldClass} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactMessage" className="luxury-label">
                  {t("contactFormMessage")}
                </Label>
                <Textarea
                  id="contactMessage"
                  name="message"
                  rows={5}
                  required
                  className={`${fieldClass} min-h-[140px] resize-y`}
                />
              </div>

              <Button type="submit" disabled={loading} className="btn-luxury w-full">
                {loading ? t("processing") : t("sendWhatsAppMessage")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
