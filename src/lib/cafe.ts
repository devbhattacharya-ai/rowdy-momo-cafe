export const CAFE = {
  name: "Rowdy Momo Cafe",
  phoneDisplay: "+91 90000 11220",
  phoneWa: "919000011220",
  street: "Shop 7, Waroda Road",
  area: "Bandra West, Mumbai 400050",
  hours: "Daily, 12:00 – 00:30",
  instagram: "rowdymomocafe",
  maps: "https://www.google.com/maps/search/?api=1&query=Waroda+Road+Bandra+West+Mumbai",
};

export function waLink(text: string) {
  return `https://wa.me/${CAFE.phoneWa}?text=${encodeURIComponent(text)}`;
}

export const ORDER_BLURB =
  "I'd like to order from Rowdy Momo Cafe, Bandra West.";

export type Cook =
  | "steam"
  | "kothey"
  | "fried"
  | "jhol"
  | "chilli"
  | "tandoor"
  | "plate"
  | "cold";

export type CookFilter = "all" | Cook;

export const FILTERS: { id: CookFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "steam", label: "Steam" },
  { id: "kothey", label: "Kothey" },
  { id: "fried", label: "Fried" },
  { id: "jhol", label: "Jhol" },
  { id: "chilli", label: "Chilli" },
  { id: "tandoor", label: "Tandoor" },
  { id: "plate", label: "Plates" },
  { id: "cold", label: "Cold" },
];

const COOKS = new Set<string>(FILTERS.map((item) => item.id));

export function parseCook(value: unknown): CookFilter {
  return typeof value === "string" && COOKS.has(value) ? (value as CookFilter) : "all";
}

export type Plate = {
  id: string;
  name: string;
  cook: Cook;
  price: number;
  serves: string;
  note: string;
  image: string;
};

export const MENU: Plate[] = [
  {
    id: "steam-chicken",
    name: "Steam Chicken",
    cook: "steam",
    price: 199,
    serves: "8 pieces",
    note: "Thin wrapper, tight pleat, ginger and garlic. Sesame chilli on the side.",
    image: "/food/steam.jpg",
  },
  {
    id: "steam-veg",
    name: "Steam Veg",
    cook: "steam",
    price: 179,
    serves: "8 pieces",
    note: "Cabbage, carrot, and ginger. Same tight pleat, no meat.",
    image: "/food/steam-veg.jpg",
  },
  {
    id: "steam-paneer",
    name: "Paneer Steam",
    cook: "steam",
    price: 219,
    serves: "8 pieces",
    note: "Paneer and spinach, black pepper, chilli on the side.",
    image: "/food/paneer.jpg",
  },
  {
    id: "cheese-momo",
    name: "Cheese Momo",
    cook: "steam",
    price: 239,
    serves: "8 pieces",
    note: "A molten center. Eat it before it sets.",
    image: "/food/cheese.jpg",
  },
  {
    id: "kothey-chicken",
    name: "Kothey Chicken",
    cook: "kothey",
    price: 229,
    serves: "8 pieces",
    note: "One face seared gold, the other still pale. Chilli-garlic dip.",
    image: "/food/kothey.jpg",
  },
  {
    id: "fry-basket",
    name: "Fry Basket",
    cook: "fried",
    price: 249,
    serves: "8 pieces",
    note: "Blistered crust, schezwan dust, eaten before it cools.",
    image: "/food/fried.jpg",
  },
  {
    id: "jhol-chicken",
    name: "Jhol Chicken",
    cook: "jhol",
    price: 279,
    serves: "6 pieces",
    note: "Tomato-sesame broth, achar oil on top, cilantro at the end.",
    image: "/food/jhol.jpg",
  },
  {
    id: "jhol-veg",
    name: "Jhol Veg",
    cook: "jhol",
    price: 249,
    serves: "6 pieces",
    note: "The same tomato-sesame broth, vegetable filling underneath.",
    image: "/food/jhol-veg.jpg",
  },
  {
    id: "chilli-momo",
    name: "Chilli Momo",
    cook: "chilli",
    price: 269,
    serves: "8 pieces",
    note: "Wok-tossed with onion petals, capsicum, and a sticky red glaze.",
    image: "/food/chilli.jpg",
  },
  {
    id: "tandoori-momo",
    name: "Tandoori Momo",
    cook: "tandoor",
    price: 289,
    serves: "8 pieces",
    note: "Hung yogurt, charcoal spots, mint on a black stone.",
    image: "/food/tandoor.jpg",
  },
  {
    id: "rowdy-smash",
    name: "Rowdy Smash",
    cook: "plate",
    price: 329,
    serves: "one burger",
    note: "Double smash, chilli mayo, pickle. Loud on purpose.",
    image: "/food/burger.jpg",
  },
  {
    id: "rowdy-pie",
    name: "Rowdy Pie",
    cook: "plate",
    price: 449,
    serves: "10 inch",
    note: "Blistered crust, melted cheese, chilli oil, charred onion.",
    image: "/food/pizza.jpg",
  },
  {
    id: "salted-fries",
    name: "Salted Fries",
    cook: "plate",
    price: 149,
    serves: "one basket",
    note: "Thin, crisp, with a cup of chilli salt.",
    image: "/food/fries.jpg",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    cook: "cold",
    price: 179,
    serves: "tall glass",
    note: "Thick. No melted ice. The spoon is supposed to stand.",
    image: "/food/coffee.jpg",
  },
  {
    id: "cocoa-shake",
    name: "Cocoa Shake",
    cook: "cold",
    price: 199,
    serves: "tall glass",
    note: "Thick cocoa, no ice melt. Dusted on top.",
    image: "/food/cocoa.jpg",
  },
];

export function inr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function momos() {
  return MENU.filter((item) => item.cook !== "plate" && item.cook !== "cold");
}

export function plates() {
  return MENU.filter((item) => item.cook === "plate");
}

export function colds() {
  return MENU.filter((item) => item.cook === "cold");
}

export function byCook(cook: CookFilter) {
  return cook === "all" ? MENU : MENU.filter((item) => item.cook === cook);
}

export const BANDS = [
  { id: "momo" as const, label: "Momo", count: () => momos().length, cook: "all" as CookFilter },
  { id: "plate" as const, label: "Plates", count: () => plates().length, cook: "plate" as CookFilter },
  { id: "cold" as const, label: "Cold", count: () => colds().length, cook: "cold" as CookFilter },
];

export const CHAPTERS = [
  {
    kicker: "01 — The pleat",
    title: "Eight folds. No whisper.",
    body: "The dumpling is Nepali. A thin wheat wrapper, a tight crown, chicken with ginger and garlic. Bandra did not invent the fold. It only turned the volume up.",
    image: "/food/steam.jpg",
    alt: "Steamed chicken momos on a steel plate",
    mask: "mask-a",
  },
  {
    kicker: "02 — The broth",
    title: "Jhol is the loud quiet one.",
    body: "Steam first, then a tomato-sesame broth that stains the spoon. Achar oil sits on top like a signature. This is the plate people come back for when the fry basket is gone.",
    image: "/food/jhol.jpg",
    alt: "Jhol momos in tomato sesame broth",
    mask: "mask-c",
  },
  {
    kicker: "03 — The rest of the table",
    title: "Stay for the excuse.",
    body: "A smash burger, a chilli-oil pie, a basket of fries, and a cold coffee thick enough to hold a spoon upright. The momo is the reason. Everything else is why the table does not clear.",
    image: "/food/pizza.jpg",
    alt: "Chilli oil pizza with a blistered crust",
    mask: "mask-b",
  },
];
