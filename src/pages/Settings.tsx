import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./Settings.css";

export default function Settings() {
    const navigate = useNavigate();

    const { language, setLanguage, t } = useLanguage();

    const [notifications, setNotifications] = useState(true);
    const [city, setCity] = useState(
        localStorage.getItem("deliveryCity") ||
        "Toshkent"
    );
    const [address, setAddress] = useState(
        localStorage.getItem("deliveryAddress") || ""
    );
    const handleLogout = () => {
        localStorage.removeItem("customer");

        window.dispatchEvent(
            new Event("customerLogout")
        );

        navigate("/", { replace: true });
    };

    return (
        <main className="settings-page">
            <div className="settings-container">

                {/* HEADER */}
                <div className="settings-title">
                    <Link
                        to="/profile"
                        className="settings-back"
                    >
                        ‹
                    </Link>

                    <div>
                        <h1>{t("settings")}</h1>

                        <p>
                            {language === "ru"
                                ? "Управляйте своим аккаунтом"
                                : "Akkauntingizni boshqaring"}
                        </p>
                    </div>
                </div>

                {/* ACCOUNT */}
                <section className="settings-section">
                    <h2>{t("account")}</h2>

                    <div className="settings-card">

                        <Link
                            to="/profile"
                            className="settings-item"
                        >
                            <div className="settings-icon">
                                👤
                            </div>

                            <div className="settings-content">
                                <strong>
                                    {t("profileInfo")}
                                </strong>

                                <small>
                                    {language === "ru"
                                        ? "Управляйте именем и номером телефона"
                                        : "Ism va telefon raqamingizni boshqaring"}
                                </small>
                            </div>

                            <span className="settings-arrow">
                                ›
                            </span>
                        </Link>

                        <div className="settings-item">
                            <div className="settings-icon">
                                🔐
                            </div>

                            <div className="settings-content">
                                <strong>
                                    {t("security")}
                                </strong>

                                <small>
                                    {language === "ru"
                                        ? "Безопасность вашего аккаунта"
                                        : "Akkauntingiz xavfsizligi"}
                                </small>
                            </div>

                            <span className="settings-soon">
                                {t("soon")}
                            </span>
                        </div>
                    </div>
                </section>

                {/* PREFERENCES */}
                <section className="settings-section">
                    <h2>{t("preferences")}</h2>

                    <div className="settings-card">

                        {/* NOTIFICATIONS */}
                        <div className="settings-item">
                            <div className="settings-icon">
                                🔔
                            </div>

                            <div className="settings-content">
                                <strong>
                                    {t("notifications")}
                                </strong>

                                <small>
                                    {language === "ru"
                                        ? "Получайте уведомления о заказах и новостях"
                                        : "Buyurtma va yangiliklar haqida xabar olish"}
                                </small>
                            </div>

                            <button
                                type="button"
                                className={`settings-switch ${notifications
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setNotifications(
                                        !notifications
                                    )
                                }
                                aria-label={t(
                                    "notifications"
                                )}
                            >
                                <span />
                            </button>
                        </div>

                        {/* LANGUAGE */}
                        <div className="settings-item">
                            <div className="settings-icon">
                                🌐
                            </div>

                            <div className="settings-content">
                                <strong>
                                    {language === "ru"
                                        ? "Язык"
                                        : "Til"}
                                </strong>

                                <small>
                                    {t("chooseLanguage")}
                                </small>
                            </div>

                            <select
                                className="settings-select"
                                value={language}
                                onChange={(e) =>
                                    setLanguage(
                                        e.target.value as
                                        | "uz"
                                        | "ru"
                                    )
                                }
                            >
                                <option value="uz">
                                    O‘zbekcha
                                </option>

                                <option value="ru">
                                    Русский
                                </option>
                            </select>
                        </div>
                    </div>
                </section>
                {/* DELIVERY */}
                <section className="settings-section">
                    <h2>
                        {language === "ru"
                            ? "Доставка"
                            : "Yetkazib berish"}
                    </h2>

                    <div className="settings-card">

                        {/* LOCATION */}
                        <div className="settings-item">
                            <div className="settings-icon">
                                📍
                            </div>

                            <div className="settings-content">
                                <strong>
                                    {language === "ru"
                                        ? "Город"
                                        : "Shahar"}
                                </strong>

                                <small>
                                    {language === "ru"
                                        ? "Выберите город доставки"
                                        : "Yetkazib berish shahrini tanlang"}
                                </small>
                            </div>

                            <select
                                className="settings-select"
                                value={city}
                                onChange={(e) => {
                                    const selectedCity =
                                        e.target.value;

                                    setCity(selectedCity);

                                    localStorage.setItem(
                                        "deliveryCity",
                                        selectedCity
                                    );
                                }}
                            >
                                <option value="Toshkent">
                                    {language === "ru"
                                        ? "Ташкент"
                                        : "Toshkent"}
                                </option>

                                <option value="Boshqa">
                                    {language === "ru"
                                        ? "Другой город"
                                        : "Boshqa shahar"}
                                </option>
                            </select>
                        </div>

                        {/* DELIVERY INFO */}
                        <details className="settings-delivery-details">
                            <summary className="settings-item">
                                <div className="settings-icon">
                                    🚚
                                </div>

                                <div className="settings-content">
                                    <strong>
                                        {language === "ru"
                                            ? "Доставка"
                                            : "Yetkazib berish"}
                                    </strong>

                                    <small>
                                        {language === "ru"
                                            ? "Доставка по Ташкенту"
                                            : "Toshkent shahri bo‘ylab yetkazib berish"}
                                    </small>
                                </div>

                                <span className="settings-arrow">
                                    ›
                                </span>
                            </summary>

                            <div className="settings-delivery-content">
                                <div className="delivery-info-row">
                                    <span>
                                        📍{" "}
                                        {language === "ru"
                                            ? "Город"
                                            : "Shahar"}
                                    </span>

                                    <strong>
                                        {city}
                                    </strong>
                                </div>

                                <div className="delivery-info-row">
                                    <span>
                                        🚚{" "}
                                        {language === "ru"
                                            ? "Доставка"
                                            : "Yetkazib berish"}
                                    </span>

                                    <strong>
                                        {language === "ru"
                                            ? "По Ташкенту"
                                            : "Toshkent bo‘ylab"}
                                    </strong>
                                </div>

                                <div className="delivery-info-row">
                                    <span>
                                        💰{" "}
                                        {language === "ru"
                                            ? "Стоимость"
                                            : "Yetkazib berish narxi"}
                                    </span>

                                    <strong>
                                        {language === "ru"
                                            ? "Рассчитывается при оформлении"
                                            : "Buyurtma vaqtida hisoblanadi"}
                                    </strong>
                                </div>

                                <p className="delivery-note">
                                    {language === "ru"
                                        ? "Адрес доставки указывается при оформлении заказа."
                                        : "Yetkazib berish manzili buyurtmani rasmiylashtirish vaqtida kiritiladi."}
                                </p>
                            </div>
                        </details>
                        <div className="delivery-address">
                            <label>
                                {language === "ru"
                                    ? "Адрес доставки"
                                    : "Yetkazib berish manzili"}
                            </label>

                            <textarea
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                }}
                                placeholder={
                                    language === "ru"
                                        ? "Например: Ташкент, Чиланзар, дом 10"
                                        : "Masalan: Toshkent, Chilonzor, 10-uy"
                                }
                                rows={3}
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
                                ✓{" "}
                                {language === "ru"
                                    ? "Сохранить адрес"
                                    : "Manzilni saqlash"}
                            </button>
                        </div>
                    </div>
                </section>
                {/* HELP */}
                <section className="settings-section">
                    <h2>{t("help")}</h2>

                    <div className="settings-card">

                        <Link
                            to="/help"
                            className="settings-item"
                        >
                            <div className="settings-icon">
                                ❓
                            </div>

                            <div className="settings-content">
                                <strong>
                                    {t("helpCenter")}
                                </strong>

                                <small>
                                    {t("questionsHelp")}
                                </small>
                            </div>

                            <span className="settings-arrow">
                                ›
                            </span>
                        </Link>

                        <div className="settings-item">
                            <div className="settings-icon">
                                ℹ️
                            </div>

                            <div className="settings-content">
                                <strong>
                                    Ofiyat Market
                                </strong>

                                <small>
                                    {t("aboutApp")}
                                </small>
                            </div>

                            <span className="settings-version">
                                v1.0.0
                            </span>
                        </div>
                    </div>
                </section>

                {/* LOGOUT */}
                <button
                    type="button"
                    className="settings-logout"
                    onClick={handleLogout}
                >
                    <span>🚪</span>
                    {t("logout")}
                </button>
            </div>
        </main>
    );
}