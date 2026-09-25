import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { apiUrl } from "../config/api";
import "../styles/favorites.css";

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    image?: string;
};

type Favorite = {
    _id: string;
    customerId: string;
    productId: string;
};

export default function Favorites() {
    const { addToCart } = useCart();

    const [products, setProducts] =
        useState<Product[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [customerId, setCustomerId] =
        useState("");

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const customerData =
                    localStorage.getItem("customer");

                if (!customerData) {
                    setProducts([]);
                    return;
                }

                const customer = JSON.parse(
                    customerData
                );

                if (!customer?.id) {
                    setProducts([]);
                    return;
                }

                setCustomerId(customer.id);

                // 1. Saralangan mahsulotlar
                const favoritesResponse =
                    await fetch(
                        apiUrl(`/api/favorites/${customer.id}`)
                    );

                const favoritesData =
                    await favoritesResponse.json();

                if (!favoritesResponse.ok) {
                    throw new Error(
                        favoritesData.message ||
                        "Saralanganlarni olishda xatolik"
                    );
                }

                // 2. Barcha mahsulotlar
                const productsResponse =
                    await fetch(
                        apiUrl("/api/products")
                    );

                const productsData =
                    await productsResponse.json();

                if (!productsResponse.ok) {
                    throw new Error(
                        productsData.message ||
                        "Mahsulotlarni olishda xatolik"
                    );
                }

                // 3. Faqat saralangan mahsulotlarni ajratib olish
                const favoriteProductIds =
                    favoritesData.map(
                        (favorite: Favorite) =>
                            favorite.productId
                    );

                const favoriteProducts =
                    productsData.filter(
                        (product: Product) =>
                            favoriteProductIds.includes(
                                product.id
                            )
                    );

                setProducts(favoriteProducts);
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Xatolik yuz berdi"
                );
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    const removeFavorite = async (
        productId: string
    ) => {
        try {
            const response = await fetch(
                apiUrl("/api/favorites"),
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        customerId,
                        productId,
                    }),
                }
            );

            if (!response.ok) {
                const data =
                    await response.json();

                throw new Error(
                    data.message ||
                    "Saralanganlardan o‘chirishda xatolik"
                );
            }

            setProducts((prev) =>
                prev.filter(
                    (product) =>
                        product.id !== productId
                )
            );

            // Navbar'dagi haqiqiy favorites sonini yangilaydi
            window.dispatchEvent(
                new Event("favoritesUpdated")
            );
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Xatolik yuz berdi"
            );
        }
    };

    if (loading) {
        return (
            <main className="favorites-page">
                <div className="favorites-container">
                    <p>Yuklanmoqda...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="favorites-page">
                <div className="favorites-container">
                    <div className="favorites-header">
                        <Link
                            to="/profile"
                            className="favorites-back"
                        >
                            ‹
                        </Link>

                        <div>
                            <h1>Saralanganlar</h1>
                            <p>
                                Saqlagan
                                mahsulotlaringiz
                            </p>
                        </div>
                    </div>

                    <div className="favorites-error">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="favorites-page">
            <div className="favorites-container">

                {/* HEADER */}
                <div className="favorites-header">
                    <Link
                        to="/profile"
                        className="favorites-back"
                    >
                        ‹
                    </Link>

                    <div>
                        <h1>Saralanganlar</h1>

                        <p>
                            {products.length > 0
                                ? `${products.length} ta mahsulot`
                                : "Saqlagan mahsulotlaringiz"}
                        </p>
                    </div>
                </div>

                {/* EMPTY */}
                {products.length === 0 ? (
                    <div className="favorites-empty">
                        <div className="favorites-empty-icon">
                            ♡
                        </div>

                        <h2>
                            Hozircha
                            saralanganlar yo‘q
                        </h2>

                        <p>
                            Yoqtirgan
                            mahsulotlaringizni ♡
                            tugmasi orqali shu
                            yerga saqlashingiz
                            mumkin.
                        </p>

                        <Link
                            to="/"
                            className="favorites-shop-btn"
                        >
                            Xarid qilish
                        </Link>
                    </div>
                ) : (
                    /* PRODUCTS */
                    <div className="favorites-grid">
                        {products.map((product) => (
                            <article
                                className="favorite-product-card"
                                key={product.id}
                            >
                                <Link
                                    to={`/product/${product.id}`}
                                    className="favorite-product-link"
                                >
                                    <div className="favorite-product-image">
                                        <img
                                            src={
                                                product.image ||
                                                "/default.jpg"
                                            }
                                            alt={
                                                product.name
                                            }
                                        />
                                    </div>

                                    <div className="favorite-product-info">
                                        <span>
                                            {
                                                product.category
                                            }
                                        </span>

                                        <h3>
                                            {
                                                product.name
                                            }
                                        </h3>

                                        <strong>
                                            {product.price.toLocaleString(
                                                "uz-UZ"
                                            )}{" "}
                                            so‘m
                                        </strong>
                                    </div>
                                </Link>

                                <button
                                    type="button"
                                    className="favorite-remove-btn"
                                    onClick={() =>
                                        removeFavorite(
                                            product.id
                                        )
                                    }
                                    title="Saralanganlardan olib tashlash"
                                >
                                    ♥
                                </button>

                                <button
                                    type="button"
                                    className="favorite-cart-btn"
                                    disabled={
                                        product.stock <=
                                        0
                                    }
                                    onClick={() =>
                                        addToCart(
                                            product
                                        )
                                    }
                                >
                                    {product.stock <= 0
                                        ? "Sotuvda yo‘q"
                                        : "Savatga qo‘shish"}
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}