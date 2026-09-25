import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useCart } from "../context/CartContext";
import { apiUrl } from "../config/api";
import "../styles/navbar.css";

type CatalogCategory =
    | "Barchasi"
    | "Kolbasa"
    | "Sosiska"
    | "Go‘sht mahsulotlari"
    | "Yarim tayyor"
    | "Sut mahsulotlari"
    | "Konserva"
    | "Boshqa";

type Customer = {
    id: string;
    name: string;
    phone: string;
};

export default function Navbar() {
    const navigate = useNavigate();
    const { totalItems } = useCart();

    // =========================
    // FAVORITES COUNT
    // =========================

    const [favoriteCount, setFavoriteCount] = useState(0);

    // =========================
    // CUSTOMER
    // =========================

    const [loggedInCustomer, setLoggedInCustomer] =
        useState<Customer | null>(() => {
            const savedCustomer =
                localStorage.getItem("customer");

            if (!savedCustomer) {
                return null;
            }

            try {
                return JSON.parse(savedCustomer);
            } catch {
                return null;
            }
        });

    // =========================
    // LOAD FAVORITES COUNT
    // =========================

    useEffect(() => {
        const loadFavoriteCount = async () => {
            const customerData =
                localStorage.getItem("customer");

            if (!customerData) {
                setFavoriteCount(0);
                return;
            }

            try {
                const customer =
                    JSON.parse(customerData);

                if (!customer?.id) {
                    setFavoriteCount(0);
                    return;
                }

                const response = await fetch(
                    apiUrl(`/api/favorites/${customer.id}`)
                );

                if (!response.ok) {
                    setFavoriteCount(0);
                    return;
                }

                const data = await response.json();

                setFavoriteCount(
                    Array.isArray(data)
                        ? data.length
                        : 0
                );
            } catch (error) {
                console.error(
                    "Saralanganlar sonini olishda xatolik:",
                    error
                );

                setFavoriteCount(0);
            }
        };

        loadFavoriteCount();

        const handleFavoritesUpdated = () => {
            loadFavoriteCount();
        };

        window.addEventListener(
            "favoritesUpdated",
            handleFavoritesUpdated
        );

        return () => {
            window.removeEventListener(
                "favoritesUpdated",
                handleFavoritesUpdated
            );
        };
    }, [loggedInCustomer]);

    // =========================
    // CUSTOMER LOGIN / LOGOUT
    // =========================

    useEffect(() => {
        const handleCustomerLogout = () => {
            setLoggedInCustomer(null);
            setFavoriteCount(0);
        };

        const handleCustomerLogin = () => {
            const savedCustomer =
                localStorage.getItem("customer");

            if (!savedCustomer) {
                setLoggedInCustomer(null);
                setFavoriteCount(0);
                return;
            }

            try {
                setLoggedInCustomer(
                    JSON.parse(savedCustomer)
                );
            } catch {
                setLoggedInCustomer(null);
                setFavoriteCount(0);
            }
        };

        window.addEventListener(
            "customerLogout",
            handleCustomerLogout
        );

        window.addEventListener(
            "customerLogin",
            handleCustomerLogin
        );

        return () => {
            window.removeEventListener(
                "customerLogout",
                handleCustomerLogout
            );

            window.removeEventListener(
                "customerLogin",
                handleCustomerLogin
            );
        };
    }, []);

    // =========================
    // CATALOG
    // =========================

    const [showCatalog, setShowCatalog] =
        useState(false);

    // Katalogdan tashqariga bosilganda yopiladi
    useEffect(() => {
        const handleOutsideClick = (
            event: MouseEvent
        ) => {
            const target =
                event.target as HTMLElement;

            if (
                target.closest(".catalog-btn") ||
                target.closest(".catalog-menu")
            ) {
                return;
            }

            setShowCatalog(false);
        };

        document.addEventListener(
            "click",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "click",
                handleOutsideClick
            );
        };
    }, []);

    const [activeCatalog, setActiveCatalog] =
        useState<CatalogCategory>("Barchasi");

    const [search, setSearch] = useState("");

    // =========================
    // SELECT CATALOG
    // =========================

    const selectCatalog = (
        category: CatalogCategory
    ) => {
        setActiveCatalog(category);

        window.dispatchEvent(
            new CustomEvent(
                "catalogCategorySelect",
                {
                    detail: category,
                }
            )
        );
    };

    // =========================
    // SEARCH
    // =========================

    const handleSearch = (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const value = search.trim();

        if (value) {
            navigate(
                `/?search=${encodeURIComponent(value)}`
            );
        } else {
            navigate("/");
        }
    };

    // =========================
    // LOGIN
    // =========================

    const [showLogin, setShowLogin] =
        useState(false);

    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");

    const [step, setStep] =
        useState<"phone" | "register">("phone");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] = useState("");

    // =========================
    // OPEN LOGIN
    // =========================

    const openLogin = () => {
        setShowLogin(true);
        setStep("phone");
        setPhone("");
        setName("");
        setError("");
    };

    // =========================
    // CLOSE LOGIN
    // =========================

    const closeLogin = () => {
        if (loading) {
            return;
        }

        setShowLogin(false);
        setStep("phone");
        setPhone("");
        setName("");
        setError("");
    };

    // =========================
    // CHECK PHONE
    // =========================

    const handleContinue = async () => {
        if (!phone.trim()) {
            setError(
                "Telefon raqamingizni kiriting"
            );
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                apiUrl("/api/customer-auth/check"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        phone: `+998${phone.replace(
                            /\D/g,
                            ""
                        )}`,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Telefonni tekshirishda xatolik"
                );
            }

            // CUSTOMER MAVJUD
            if (data.exists) {
                const customer: Customer =
                    data.customer;

                localStorage.setItem(
                    "customer",
                    JSON.stringify(customer)
                );

                setLoggedInCustomer(customer);
                setShowLogin(false);

                window.dispatchEvent(
                    new Event("customerLogin")
                );

                return;
            }

            // CUSTOMER MAVJUD EMAS
            setStep("register");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Xatolik yuz berdi"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // REGISTER
    // =========================

    const handleRegister = async () => {
        if (!name.trim()) {
            setError("Ismingizni kiriting");
            return;
        }

        if (!phone.trim()) {
            setError(
                "Telefon raqamingizni kiriting"
            );
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                apiUrl("/api/customer-auth/register"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        phone: `+998${phone.replace(
                            /\D/g,
                            ""
                        )}`,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Ro‘yxatdan o‘tishda xatolik"
                );
            }

            const customer: Customer =
                data.customer;

            localStorage.setItem(
                "customer",
                JSON.stringify(customer)
            );

            setLoggedInCustomer(customer);
            setShowLogin(false);

            window.dispatchEvent(
                new Event("customerLogin")
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Xatolik yuz berdi"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // CATALOG CATEGORIES
    // =========================

    const catalogCategories: CatalogCategory[] = [
        "Barchasi",
        "Kolbasa",
        "Sosiska",
        "Go‘sht mahsulotlari",
        "Yarim tayyor",
        "Sut mahsulotlari",
        "Konserva",
        "Boshqa",
    ];

    const catalogIcons: Record<
        CatalogCategory,
        string
    > = {
        Barchasi: "🛍️",
        Kolbasa: "🥩",
        Sosiska: "🌭",
        "Go‘sht mahsulotlari": "🥩",
        "Yarim tayyor": "🍱",
        "Sut mahsulotlari": "🥛",
        Konserva: "🥫",
        Boshqa: "🍖",
    };

    // =========================
    // RETURN
    // =========================

    return (
        <>
            {/* =========================
                NAVBAR
            ========================= */}

            <header className="navbar">

                {/* LOGO */}

                <Link
                    to="/"
                    className="navbar-logo"
                >
                    <div className="logo-circle">
                        O
                    </div>

                    <span>OFIYAT</span>

                    <b>market</b>
                </Link>

                {/* =========================
                    CATALOG BUTTON
                ========================= */}

                <button
                    type="button"
                    className={`catalog-btn ${showCatalog
                        ? "catalog-active"
                        : ""
                        }`}
                    onClick={() =>
                        setShowCatalog(
                            (prev) => !prev
                        )
                    }
                >
                    ☰

                    <span>
                        Katalog
                    </span>
                </button>

                {/* =========================
                    SEARCH
                ========================= */}

                <form
                    className="search-box"
                    onSubmit={handleSearch}
                >
                    <input
                        type="search"
                        placeholder="Mahsulot va turkumlar izlash"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        aria-label="Mahsulot qidirish"
                    />

                    <button
                        type="submit"
                        aria-label="Qidirish"
                    >
                        ⌕
                    </button>
                </form>

                {/* =========================
                    DESKTOP ACTIONS
                ========================= */}

                <div className="navbar-actions">

                    {/* LOGIN / PROFILE */}

                    {loggedInCustomer ? (
                        <Link
                            to="/profile"
                            className="navbar-action"
                        >
                            👤

                            <span>
                                {
                                    loggedInCustomer.name
                                }
                            </span>
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="navbar-action"
                            onClick={openLogin}
                        >
                            👤

                            <span>
                                Kirish
                            </span>
                        </button>
                    )}

                    {/* =========================
                        FAVORITES
                    ========================= */}

                    <Link
                        to="/favorites"
                        className="navbar-action favorites-nav-btn"
                    >
                        ♡

                        <span>
                            Saralangan
                        </span>

                        {favoriteCount > 0 && (
                            <b
                                className={`favorites-count ${favoriteCount > 0 ? "has-animation" : ""
                                    }`}
                            >
                                {favoriteCount}
                            </b>
                        )}
                    </Link>

                    {/* =========================
                        CART
                    ========================= */}

                    <Link
                        to="/cart"
                        className="cart-nav-btn"
                    >
                        🛒
                        <span>Savat</span>

                        {totalItems > 0 && (
                            <b
                                key={totalItems}
                                className="cart-count has-animation"
                            >
                                {totalItems}
                            </b>
                        )}
                    </Link>
                </div>

                {/* =========================
                    CATALOG MENU
                ========================= */}

                {showCatalog && (
                    <div className="catalog-menu">

                        <div className="catalog-menu-inner">

                            {/* SIDEBAR */}

                            <aside className="catalog-sidebar">

                                {catalogCategories.map(
                                    (item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            className={`catalog-category ${activeCatalog ===
                                                item
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                selectCatalog(
                                                    item
                                                )
                                            }
                                        >
                                            <span>
                                                {
                                                    catalogIcons[
                                                    item
                                                    ]
                                                }
                                            </span>

                                            {item}
                                        </button>
                                    )
                                )}

                            </aside>

                            {/* CONTENT */}

                            <section className="catalog-content">

                                <h2>
                                    {activeCatalog}
                                </h2>

                                <p className="catalog-description">
                                    Ofiyat Market
                                    mahsulotlarini
                                    shu bo‘lim
                                    orqali tanlang.
                                </p>

                                <div className="catalog-columns">

                                    {activeCatalog ===
                                        "Barchasi" && (
                                            <>
                                                <div>

                                                    <h3>
                                                        Asosiy
                                                        bo‘limlar
                                                    </h3>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            selectCatalog(
                                                                "Kolbasa"
                                                            )
                                                        }
                                                    >
                                                        Kolbasa
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            selectCatalog(
                                                                "Sosiska"
                                                            )
                                                        }
                                                    >
                                                        Sosiska
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            selectCatalog(
                                                                "Go‘sht mahsulotlari"
                                                            )
                                                        }
                                                    >
                                                        Go‘sht
                                                        mahsulotlari
                                                    </button>

                                                </div>

                                                <div>

                                                    <h3>
                                                        Qo‘shimcha
                                                    </h3>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            selectCatalog(
                                                                "Yarim tayyor"
                                                            )
                                                        }
                                                    >
                                                        Yarim tayyor
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            selectCatalog(
                                                                "Sut mahsulotlari"
                                                            )
                                                        }
                                                    >
                                                        Sut
                                                        mahsulotlari
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            selectCatalog(
                                                                "Konserva"
                                                            )
                                                        }
                                                    >
                                                        Konserva
                                                    </button>

                                                </div>
                                            </>
                                        )}

                                    {activeCatalog !==
                                        "Barchasi" && (
                                            <div>

                                                <h3>
                                                    {
                                                        activeCatalog
                                                    }
                                                </h3>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        selectCatalog(
                                                            activeCatalog
                                                        )
                                                    }
                                                >
                                                    Barcha{" "}
                                                    {activeCatalog.toLowerCase()}{" "}
                                                    mahsulotlari
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        selectCatalog(
                                                            "Barchasi"
                                                        )
                                                    }
                                                >
                                                    Barcha
                                                    mahsulotlar
                                                </button>

                                            </div>
                                        )}

                                </div>

                            </section>

                        </div>

                    </div>
                )}

            </header>

            {/* =========================
                MOBILE MENU
            ========================= */}

            <nav className="mobile-bottom-menu">

                {/* PROFILE / LOGIN */}

                {loggedInCustomer ? (
                    <Link
                        to="/profile"
                        className="mobile-menu-item"
                    >
                        <span>
                            👤
                        </span>

                        <small>
                            {
                                loggedInCustomer.name
                            }
                        </small>
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="mobile-menu-item"
                        onClick={openLogin}
                    >
                        <span>
                            👤
                        </span>

                        <small>
                            Kirish
                        </small>
                    </button>
                )}

                {/* =========================
                    MOBILE FAVORITES
                ========================= */}

                <Link
                    to="/favorites"
                    className="mobile-menu-item favorites-mobile-item"
                >
                    <span>
                        ♡
                    </span>

                    <small>
                        Saralanganlar
                    </small>

                    {favoriteCount > 0 && (
                        <b
                            key={favoriteCount}
                            className="mobile-favorites-count has-animation"
                        >
                            {favoriteCount}
                        </b>
                    )}
                </Link>

                {/* =========================
                    MOBILE CART
                ========================= */}

                <Link
                    to="/cart"
                    className="mobile-menu-item mobile-cart-item"
                >
                    <span>
                        🛒
                    </span>

                    <small>
                        Savat
                    </small>

                    {totalItems > 0 && (
                        <b
                            key={totalItems}
                            className="mobile-cart-count has-animation"
                        >
                            {totalItems}
                        </b>
                    )}
                </Link>

            </nav>

            {/* =========================
                LOGIN MODAL
            ========================= */}

            {showLogin && (
                <div
                    className="login-overlay"
                    onClick={closeLogin}
                >
                    <div
                        className="login-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* CLOSE */}

                        <button
                            className="login-close"
                            type="button"
                            onClick={closeLogin}
                        >
                            ×
                        </button>

                        {/* LOGO */}

                        <div className="login-logo">

                            <div className="login-logo-circle">
                                O
                            </div>

                            <div>

                                <strong>
                                    OFIYAT
                                </strong>

                                <span>
                                    market
                                </span>

                            </div>

                        </div>

                        {/* =========================
                            PHONE STEP
                        ========================= */}

                        {step === "phone" ? (
                            <>
                                <h2>
                                    Ofiyat ID
                                </h2>

                                <p className="login-description">
                                    Telefon
                                    raqamingiz
                                    orqali
                                    akkauntingizga
                                    kiring yoki
                                    yangi akkaunt
                                    yarating.
                                </p>

                                <label>
                                    Telefon raqam
                                </label>

                                <div className="phone-input">

                                    <span>
                                        +998
                                    </span>

                                    <input
                                        type="tel"
                                        placeholder="90 123 45 67"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                {/* ERROR */}

                                {error && (
                                    <p className="login-error">
                                        {error}
                                    </p>
                                )}

                                {/* CONTINUE */}

                                <button
                                    type="button"
                                    className="login-continue"
                                    onClick={
                                        handleContinue
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    {loading
                                        ? "Tekshirilmoqda..."
                                        : "Davom etish"}
                                </button>
                            </>
                        ) : (
                            <>
                                {/* =========================
                                    REGISTER STEP
                                ========================= */}

                                <h2>
                                    Akkaunt yaratish
                                </h2>

                                <p className="login-description">
                                    Ofiyat ID
                                    yaratish
                                    uchun
                                    ismingizni
                                    kiriting.
                                </p>

                                <label>
                                    Ismingiz
                                </label>

                                <input
                                    className="register-input"
                                    type="text"
                                    placeholder="Ismingizni kiriting"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                />

                                <label className="register-phone-label">
                                    Telefon raqam
                                </label>

                                <div className="phone-input">

                                    <span>
                                        +998
                                    </span>

                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                {/* ERROR */}

                                {error && (
                                    <p className="login-error">
                                        {error}
                                    </p>
                                )}

                                {/* REGISTER */}

                                <button
                                    type="button"
                                    className="login-continue"
                                    onClick={
                                        handleRegister
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    {loading
                                        ? "Yaratilmoqda..."
                                        : "Ofiyat ID yaratish"}
                                </button>
                            </>
                        )}

                        <p className="login-policy">
                            Ofiyat ID orqali
                            buyurtmalar, profil
                            va buyurtmani kuzatish
                            imkoniyatlaridan
                            foydalanishingiz
                            mumkin.
                        </p>

                    </div>
                </div>
            )}

        </>
    );
}   