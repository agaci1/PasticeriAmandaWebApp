"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { menuCategories, getMenuCategory, type MenuCategoryId } from "@/lib/menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function MenuContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category")
  const [activeId, setActiveId] = useState<MenuCategoryId>(getMenuCategory(categoryParam).id)

  useEffect(() => {
    const next = getMenuCategory(categoryParam)
    setActiveId(next.id)
  }, [categoryParam])

  const active = getMenuCategory(activeId)

  const selectCategory = useCallback(
    (id: MenuCategoryId) => {
      setActiveId(id)
      router.replace(`/menu?category=${id}`, { scroll: false })
    },
    [router]
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        {/* Main panel: photo left, title + description right */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative flex items-center justify-center pb-10">
            <div
              key={activeId}
              className={cn(
                "menu-card-3d relative w-full max-w-[min(100%,540px)]",
                "shadow-[0_16px_40px_-12px_rgba(28,28,30,0.32),0_6px_20px_-6px_rgba(201,169,97,0.22)]",
                "hover:shadow-[0_28px_56px_-10px_rgba(28,28,30,0.38),0_12px_32px_-8px_rgba(201,169,97,0.3)]"
              )}
            >
              <Image
                key={active.image}
                src={active.image}
                alt={t(active.titleKey)}
                width={900}
                height={1200}
                className="h-auto w-full transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-2 left-1/2 h-6 w-[72%] max-w-md -translate-x-1/2 rounded-[100%] bg-charcoal/20 blur-2xl"
            />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="mb-2 font-script text-xl text-antique-gold md:text-2xl">Pastiçeri Amanda</p>
              <h1 className="font-display text-4xl font-light text-charcoal md:text-5xl lg:text-6xl">
                {t(active.titleKey)}
              </h1>
              <div className="mt-6 h-px w-16 bg-gradient-to-r from-antique-gold to-transparent" />
            </div>

            <p className="font-serif text-lg leading-relaxed text-charcoal/80 md:text-xl">
              {t(active.descriptionKey)}
            </p>

            <p className="font-serif text-sm leading-relaxed text-charcoal/55 md:text-base">
              {t("menuBrowseDescription")}
            </p>

            <Button asChild className="btn-luxury w-fit">
              <Link href="/order">{t("menuOrderCustomCta")}</Link>
            </Button>
          </div>
        </div>

        {/* Category titles below */}
        <div className="mt-16 border-t border-antique-gold/25 pt-10">
          <p className="mb-6 text-center font-serif text-sm uppercase tracking-[0.25em] text-charcoal/50">
            {t("ourDeliciousMenu")}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {menuCategories.map((category) => {
              const isActive = category.id === activeId
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={cn(
                    "border px-5 py-3 font-serif text-sm uppercase tracking-wider transition-all duration-300 md:px-7 md:text-base",
                    isActive
                      ? "border-antique-gold bg-charcoal text-cream shadow-gold"
                      : "border-antique-gold/30 bg-cream text-charcoal hover:border-antique-gold hover:bg-antique-gold/10"
                  )}
                >
                  {t(category.titleKey)}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cream font-serif text-charcoal/60">
          Loading…
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  )
}
