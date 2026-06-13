/** Centralized media paths — all assets live under /media/ */
export const media = {
  branding: {
    logo: "/media/branding/logoAmanda.png",
    logoNoBackground: "/media/branding/logo-no-background.png",
  },
  cakes: {
    hero: "/media/cakes/cakes-hero.webp",
    thumb: "/media/cakes/cakes-thumb.webp",
    gallery: Array.from({ length: 16 }, (_, i) =>
      `/media/cakes/cake-${String(i + 1).padStart(2, "0")}.jpg`
    ),
  },
  pastries: {
    donuts: "/media/pastries/donuts.jpg",
    cookies: "/media/pastries/cookies.jpeg",
    cupcakes: "/media/pastries/cupcakes.jpg",
    sweets: "/media/pastries/sweets.jpg",
    tarts: "/media/pastries/tarts.webp",
    rafaello: "/media/pastries/rafaello.jpg",
    dubaiChocolate: "/media/pastries/dubai-chocolate.jpg",
  },
  traditional: {
    hero: "/media/traditional/baklava-hero.jpeg",
    baklava: "/media/traditional/baklava.jpg",
  },
  team: {
    amanda: "/media/team/amanda.jpg",
  },
  about: {
    gallery: [
      ...Array.from({ length: 6 }, (_, i) =>
        `/media/about/gallery-${String(i + 1).padStart(2, "0")}.png`
      ),
      "/media/about/gallery-07.jpg",
      "/media/about/gallery-08.jpg",
    ],
  },
  videos: {
    hero: "/media/videos/promo-0603.mp4",
    heroMobile: "/media/videos/main123-vid.mp4",
    logo: "/media/videos/what-we-do.mp4",
    birthdayCakeTogether: "/media/videos/birthday-cake-together.mp4",
    whatWeDo: "/media/videos/what-we-do.mp4",
    mainShowcase: "/media/videos/main-showcase.mp4",
    creation01: "/media/videos/creation-01.mov",
    creation02: "/media/videos/creation-02.mov",
    creation03: "/media/videos/creation-03.mov",
    promo0603: "/media/videos/promo-0603.mp4",
    promoDesign: "/media/videos/promo-design.mp4",
  },
  misc: {
    placeholder: "/media/misc/placeholder.svg",
    placeholderUser: "/media/misc/placeholder-user.jpg",
  },
  menu: {
    cakes: `/media/menu/cakes.png?v=20260604`,
    sweets: `/media/menu/sweets.png?v=20260604`,
    traditionalSweets: `/media/menu/traditionalsweets.png?v=20260604`,
    crepesAndWaffles: `/media/menu/creepesAndWaffles.png?v=20260604`,
    coffeesAndJuices: `/media/menu/coffesAndJuices.png?v=20260604`,
  },
} as const

export const offerItems = [
  {
    id: "cakes",
    title: "Cakes",
    shortDescription: "Custom celebration cakes and elegant everyday treats.",
    fullDescription: "From wedding masterpieces to birthday showstoppers — each cake is designed and decorated by hand using the finest ingredients. Tell us your vision and we bring it to life.",
    image: "/media/cakes/cakes-hero.webp",
  },
  {
    id: "sweets",
    title: "Sweets & Pastries",
    shortDescription: "Artisan pastries, tarts, and traditional Albanian delights.",
    fullDescription: "Our display case is filled daily with fresh baklava, eclairs, fruit tarts, and seasonal specialties — perfect for gifting or indulging.",
    image: "/media/pastries/sweets.jpg",
  },
  {
    id: "coffee",
    title: "Coffee",
    shortDescription: "Rich espresso and specialty coffee, served with care.",
    fullDescription: "Start your morning or pause your afternoon with a perfectly pulled espresso, cappuccino, or latte — the ideal companion to any of our pastries.",
    image: "/media/pastries/donuts.jpg",
  },
  {
    id: "crepes",
    title: "Crêpes",
    shortDescription: "Delicate crêpes with sweet or savory fillings.",
    fullDescription: "Light, golden crêpes folded with Nutella, fresh fruit, cream, or your favourite combination — made to order and served warm.",
    image: "/media/pastries/tarts.webp",
  },
  {
    id: "waffles",
    title: "Waffles",
    shortDescription: "Crispy Belgian waffles with premium toppings.",
    fullDescription: "Golden, airy waffles topped with chocolate, fruit, ice cream, or classic combinations — a luxurious treat any time of day.",
    image: "/media/pastries/cupcakes.jpg",
  },
  {
    id: "juice",
    title: "Fresh Juice",
    shortDescription: "Cold-pressed juices from seasonal fruits.",
    fullDescription: "Vibrant, refreshing juices made from the freshest seasonal fruits — a natural, energising complement to our sweet menu.",
    image: "/media/pastries/cookies.jpeg",
  },
  {
    id: "smoothie",
    title: "Smoothies",
    shortDescription: "Creamy blended smoothies packed with flavour.",
    fullDescription: "Thick, satisfying smoothies blended with fresh fruit, yogurt, and natural ingredients — healthy, delicious, and made just for you.",
    image: "/media/pastries/rafaello.jpg",
  },
  {
    id: "icecream",
    title: "Ice Cream",
    shortDescription: "Creamy gelato and ice cream in classic and modern flavours.",
    fullDescription: "Cool, velvety ice cream and gelato scoops — perfect on their own, in a cone, or paired with our warm waffles and crêpes.",
    image: "/media/pastries/dubai-chocolate.jpg",
  },
] as const
