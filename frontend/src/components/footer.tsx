import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-babyPink text-royalPurple py-8 px-4 md:px-6 border-t border-gold">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link
            href="/"
            className="flex items-center gap-2 font-title text-2xl font-bold text-royalPurple hover:text-gold transition-colors"
            prefetch={false}
          >
            Amanda Pastry Shop
          </Link>
          <p className="mt-2 text-sm font-body">Where every dessert is a masterpiece.</p>
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <h3 className="font-semibold text-lg text-royalBlue">Contact Us</h3>
            <p className="text-sm font-body">Email: pasticeriamanda@gmail.com</p>
            <p className="text-sm font-body">Phone: +355 69 352 0462</p>
            <p className="text-sm font-body">Address: Rruga Lefter Talo, Saranda, Albania</p>
          </div>
        </div>
        <nav className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <h3 className="font-semibold text-lg text-royalBlue">Quick Links</h3>
          <Link href="/about" className="text-sm hover:text-gold transition-colors" prefetch={false}>
            About Us
          </Link>
          <Link href="/menu" className="text-sm hover:text-gold transition-colors" prefetch={false}>
            Menu
          </Link>
          <Link href="/order" className="text-sm hover:text-gold transition-colors" prefetch={false}>
            Order
          </Link>
          <Link href="/contact" className="text-sm hover:text-gold transition-colors" prefetch={false}>
            Contact
          </Link>
        </nav>
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <h3 className="font-semibold text-lg text-royalBlue">Connect With Us</h3>
          <div className="flex gap-4 mt-2">
            <Link
              href="#"
              className="text-royalPurple hover:text-gold transition-colors"
              aria-label="Facebook"
              prefetch={false}
            >
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-royalPurple hover:text-gold transition-colors"
              aria-label="Instagram"
              prefetch={false}
            >
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-royalPurple hover:text-gold transition-colors"
              aria-label="Twitter"
              prefetch={false}
            >
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
          <p className="mt-4 text-sm font-body">
            © {new Date().getFullYear()} Amanda Pastry Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
