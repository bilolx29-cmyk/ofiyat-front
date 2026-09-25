import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { apiUrl } from "../config/api";
import "../styles/product-card.css";

type Review = {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
};

type Favorite = {
    _id: string;
    customerId: string;
    productId: string;
};

type Props = {
    product: Product;
    onAdd: (product: Product) => void;
};

export default function ProductCard({
    product,
    onAdd,
}: Props) {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] =
        useState(false);
    const [customerId, setCustomerId] = useState("");

    // =========================
    // REVIEWS
    // =========================

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const response = await fetch(
                    apiUrl(`/api/reviews/all/${encodeURIComponent(
                        product.name
                    )}`)
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error(
                    "Mahsulot sharhlarini olishda xatolik:",
                    error
                );
            }
        };

        loadReviews();
    }, [product.name]);

    // =========================
    // FAVORITE STATUS
    // =========================

    useEffect(() => {
        const loadFavoriteStatus = async () => {
            try {
                const customerData =
                    localStorage.getItem("customer");

                if (!customerData) {
                    setCustomerId("");
                    setIsFavorite(false);
                    return;
                }

                const customer = JSON.parse(customerData);

                if (!customer?.id) {
                    setCustomerId("");
                    setIsFavorite(false);
                    return;
                }

                setCustomerId(customer.id);

                const response = await fetch(
                    apiUrl(`/api/favorites/${customer.id}`)
                );

                if (!response.ok) {
                    return;
                }

                const favorites: Favorite[] =
                    await response.json();

                const exists = favorites.some(
                    (favorite) =>
                        String(favorite.productId) ===
                        String(product.id)
                );

                setIsFavorite(exists);
            } catch (error) {
                console.error(
                    "Favorite status error:",
                    error
                );
            }
        };

        loadFavoriteStatus();
    }, [product.id]);

    // =========================
    // RATING
    // =========================

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce(
                      (sum, review) =>
                          sum + review.rating,
                      0
                  ) / reviews.length
              ).toFixed(1)
            : "0.0";

    // =========================
    // CART
    // =========================

    const cartItem = cartItems.find(
        (item) => item.id === product.id
    );

    const quantity = cartItem?.quantity ?? 0;

    // =========================
    // FAVORITE
    // =========================

    const handleFavorite = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (!customerId) {
            alert("Avval akkauntingizga kiring.");
            return;
        }

        if (favoriteLoading) {
            return;
        }

        try {
            setFavoriteLoading(true);

            // O'CHIRISH
            if (isFavorite) {
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
                            productId: product.id,
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

                setIsFavorite(false);
                window.dispatchEvent(new Event("favoritesUpdated"));
            }

            // QO'SHISH
            else {
                const response = await fetch(
                    apiUrl("/api/favorites"),
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            customerId,
                            productId: product.id,
                        }),
                    }
                );

                if (!response.ok) {
                    const data =
                        await response.json();

                    throw new Error(
                        data.message ||
                            "Saralanganlarga qo‘shishda xatolik"
                    );
                }

                setIsFavorite(true);
                window.dispatchEvent(new Event("favoritesUpdated"));
            }
        } catch (error) {
            console.error(
                "Favorite error:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Xatolik yuz berdi"
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

    // =========================
    // JSX
    // =========================

    return (
        <article className="product-card">
            <Link
                to={`/product/${product.id}`}
                className="product-card-link"
                style={{
                    textDecoration: "none",
                    color: "inherit",
                }}
            >
                <div className="product-image">
                    <span className="sale-badge">
                        −10%
                    </span>

                    <button
                        type="button"
                        className={`favorite-btn ${
                            isFavorite ? "active" : ""
                        }`}
                        onClick={handleFavorite}
                        disabled={favoriteLoading}
                        title={
                            isFavorite
                                ? "Saralanganlardan o‘chirish"
                                : "Saralanganlarga qo‘shish"
                        }
                    >
                        {isFavorite ? "♥" : "♡"}
                    </button>

                    <img
                        src={
                            product.image ||
                            "/default.jpg"
                        }
                        alt={product.name}
                    />
                </div>

                <div className="product-info">
                    <span className="product-category">
                        {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="product-rating">
                        <span>
                            {reviews.length > 0
                                ? "★★★★★"
                                : "☆☆☆☆☆"}
                        </span>

                        <small>
                            {reviews.length > 0
                                ? averageRating
                                : "Hali sharh yo‘q"}
                        </small>

                        {reviews.length > 0 && (
                            <small>
                                ({reviews.length})
                            </small>
                        )}
                    </div>

                    <div className="product-bottom">
                        <strong>
                            {product.price.toLocaleString(
                                "uz-UZ"
                            )}{" "}
                            so‘m
                        </strong>

                        <span
                            className="product-stock"
                            style={{
                                color:
                                    product.stock > 0
                                        ? "#16a34a"
                                        : "#dc2626",
                            }}
                        >
                            {product.stock > 0
                                ? `Mavjud: ${product.stock} dona`
                                : "Sotuvda yo‘q"}
                        </span>
                    </div>
                </div>
            </Link>

            {product.stock <= 0 ? (
                <button
                    type="button"
                    className="add-to-cart-btn"
                    disabled
                >
                    Sotuvda yo‘q
                </button>
            ) : quantity === 0 ? (
                <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={() => onAdd(product)}
                >
                    Savatga qo‘shish
                </button>
            ) : (
                <div className="product-quantity-controls">
                    <button
                        type="button"
                        className="quantity-btn quantity-minus"
                        onClick={() =>
                            decreaseQuantity(product.id)
                        }
                    >
                        −
                    </button>

                    <span className="quantity-value">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        className="quantity-btn quantity-plus"
                        disabled={
                            quantity >= product.stock
                        }
                        onClick={() =>
                            increaseQuantity(product.id)
                        }
                    >
                        +
                    </button>
                </div>
            )}
        </article>
    );
}