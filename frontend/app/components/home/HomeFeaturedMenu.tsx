"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { menuCategories } from "@/lib/menu"
import { useTranslation } from "@/contexts/TranslationContext"

const heading = "var(--font-cormorant), Georgia, serif"
const body = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

export function HomeFeaturedMenu() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-[#1C1C1E] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,169,97,0.08),transparent_45%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-xl text-[#C9A961] sm:text-2xl" style={{ fontFamily: script }}>
            From Our Kitchen
          </p>
          <h2
            className="text-3xl font-light tracking-wide text-[#F5F1EA] sm:text-4xl"
            style={{ fontFamily: heading }}
          >
            {t("featuredMenuItems")}
          </h2>
        </motion.div>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menuCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="w-[min(82vw,300px)] shrink-0 snap-center sm:w-[280px]"
            >
              <Link href={`/menu?category=${category.id}`} className="group block">
                <div className="relative min-h-[220px] overflow-hidden rounded-sm border border-[#C9A961]/25 bg-[#252528]">
                  <Image
                    src={category.image}
                    alt={t(category.titleKey)}
                    fill
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="280px"
                  />
                </div>
                <div className="mt-4 px-1">
                  <h3
                    className="mb-1 text-lg text-[#F5F1EA] transition-colors group-hover:text-[#C9A961]"
                    style={{ fontFamily: heading }}
                  >
                    {t(category.titleKey)}
                  </h3>
                  <p
                    className="line-clamp-2 text-sm text-[#F5F1EA]/55"
                    style={{ fontFamily: body }}
                  >
                    {t(category.descriptionKey)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button
            asChild
            className="rounded-none border border-[#C9A961]/60 bg-transparent px-8 py-3 uppercase tracking-wider text-[#F5F1EA] hover:bg-[#C9A961] hover:text-[#1C1C1E]"
            style={{ fontFamily: body }}
          >
            <Link href="/menu">{t("exploreOurMenu")}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
