export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Ofiyat Kolbasa",
    price: 45000,
    category: "Kolbasa",
    stock: 50,
    image: "/products/kolbasa.jpg",
  },
  {
    id: "2",
    name: "Ofiyat Sosiska",
    price: 38000,
    category: "Sosiska",
    stock: 50,
    image: "/products/sosiska.jpg",
  },
  {
    id: "3",
    name: "Maxsus Kolbasa",
    price: 55000,
    category: "Kolbasa",
    stock: 50,
    image: "/products/maxsus-kolbasa.jpg",
  },
];