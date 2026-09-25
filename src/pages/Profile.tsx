import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";
import "./Profile.css";

type Customer = {
    id: string;
    name: string;
    phone: string;
    orders?: number;
    spent?: number;
    status?: string;
    createdAt?: string;
};

export default function Profile() {
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            const savedCustomer = localStorage.getItem("customer");

            if (!savedCustomer) {
                navigate("/");
                return;
            }

            try {
                const customerData: Customer =
                    JSON.parse(savedCustomer);

                const response = await fetch(
                    apiUrl(`/api/customer-auth/profile/${customerData.id}`)
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Profilni olishda xatolik"
                    );
                }

                setCustomer(data);

                localStorage.setItem(
                    "customer",
                    JSON.stringify(data)
                );
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Profilni yuklashda xatolik"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const openEdit = () => {
        if (!customer) return;

        setEditName(customer.name);
        setEditPhone(customer.phone);
        setSaveMessage("");
        setError("");
        setEditing(true);
    };

    const closeEdit = () => {
        if (saving) return;

        setEditing(false);
        setSaveMessage("");
        setError("");
    };

    const handleSave = async () => {
        if (!customer) return;

        if (!editName.trim()) {
            setError("Ismingizni kiriting");
            return;
        }

        if (!editPhone.trim()) {
            setError("Telefon raqamingizni kiriting");
            return;
        }

        setSaving(true);
        setError("");
        setSaveMessage("");

        try {
            const response = await fetch(
                apiUrl(`/api/customer-auth/profile/${customer.id}`),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: editName.trim(),
                        phone: editPhone.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Profilni yangilashda xatolik"
                );
            }

            setCustomer(data.customer);

            localStorage.setItem(
                "customer",
                JSON.stringify(data.customer)
            );

            setSaveMessage("Profil muvaffaqiyatli yangilandi ✓");

            setTimeout(() => {
                setEditing(false);
                setSaveMessage("");
            }, 1000);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Xatolik yuz berdi"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("customer");
        navigate("/");
        window.location.reload();
    };

    if (loading) {
        return (
            <main className="profile-page">
                <div className="profile-container">
                    <div className="profile-loading">
                        Profil yuklanmoqda...
                    </div>
                </div>
            </main>
        );
    }

    if (error && !editing) {
        return (
            <main className="profile-page">
                <div className="profile-container">
                    <div className="profile-error">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!customer) {
        return null;
    }

    return (
        <main className="profile-page">
            <div className="profile-container">

                <div className="profile-header">
                    <div className="profile-avatar">
                        {customer.name
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="profile-user-info">
                        <h1>{customer.name}</h1>
                        <p>{customer.phone}</p>
                    </div>

                    <button
                        type="button"
                        className="profile-edit-btn"
                        onClick={openEdit}
                    >
                        ✏️ Tahrirlash
                    </button>
                </div>

                <div className="profile-menu">

                    <Link
                        to="/orders"
                        className="profile-menu-item"
                    >
                        <span className="profile-menu-icon">
                            📦
                        </span>

                        <div>
                            <strong>
                                Buyurtmalarim
                            </strong>

                            <small>
                                {customer.orders || 0} ta buyurtma
                            </small>
                        </div>

                        <span className="profile-arrow">
                            ›
                        </span>
                    </Link>

                    <Link
                        to="/reviews"
                        className="profile-menu-item"
                    >
                        <span className="profile-menu-icon">
                            ⭐
                        </span>

                        <div>
                            <strong>
                                Sharhlar
                            </strong>

                            <small>
                                Fikringizni biz bilan baham ko‘ring
                            </small>
                        </div>

                        <span className="profile-arrow">
                            ›
                        </span>
                    </Link>

                    <Link
                        to="/favorites"
                        className="profile-menu-item"
                    >
                        <span className="profile-menu-icon">
                            ♡
                        </span>

                        <div>
                            <strong>
                                Saralanganlar
                            </strong>

                            <small>
                                Saqlangan mahsulotlar
                            </small>
                        </div>

                        <span className="profile-arrow">
                            ›
                        </span>
                    </Link>

                    <Link
                        to="/settings"
                        className="profile-menu-item"
                    >
                        <span className="profile-menu-icon">
                            ⚙️
                        </span>

                        <div>
                            <strong>
                                Sozlamalar
                            </strong>

                            <small>
                                Profil sozlamalari
                            </small>
                        </div>

                        <span className="profile-arrow">
                            ›
                        </span>
                    </Link>

                </div>

                <button
                    type="button"
                    className="profile-logout"
                    onClick={handleLogout}
                >
                    🚪 Chiqish
                </button>

            </div>

            {editing && (
                <div
                    className="profile-edit-overlay"
                    onClick={closeEdit}
                >
                    <div
                        className="profile-edit-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            className="profile-edit-close"
                            onClick={closeEdit}
                        >
                            ×
                        </button>

                        <h2>Profilni tahrirlash</h2>

                        <p className="profile-edit-description">
                            Shaxsiy ma’lumotlaringizni
                            o‘zgartiring.
                        </p>

                        <label>Ism</label>

                        <input
                            type="text"
                            value={editName}
                            onChange={(e) =>
                                setEditName(e.target.value)
                            }
                            placeholder="Ismingiz"
                        />

                        <label>Telefon raqam</label>

                        <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) =>
                                setEditPhone(e.target.value)
                            }
                            placeholder="+998 90 123 45 67"
                        />

                        {error && (
                            <p className="profile-edit-error">
                                {error}
                            </p>
                        )}

                        {saveMessage && (
                            <p className="profile-save-message">
                                {saveMessage}
                            </p>
                        )}

                        <button
                            type="button"
                            className="profile-save-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving
                                ? "Saqlanmoqda..."
                                : "Saqlash"}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}