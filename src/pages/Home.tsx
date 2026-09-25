import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { Product } from "../data/products";

import ProductGrid from "../components/ProductGrid";

import ProductCard from "../components/ProductCard";

import "../styles/home.css";

import heroImage from "../assets/ofiyat-hero.png";

import { useCart } from "../context/CartContext";
import { apiUrl } from "../config/api";

const PRODUCTS_API = apiUrl("/api/products");

const SETTINGS_API = apiUrl("/api/settings/public");

type MarketSettings = {
    shopName: string;
    phone: string;
    address: string;
    deliveryPrice: string;
    freeDelivery: string;
};

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState("Barchasi");
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search")?.trim().toLowerCase() ?? "";
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [marketSettings, setMarketSettings] =
        useState<MarketSettings>({
            shopName: "Ofiyat Market",
            phone: "+998 90 123 45 67",
            address: "Toshkent shahri",
            deliveryPrice: "15000",
            freeDelivery: "200000",
        });

    const { addToCart } = useCart();
    const [footerOpen, setFooterOpen] = useState(false);

    // MARKET SETTINGS
    useEffect(() => {
        const loadMarketSettings = async () => {
            try {
                const response = await fetch(
                    `${SETTINGS_API}?t=${Date.now()}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Market sozlamalari yuklanmadi"
                    );
                }

                const data = await response.json();

                setMarketSettings(data);
            } catch (error) {
                console.error(
                    "Market sozlamalarini yuklashda xatolik:",
                    error
                );
            }
        };

        // Birinchi marta yuklash
        loadMarketSettings();

        // Har 2 sekundda backendni tekshirish
        const interval = window.setInterval(
            loadMarketSettings,
            2000
        );

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    // NAVBAR KATALOG + QIDIRUV
    useEffect(() => {
        const handleCatalogCategory = (event: Event) => {
            const customEvent = event as CustomEvent<string>;
            setCategory(customEvent.detail || "Barchasi");
        };

        window.addEventListener(
            "catalogCategorySelect",
            handleCatalogCategory
        );

        return () => {
            window.removeEventListener(
                "catalogCategorySelect",
                handleCatalogCategory
            );
        };
    }, []);

    // PRODUCTS
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(PRODUCTS_API);

                if (!response.ok) {
                    throw new Error(
                        "Mahsulotlarni olishda xatolik"
                    );
                }

                const data: Product[] =
                    await response.json();

                setProducts(data);
            } catch (error) {
                console.error("Products error:", error);

                setError(
                    "Mahsulotlarni yuklashda xatolik yuz berdi."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = [
        "Barchasi",
        ...Array.from(
            new Set(
                products.map(
                    (product) => product.category
                )
            )
        ),
    ];

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory =
                category === "Barchasi" ||
                product.category === category;

            const haystack =
                `${product.name} ${product.category}`.toLowerCase();

            const matchesSearch =
                !searchQuery || haystack.includes(searchQuery);

            return matchesCategory && matchesSearch;
        });
    }, [products, category, searchQuery]);

    function handleAdd(product: Product) {
        if (product.stock <= 0) {
            alert("Bu mahsulot hozir tugagan.");
            return;
        }

        addToCart(product);
    }

    return (
        <main className="home">
            {/* HERO */}
            <section className="hero">
                <div className="hero-content">
                    <span>100% TABIIY</span>

                    <h1>
                        Mazali va sifatli
                        <br />
                        mahsulotlar
                    </h1>

                    <p>
                        Ofiyat Market — sifatli kolbasa
                        va sosiska mahsulotlari.
                    </p>

                    <button
                        onClick={() => {
                            document
                                .getElementById("products")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                });
                        }}
                    >
                        Mahsulotlarni ko'rish
                    </button>
                </div>

                <div className="hero-image">
                    <img
                        src={heroImage}
                        alt="Ofiyat mahsulotlari"
                    />
                </div>
            </section>

            {/* MAHSULOTLAR */}
            <section
                className="products-section"
                id="products"
            >
                <div className="section-header">
                    <div>
                        <span>OFIYAT MARKET</span>
                        <h2>Mahsulotlarimiz</h2>
                    </div>

                    <button className="view-all">
                        Barchasini ko'rish →
                    </button>
                </div>

                {/* CATEGORIES */}
                <div className="categories">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className={
                                category === item
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setCategory(item)
                            }
                        >
                            <span className="category-icon">
                                {item === "Barchasi" &&
                                    "🛍️"}

                                {item === "Kolbasa" &&
                                    "🥩"}

                                {item === "Sosiska" &&
                                    "🌭"}

                                {item !== "Barchasi" &&
                                    item !== "Kolbasa" &&
                                    item !== "Sosiska" &&
                                    "🍖"}
                            </span>

                            <span>{item}</span>
                        </button>
                    ))}
                </div>

                {/* PRODUCTS */}
                {loading ? (
                    <div className="empty-products">
                        <h3>
                            Mahsulotlar
                            yuklanmoqda...
                        </h3>
                    </div>
                ) : error ? (
                    <div className="empty-products">
                        <h3>{error}</h3>

                        <p>
                            Backend server
                            ishlayotganini tekshiring.
                        </p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-products">
                        <h3>
                            Mahsulot topilmadi
                        </h3>

                        <p>
                            Bu kategoriyada hozircha
                            mahsulot mavjud emas.
                        </p>
                    </div>
                ) : (
                    <ProductGrid
                        products={filteredProducts}
                        onAdd={handleAdd}
                    />
                )}

                {/* SHOW MORE */}
                {!loading &&
                    !error &&
                    filteredProducts.length > 6 && (
                        <div className="show-more">
                            <button>
                                Yana ko'rsatish
                            </button>
                        </div>
                    )}
            </section>

            {/* ARZON NARXLAR */}
            <section className="cheap-section">
                <div className="cheap-header">
                    <div>
                        <span>OFIYAT MARKET</span>

                        <h2>
                            Arzon narxlar kafolati
                        </h2>
                    </div>

                    <button className="view-all">
                        Barchasini ko‘rish →
                    </button>
                </div>

                <div className="cheap-grid">
                    {products
                        .slice(0, 3)
                        .map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAdd={handleAdd}
                            />
                        ))}
                </div>
            </section>

            {/* AFZALLIKLAR */}
            <section className="advantages-section">
                <div className="advantages-header">
                    <span>NEGA BIZ?</span>

                    <h2>
                        Bizni tanlash uchun
                        sabablar
                    </h2>
                </div>

                <div className="advantages-grid">
                    <div className="advantage-card">
                        <div className="advantage-icon">
                            🚚
                        </div>

                        <div className="advantage-content">
                            <h3>
                                Tez yetkazib berish
                            </h3>

                            <p>
                                Buyurtmangizni tez va
                                ehtiyotkorlik bilan
                                yetkazib beramiz.
                            </p>
                        </div>
                    </div>

                    <div className="advantage-card">
                        <div className="advantage-icon">
                            🛡️
                        </div>

                        <div className="advantage-content">
                            <h3>
                                Sifat kafolati
                            </h3>

                            <p>
                                Barcha mahsulotlarimiz
                                sifat nazoratidan o'tadi.
                            </p>
                        </div>
                    </div>

                    <div className="advantage-card">
                        <div className="advantage-icon">
                            💰
                        </div>

                        <div className="advantage-content">
                            <h3>
                                Arzon narxlar
                            </h3>

                            <p>
                                Siz uchun qulay va
                                hamyonbop narxlarni
                                taklif qilamiz.
                            </p>
                        </div>
                    </div>

                    <div className="advantage-card">
                        <div className="advantage-icon">
                            ❤️
                        </div>

                        <div className="advantage-content">
                            <h3>
                                Mijozlarimiz uchun
                            </h3>

                            <p>
                                Sizning mamnunligingiz
                                biz uchun eng muhim.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-container">

                    {/* BRAND */}
                    <div className="footer-brand">
                        <h2>{marketSettings.shopName}</h2>

                        <p>
                            Sifatli va mazali mahsulotlar bilan
                            dasturxoningizni yanada chiroyli qiling.
                        </p>
                    </div>

                    {/* MOBILE BATAFSIL */}
                    <button
                        type="button"
                        className="footer-more-btn"
                        onClick={() => setFooterOpen(!footerOpen)}
                    >
                        <span>Ma'lumot</span>
                        <span className={footerOpen ? "footer-more-arrow open" : "footer-more-arrow"}>
                            ›
                        </span>
                    </button>

                    {/* FOOTER COLUMNS */}
                    <div
                        className={
                            footerOpen
                                ? "footer-columns mobile-open"
                                : "footer-columns"
                        }
                    >
                        <div className="footer-column">
                            <h3>Ma'lumot</h3>

                            <a href="/">Bosh sahifa</a>

                            <a href="/products">Mahsulotlar</a>

                            <a href="#">Biz haqimizda</a>
                        </div>

                        <div className="footer-column">
                            <h3>Yordam</h3>

                            <a href="#">Yetkazib berish</a>

                            <a href="#">To'lov usullari</a>

                            <a href="#">Savol-javob</a>
                        </div>

                        <div className="footer-column">
                            <h3>Bog'lanish</h3>

                            <p>📞 {marketSettings.phone}</p>

                            <p>📍 {marketSettings.address}</p>

                            <p>✉️ info@ofiyat.uz</p>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © 2026 Ofiyat. Barcha huquqlar himoyalangan.
                    </p>
                </div>

                {/* MOBILE BOTTOM NAV */}
                <nav className="mobile-bottom-nav">
                    <a href="/cart">
                        <span className="mobile-nav-icon">🛒</span>
                        <span>Savat</span>
                    </a>

                    <a href="/favorites">
                        <span className="mobile-nav-icon">♡</span>
                        <span>Sevimlilar</span>
                    </a>

                    <a href="/profile">
                        <span className="mobile-nav-icon">👤</span>
                        <span>Profil</span>
                    </a>
                </nav>
            </footer>
        </main>
    );
}