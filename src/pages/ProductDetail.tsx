import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiUrl } from "../config/api";
import "../styles/product-detail.css";

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    image?: string;
    composition?: string;
};

type Review = {
    _id: string;
    name: string;
    rating: number;
    comment: string;
};

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    apiUrl("/api/products")
                );

                if (!response.ok) {
                    throw new Error("Mahsulotlarni olishda xatolik");
                }

                const data = await response.json();

                const foundProduct = data.find(
                    (item: Product) => item.id === id
                );

                setProduct(foundProduct || null);
            } catch (error) {
                console.error(
                    "Mahsulotni olishda xatolik:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!product?.name) return;

            try {
                setReviewsLoading(true);

                const response = await fetch(
                    apiUrl(`/api/reviews/all/${encodeURIComponent(
                        product.name
                    )}`)
                );

                if (!response.ok) {
                    throw new Error(
                        "Sharhlarni olishda xatolik"
                    );
                }

                const data = await response.json();

                setReviews(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(
                    "Sharhlarni olishda xatolik:",
                    error
                );

                setReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchReviews();
    }, [product?.name]);

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-loading">
                    Mahsulot yuklanmoqda...
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="product-not-found">
                    <h2>Mahsulot topilmadi</h2>

                    <Link to="/">
                        Bosh sahifaga qaytish
                    </Link>
                </div>
            </div>
        );
    }

    const averageRating =
        reviews.length > 0
            ? reviews.reduce(
                (sum, review) =>
                    sum + Number(review.rating || 0),
                0
            ) / reviews.length
            : 0;

    return (
        <div className="product-detail-page">

            {/* ORQAGA */}

            <Link
                to="/"
                className="product-detail-back"
            >
                ← Mahsulotlarga qaytish
            </Link>

            {/* ASOSIY MAHSULOT */}

            <div className="product-detail-card">

                {/* RASM */}

                <div className="product-detail-image">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                        />
                    ) : (
                        <div className="product-detail-no-image">
                            📦
                        </div>
                    )}
                </div>

                {/* MA'LUMOT */}

                <div className="product-detail-info">

                    <span className="product-detail-category">
                        {product.category}
                    </span>

                    <h1>{product.name}</h1>

                    {/* RATING */}

                    <div className="product-detail-rating">
                        <span>
                            ⭐{" "}
                            {averageRating > 0
                                ? averageRating.toFixed(1)
                                : "0.0"}
                        </span>

                        <span>
                            ({reviews.length} ta sharh)
                        </span>
                    </div>

                    {/* NARX */}

                    <div className="product-detail-price">
                        {product.price.toLocaleString(
                            "uz-UZ"
                        )}{" "}
                        so‘m
                    </div>


                    {/* STOCK */}

                    <div className="product-detail-stock">
                        {product.stock > 0
                            ? `Omborda ${product.stock} dona mavjud`
                            : "Mahsulot tugagan"}
                    </div>

                    {/* BATAFSIL MA'LUMOT */}

                    <details className="product-detail-more">
                        <summary>
                            Batafsil ma’lumot
                            <span>⌄</span>
                        </summary>

                        <div className="product-detail-more-content">
                            <h3>Tarkibi</h3>

                            <p>
                                {product.composition?.trim()
                                    ? product.composition
                                    : "Tarkibi haqida ma’lumot kiritilmagan."}
                            </p>
                        </div>
                    </details>

                    {/* SAVATGA QO'SHISH */}

                    <button
                        className="product-detail-add"
                        disabled={product.stock <= 0}
                        onClick={() => addToCart(product)}
                    >
                        {product.stock > 0
                            ? "🛒 Savatga qo‘shish"
                            : "Mahsulot tugagan"}
                    </button>


                </div>
            </div>

            {/* =========================
                BATAFSIL MA'LUMOT
            ========================= */}

            <div className="product-description">

                <h2>Batafsil ma’lumot</h2>

                <div className="product-description-content">

                    <div className="product-composition">

                        <h3>Tarkibi</h3>

                        <p>
                            {product.composition?.trim()
                                ? product.composition
                                : "Tarkibi haqida ma’lumot kiritilmagan."}
                        </p>

                    </div>

                </div>
            </div>

            {/* =========================
                SHARHLAR
            ========================= */}

            <div className="product-reviews">

                <h2>
                    Sharhlar ({reviews.length})
                </h2>

                {reviewsLoading ? (
                    <p>Sharhlar yuklanmoqda...</p>
                ) : reviews.length === 0 ? (
                    <p className="no-reviews">
                        Hozircha sharhlar mavjud emas.
                    </p>
                ) : (
                    <div className="reviews-list">

                        {reviews.map((review) => (
                            <div
                                className="review-item"
                                key={review._id}
                            >

                                <div className="review-header">

                                    <strong>
                                        {review.name}
                                    </strong>

                                    <span>
                                        {"⭐".repeat(
                                            Math.max(
                                                0,
                                                Math.min(
                                                    5,
                                                    Number(
                                                        review.rating
                                                    )
                                                )
                                            )
                                        )}
                                    </span>

                                </div>

                                <p>
                                    {review.comment}
                                </p>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

