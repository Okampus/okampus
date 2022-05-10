export const STARTER = 0
export const DISH = 1
export const DESSERT = 2

export const FOOD_TYPES = {
    [STARTER]: { 'key': 'starters', 'fr': 'Entrée', 'en': 'Starter', frFeminine: true },
    [DISH]: { 'key': 'dishes', 'fr': 'Plat', 'en': 'Dish', frFeminine: false },
    [DESSERT]: { 'key': 'desserts', 'fr': 'Dessert', 'en': 'Dessert', frFeminine: false },
}

export const FOOD_TYPES_KEYS = Object.values(FOOD_TYPES).map((foodType) => foodType.key)
