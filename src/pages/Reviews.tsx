import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../config/api";
import "./Reviews.css";

type Product = {
    name: string;
    quantity: number;
    price: number;
};

type Order = {
    id: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    products: Product[];
    total: number;
    status: string;
    createdAt: string;
};

type Review = {
    _id: string;
    orderId: string;
    productName: string;
    rating: number;
    comment: string;
};

export default function Reviews() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedOrder, setSelectedOrder] =
        useState<Order | null>(null);

    const [selectedProduct, setSelectedProduct] =
        useState("");

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedCustomer =
                    localStorage.getItem("customer");

                if (!savedCustomer) {
                    setError("Avval Ofiyat ID orqali kiring.");
                    return;
                }

                const customer = JSON.parse(savedCustomer);

                const [ordersResponse, reviewsResponse] =
                    await Promise.all([
                        fetch(
                            apiUrl(`/api/customer-auth/orders/${customer.id}`)
                        ),
                        fetch(
                            apiUrl(`/api/reviews/${customer.id}`)
                        ),
                    ]);

                const ordersData =
                    await ordersResponse.json();

                const reviewsData =
                    await reviewsResponse.json();

                if (!ordersResponse.ok) {
                    throw new Error(
                        ordersData.message ||
                            "Buyurtmalarni olishda xatolik"
                    );
                }

                if (!reviewsResponse.ok) {
                    throw new Error(
                        reviewsData.message ||
                            "Sharhlarni olishda xatolik"
                    );
                }

                setOrders(ordersData);
                setReviews(reviewsData);
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Ma'lumotlarni yuklashda xatolik"
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const hasReview = (
        orderId: string,
        productName: string
    ) => {
        return reviews.some(
            (review) =>
                review.orderId === orderId &&
                review.productName === productName
        );
    };

    const openReview = (
        order: Order,
        productName: string
    ) => {
        setSelectedOrder(order);
        setSelectedProduct(productName);
        setRating(0);
        setComment("");
    };

    const closeReview = () => {
        setSelectedOrder(null);
        setSelectedProduct("");
        setRating(0);
        setComment("");
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!selectedOrder || !selectedProduct) {
            return;
        }

        if (!rating) {
            return;
        }

        if (!comment.trim()) {
            return;
        }

        try {
            setSending(true);

            const savedCustomer =
                localStorage.getItem("customer");

            if (!savedCustomer) {
                throw new Error(
                    "Avval Ofiyat ID orqali kiring."
                );
            }

            const customer = JSON.parse(savedCustomer);

            const response = await fetch(
                apiUrl("/api/reviews"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        customerId: customer.id,
                        orderId: selectedOrder.id,
                        productName: selectedProduct,
                        rating,
                        comment: comment.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Sharh yuborishda xatolik"
                );
            }

            setReviews((prev) => [
                data.review,
                ...prev,
            ]);

            closeReview();
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Sharh yuborishda xatolik"
            );
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <main className="reviews-page">
                <div className="reviews-container">
                    <p>Yuklanmoqda...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="reviews-page">
                <div className="reviews-container">
                    <Link
                        to="/profile"
                        className="reviews-back"
                    >
                        ← Profilga qaytish
                    </Link>

                    <div className="reviews-card">
                        <p>{error}</p>
                    </div>
                </div>
            </main>
        );
    }

    const deliveredOrders = orders.filter(
        (order) => order.status === "delivered"
    );

    return (
        <main className="reviews-page">
            <div className="reviews-container">
                <Link
                    to="/profile"
                    className="reviews-back"
                >
                    ← Profilga qaytish
                </Link>

                <div className="reviews-header">
                    <h1>Sharhlar</h1>

                    <p>
                        Xarid qilgan mahsulotlaringiz haqida
                        fikringizni qoldiring.
                    </p>
                </div>

                {deliveredOrders.length === 0 ? (
                    <div className="reviews-card reviews-empty">
                        <div className="reviews-empty-icon">
                            ⭐
                        </div>

                        <h2>
                            Hozircha sharh qoldirish uchun
                            buyurtma yo‘q
                        </h2>

                        <p>
                            Yetkazilgan buyurtmalaringiz
                            shu yerda ko‘rinadi.
                        </p>

                        <Link
                            to="/orders"
                            className="review-orders-btn"
                        >
                            Buyurtmalarim
                        </Link>
                    </div>
                ) : (
                    <div className="reviews-orders">
                        {deliveredOrders.map((order) => (
                            <div
                                className="review-order-card"
                                key={order.id}
                            >
                                <div className="review-order-header">
                                    <div>
                                        <strong>
                                            Buyurtma #
                                            {order.id.slice(-6)}
                                        </strong>

                                        <small>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString(
                                                "uz-UZ"
                                            )}
                                        </small>
                                    </div>

                                    <span className="review-delivered">
                                        ✓ Yetkazildi
                                    </span>
                                </div>

                                <div className="review-products">
                                    {order.products.map(
                                        (product, index) => {
                                            const reviewed =
                                                hasReview(
                                                    order.id,
                                                    product.name
                                                );

                                            return (
                                                <div
                                                    className="review-product"
                                                    key={`${product.name}-${index}`}
                                                >
                                                    <div className="review-product-info">
                                                        <strong>
                                                            {
                                                                product.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {product.quantity} dona
                                                        </span>
                                                    </div>

                                                    {reviewed ? (
                                                        <span className="review-done">
                                                            ✓ Sharh berilgan
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="review-product-btn"
                                                            onClick={() =>
                                                                openReview(
                                                                    order,
                                                                    product.name
                                                                )
                                                            }
                                                        >
                                                            Sharhlash
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedOrder && (
                    <div className="review-modal-overlay">
                        <div className="review-modal">
                            <button
                                type="button"
                                className="review-modal-close"
                                onClick={closeReview}
                            >
                                ×
                            </button>

                            <h2>
                                {selectedProduct}
                            </h2>

                            <p>
                                Mahsulotga baho bering
                            </p>

                            <form
                                onSubmit={handleSubmit}
                            >
                                <div className="review-stars">
                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={
                                                    star <=
                                                    rating
                                                        ? "selected"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setRating(
                                                        star
                                                    )
                                                }
                                            >
                                                ★
                                            </button>
                                        )
                                    )}
                                </div>

                                <textarea
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Mahsulot haqida fikringizni yozing..."
                                    rows={5}
                                />

                                <button
                                    type="submit"
                                    className="review-submit"
                                    disabled={
                                        !rating ||
                                        !comment.trim() ||
                                        sending
                                    }
                                >
                                    {sending
                                        ? "Yuborilmoqda..."
                                        : "Sharhni yuborish"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}