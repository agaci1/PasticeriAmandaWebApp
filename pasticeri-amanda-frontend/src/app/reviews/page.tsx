import Image from "next/image"
import { WavySeparator } from "@/components/wavy-separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function ReviewsPage() {
  const reviews = [
    {
      name: "Princess Amelia",
      rating: 5,
      comment:
        "The 'Golden Raspberry Dream' cake was absolutely divine! It looked like a jewel and tasted even better. Royal Delights truly lives up to its name.",
      date: "July 10, 2024",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Sir Reginald",
      rating: 5,
      comment:
        "Ordered a custom cake for my daughter's birthday, and it was beyond perfect. The attention to detail and the flavor were exceptional. Highly recommend!",
      date: "June 28, 2024",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Lady Isabella",
      rating: 4,
      comment:
        "The macaron tower was a hit at our garden party. Beautifully presented and delicious. A little pricey, but worth it for the quality.",
      date: "June 15, 2024",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Duke Charles",
      rating: 5,
      comment:
        "Their 'Chocolate Decadence' is truly that – pure decadence. A rich, satisfying experience. My new favorite pastry shop.",
      date: "May 30, 2024",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Countess Sophia",
      rating: 5,
      comment:
        "The wedding cake they made for us was breathtaking. It was exactly what we envisioned and tasted incredible. Thank you, Royal Delights!",
      date: "May 12, 2024",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white text-royalPurple">
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=720&width=1280"
          alt="Reviews Hero"
          layout="fill"
          objectFit="cover"
          className="z-0 animate-fade-in-up"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-babyPink/60 to-transparent z-10" />
        <h1 className="relative z-20 font-title text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-slide-in-left text-outline-pink">
          What Our Patrons Say
        </h1>
      </section>

      <WavySeparator color="#F8C8DC" height={80} className="-mt-10 z-30" />

      <section className="py-16 px-4 md:px-6 bg-babyPink">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h2 className="font-title text-4xl md:text-5xl font-bold text-royalPurple animate-fade-in-up">
            Voices of Delight
          </h2>
          <p className="font-body text-lg text-gray-700 animate-fade-in-up delay-100">
            Hear from our cherished customers about their Royal Delights experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {reviews.map((review, index) => (
              <Card
                key={index}
                className={`bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up delay-${200 + index * 100}`}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Image
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover border-2 border-gold"
                  />
                  <div>
                    <CardTitle className="font-title text-xl text-royalBlue">{review.name}</CardTitle>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.rating ? "fill-gold text-gold" : "fill-muted stroke-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="font-body text-gray-800 italic leading-relaxed">&quot;{review.comment}&quot;</p>
                  <p className="text-sm text-gray-500 mt-4 text-right font-body">- {review.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
