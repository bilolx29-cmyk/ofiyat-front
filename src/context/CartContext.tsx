import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { Product } from "../data/products";

export type CartItem = Product & {
    quantity: number;
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalPrice: number;
    totalItems: number;
};

const CartContext = createContext<
    CartContextType | undefined
>(undefined);

type CartProviderProps = {
    children: ReactNode;
};

export function CartProvider({
    children,
}: CartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>(
        () => {
            const savedCart =
                localStorage.getItem("ofiyat-cart");

            if (!savedCart) {
                return [];
            }

            try {
                return JSON.parse(savedCart);
            } catch {
                return [];
            }
        }
    );

    /* =========================
       LOCAL STORAGE
    ========================= */
    useEffect(() => {
        localStorage.setItem(
            "ofiyat-cart",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    /* =========================
       ADD TO CART
    ========================= */
    function addToCart(product: Product) {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + 1,
                          }
                        : item
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });
    }

    /* =========================
       INCREASE
    ========================= */
    function increaseQuantity(productId: string) {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity:
                              item.quantity + 1,
                      }
                    : item
            )
        );
    }

    /* =========================
       DECREASE
    ========================= */
    function decreaseQuantity(productId: string) {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity:
                                  item.quantity - 1,
                          }
                        : item
                )
                .filter(
                    (item) => item.quantity > 0
                )
        );
    }

    /* =========================
       REMOVE
    ========================= */
    function removeFromCart(productId: string) {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => item.id !== productId
            )
        );
    }

    /* =========================
       CLEAR
    ========================= */
    function clearCart() {
        setCartItems([]);
    }

    /* =========================
       TOTAL PRICE
    ========================= */
    const totalPrice = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    /* =========================
       TOTAL ITEMS
    ========================= */
    const totalItems = cartItems.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                totalPrice,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/* =========================
   USE CART
========================= */
export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart CartProvider ichida ishlatilishi kerak"
        );
    }

    return context;
}