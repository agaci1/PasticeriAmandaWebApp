import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  name: string
  description: string
  imageUrl: string | null // Changed from imageSrc
  price?: string
  className?: string
}

export function ProductCard({ name, description, imageUrl, price, className }: ProductCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up",
        className,
      )}
    >
      <div className="relative w-full h-48">
        <Image
          src={imageUrl || "/placeholder.svg"} // Use imageUrl
          alt={name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="font-title text-xl text-royalPurple">{name}</CardTitle>
        <CardDescription className="font-body text-sm text-gray-600">{description}</CardDescription>
      </CardHeader>
      {price && (
        <CardContent className="p-4 pt-0">
          <p className="font-semibold text-lg text-gold">{price}</p>
        </CardContent>
      )}
    </Card>
  )
}
