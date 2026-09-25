import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { apiUrl } from "../config/api";

import "../styles/checkout.css";

const ORDERS_API =
    apiUrl("/api/customer-auth/orders");

type Customer = {
    id: string;
    name: string;
    phone: string;
};

export default function Checkout() {
    const navigate = useNavigate();

    const {
        cartItems,
        totalPrice,
        totalItems,
        clearCart,
    } = useCart();

    const [customerId, setCustomerId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [address, setAddress] = useState(
        localStorage.getItem("deliveryAddress") || ""
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const savedCustomer = localStorage.getItem("customer");

        if (!savedCustomer) {
            navigate("/");
            return;
        }

        try {
            const customer: Customer = JSON.parse(savedCustomer);

            setCustomerId(customer.id);
            setCustomerName(customer.name || "");
            setCustomerPhone(customer.phone || "");
            const savedAddress =
                localStorage.getItem("deliveryAddress");

            if (savedAddress) {
                setAddress(savedAddress);
            }
        } catch (error) {
            console.error("Customer ma'lumotlarini o'qishda xatolik:", error);
            navigate("/");
        }
    }, [navigate]);

    if (cartItems.length === 0) {
        return (
            <main className="checkout-page">
                <div className="checkout-empty">
                    <div className="checkout-empty-icon">
                        🛒
                    </div>

                    <h1>Savatingiz bo‘sh</h1>

                    <p>
                        Buyurtma berish uchun avval
                        mahsulot qo‘shing.
                    </p>

                    <Link
                        to="/"
                        className="checkout-back-btn"
                    >
                        Mahsulotlarni ko‘rish
                    </Link>
                </div>
            </main>
        );
    }

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        if (!customerId) {
            setError("Avval Ofiyat ID orqali kiring.");
            return;
        }

        if (!customerName.trim()) {
            setError("Ismingizni kiriting");
            return;
        }

        if (!customerPhone.trim()) {
            setError("Telefon raqamingizni kiriting");
            return;
        }

        if (!address.trim()) {
            setError("Yetkazib berish manzilini kiriting");
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                customerId,

                customerName: customerName.trim(),

                customerPhone: customerPhone.trim(),

                address: address.trim(),

                products: cartItems.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),

                total: totalPrice,

                status: "pending",
            };

            const response = await fetch(
                ORDERS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(orderData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Buyurtma yuborilmadi"
                );
            }

            console.log(
                "Buyurtma yaratildi:",
                data
            );

            clearCart();

            window.dispatchEvent(
                new Event("ordersUpdated")
            );

            navigate("/orders");
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Buyurtma berishda xatolik yuz berdi."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="checkout-page">
            <div className="checkout-container">

                <div className="checkout-header">
                    <Link
                        to="/cart"
                        className="checkout-back"
                    >
                        ← Savatga qaytish
                    </Link>

                    <div>
                        <span>
                            OFIYAT MARKET
                        </span>

                        <h1>
                            Buyurtma berish
                        </h1>
                    </div>
                </div>

                <div className="checkout-content">

                    <div className="checkout-form-section">

                        <div className="checkout-card">

                            <h2>
                                Mijoz ma’lumotlari
                            </h2>

                            <p className="checkout-card-description">
                                Buyurtmani yetkazish uchun
                                ma’lumotlaringizni kiriting.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="checkout-form"
                            >

                                <div className="checkout-field">
                                    <label>
                                        Ism
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Ismingizni kiriting"
                                        value={customerName}
                                        onChange={(e) =>
                                            setCustomerName(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label>
                                        Telefon raqam
                                    </label>

                                    <input
                                        type="tel"
                                        placeholder="+998 90 123 45 67"
                                        value={customerPhone}
                                        onChange={(e) =>
                                            setCustomerPhone(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label>
                                        Yetkazib berish manzili
                                    </label>

                                    <textarea
                                        placeholder="Toshkent shahri, Chilonzor tumani, ..."
                                        value={address}
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                        }}
                                        rows={4}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="save-address-btn"
                                        onClick={() => {
                                            localStorage.setItem(
                                                "deliveryAddress",
                                                address.trim()
                                            );
                                        }}
                                    >
                                        ✓ Manzilni saqlash
                                    </button>
                                </div>

                                {error && (
                                    <div className="checkout-error">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="checkout-submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Buyurtma yuborilmoqda..."
                                        : "Buyurtma berish"}
                                </button>

                            </form>
                        </div>
                    </div>

                    <aside className="checkout-summary">

                        <h2>
                            Buyurtma
                        </h2>

                        <div className="checkout-products">

                            {cartItems.map((item) => (
                                <div
                                    className="checkout-product"
                                    key={item.id}
                                >

                                    <div className="checkout-product-image">
                                        <img
                                            src={
                                                item.image ||
                                                "/products/default.jpg"
                                            }
                                            alt={item.name}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/products/default.jpg";
                                            }}
                                        />
                                    </div>

                                    <div className="checkout-product-info">

                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span>
                                            {item.quantity} dona
                                        </span>

                                    </div>

                                    <strong>
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toLocaleString(
                                            "uz-UZ"
                                        )}{" "}
                                        so‘m
                                    </strong>

                                </div>
                            ))}

                        </div>

                        <div className="checkout-summary-line" />

                        <div className="checkout-summary-row">
                            <span>
                                Mahsulotlar
                            </span>

                            <strong>
                                {totalItems} ta
                            </strong>
                        </div>

                        <div className="checkout-summary-row">
                            <span>
                                Yetkazib berish
                            </span>

                            <strong>
                                Kelishiladi
                            </strong>
                        </div>

                        <div className="checkout-summary-line" />

                        <div className="checkout-total">

                            <span>
                                Jami
                            </span>

                            <strong>
                                {totalPrice.toLocaleString(
                                    "uz-UZ"
                                )}{" "}
                                so‘m
                            </strong>

                        </div>

                    </aside>

                </div>
            </div>
        </main>
    );
}