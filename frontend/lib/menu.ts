/** Static menu categories — images served from /public/media/menu/ */
export type MenuCategoryId =
  | "cakes"
  | "sweets"
  | "traditional-sweets"
  | "crepes-waffles"
  | "coffees-juices"

export interface MenuCategory {
  id: MenuCategoryId
  titleKey: string
  descriptionKey: string
  image: string
}

/** Bump when menu PNGs in public/media/menu/ are replaced */
export const MENU_IMAGE_VERSION = "20260604"

const menuImage = (filename: string) => `/media/menu/${filename}?v=${MENU_IMAGE_VERSION}`

export const menuCategories: MenuCategory[] = [
  {
    id: "cakes",
    titleKey: "cakes",
    descriptionKey: "menuCategoryCakesDesc",
    image: menuImage("cakes.png"),
  },
  {
    id: "sweets",
    titleKey: "sweets",
    descriptionKey: "menuCategorySweetsDesc",
    image: menuImage("sweets.png"),
  },
  {
    id: "traditional-sweets",
    titleKey: "menuCategoryTraditionalSweets",
    descriptionKey: "menuCategoryTraditionalSweetsDesc",
    image: menuImage("traditionalsweets.png"),
  },
  {
    id: "crepes-waffles",
    titleKey: "menuCategoryCrepesWaffles",
    descriptionKey: "menuCategoryCrepesWafflesDesc",
    image: menuImage("creepesAndWaffles.png"),
  },
  {
    id: "coffees-juices",
    titleKey: "menuCategoryCoffeesJuices",
    descriptionKey: "menuCategoryCoffeesJuicesDesc",
    image: menuImage("coffesAndJuices.png"),
  },
]

export function getMenuCategory(id: string | null | undefined): MenuCategory {
  return menuCategories.find((c) => c.id === id) ?? menuCategories[0]
}
