import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";
import "./Orders.css";

type Product = {
    name: string;
    quantity: number;
    price: number;
};

type Order = {
    id: string;
    customerId?: string;
    customerName: string;
    customerPhone: string;
    address?: string;
    products: Product[];
    total: number;
    status: "pending" | "processing" | "delivered" | "cancelled";
    createdAt: string;
};

const statusText: Record<Order["status"], string> = {
    pending: "Kutilmoqda",
    processing: "Tayyorlanmoqda",
    delivered: "Yetkazildi",
    cancelled: "Bekor qilindi",
};

export default function Orders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            const savedCustomer = localStorage.getItem("customer");

            if (!savedCustomer) {
                navigate("/");
                return;
            }

            try {
                const customer = JSON.parse(savedCustomer);

                const response = await fetch(
                    apiUrl(`/api/customer-auth/orders/${customer.id}`)
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Buyurtmalarni olishda xatolik"
                    );
                }

                setOrders(data);
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Buyurtmalarni yuklashda xatolik"
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
        const interval = setInterval(loadOrders, 5000);

        return () => clearInterval(interval);
    }, [navigate]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("uz-UZ").format(price);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("uz-UZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <main className="orders-page">
                <div className="orders-container">
                    <div className="orders-loading">
                        Buyurtmalar yuklanmoqda...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="orders-page">
            <div className="orders-container">

                <div className="orders-title">
                    <Link
                        to="/profile"
                        className="orders-back"
                    >
                        ‹
                    </Link>

                    <div>
                        <h1>Buyurtmalarim</h1>
                        <p>
                            Barcha buyurtmalaringiz shu yerda
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="orders-error">
                        {error}
                    </div>
                )}

                {!error && orders.length === 0 && (
                    <div className="orders-empty">
                        <div className="orders-empty-icon">
                            📦
                        </div>

                        <h2>Hozircha buyurtmalar yo‘q</h2>

                        <p>
                            Birinchi buyurtmangizni
                            berishingiz mumkin.
                        </p>

                        <Link
                            to="/"
                            className="orders-shop-btn"
                        >
                            Xarid qilish
                        </Link>
                    </div>
                )}

                <div className="orders-list">
                    {orders.map((order) => (
                        <article
                            key={order.id}
                            className="order-card"
                        >
                            <div className="order-card-top">

                                <div>
                                    <strong>
                                        Buyurtma #{order.id.slice(-6)}
                                    </strong>

                                    <small>
                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </small>
                                </div>

                                <span
                                    className={`order-status status-${order.status}`}
                                >
                                    {statusText[order.status]}
                                </span>
                            </div>

                            {order.address && (
                                <div className="order-address">
                                    📍 {order.address}
                                </div>
                            )}

                            <div className="order-products">
                                {order.products.map(
                                    (product, index) => (
                                        <div
                                            key={`${order.id}-${index}`}
                                            className="order-product"
                                        >
                                            <div>
                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <small>
                                                    {product.quantity} dona ×{" "}
                                                    {formatPrice(
                                                        product.price
                                                    )}{" "}
                                                    so‘m
                                                </small>
                                            </div>

                                            <span>
                                                {formatPrice(
                                                    product.price *
                                                    product.quantity
                                                )}{" "}
                                                so‘m
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="order-total">
                                <span>Jami</span>

                                <strong>
                                    {formatPrice(order.total)} so‘m
                                </strong>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </main>
    );
}