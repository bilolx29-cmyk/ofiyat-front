import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

type Language = "uz" | "ru";

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
    uz: {
        home: "Bosh sahifa",
        catalog: "Katalog",
        search: "Qidirish",
        cart: "Savatcha",
        profile: "Profil",
        settings: "Sozlamalar",
        help: "Yordam",
        orders: "Buyurtmalarim",
        favorites: "Sevimlilar",

        products: "Mahsulotlar",
        allProducts: "Barcha mahsulotlar",
        addToCart: "Savatchaga qo‘shish",
        buyNow: "Hozir xarid qilish",

        checkout: "Buyurtmani rasmiylashtirish",
        order: "Buyurtma",
        total: "Jami",
        delivery: "Yetkazib berish",

        account: "Akkaunt",
        profileInfo: "Profil ma’lumotlari",
        security: "Xavfsizlik",

        preferences: "Afzalliklar",
        notifications: "Bildirishnomalar",
        chooseLanguage: "Ilova tilini tanlang",

        helpCenter: "Yordam markazi",
        questionsHelp: "Savollar va yordam",
        aboutApp: "Ilova haqida",

        logout: "Chiqish",
        soon: "Tez orada",
    },

    ru: {
        home: "Главная",
        catalog: "Каталог",
        search: "Поиск",
        cart: "Корзина",
        profile: "Профиль",
        settings: "Настройки",
        help: "Помощь",
        orders: "Мои заказы",
        favorites: "Избранное",

        products: "Товары",
        allProducts: "Все товары",
        addToCart: "Добавить в корзину",
        buyNow: "Купить сейчас",

        checkout: "Оформление заказа",
        order: "Заказ",
        total: "Итого",
        delivery: "Доставка",

        account: "Аккаунт",
        profileInfo: "Данные профиля",
        security: "Безопасность",

        preferences: "Настройки",
        notifications: "Уведомления",
        chooseLanguage: "Выберите язык приложения",

        helpCenter: "Центр помощи",
        questionsHelp: "Вопросы и помощь",
        aboutApp: "О приложении",

        logout: "Выйти",
        soon: "Скоро",
    },
};

const LanguageContext =
    createContext<LanguageContextType | undefined>(
        undefined
    );

export function LanguageProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [language, setLanguageState] =
        useState<Language>(() => {
            const saved =
                localStorage.getItem("appLanguage");

            return saved === "ru" ? "ru" : "uz";
        });

    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage);

        localStorage.setItem(
            "appLanguage",
            newLanguage
        );
    };

    useEffect(() => {
        const handleLanguageChange = () => {
            const saved =
                localStorage.getItem("appLanguage");

            setLanguageState(
                saved === "ru" ? "ru" : "uz"
            );
        };

        window.addEventListener(
            "languageChanged",
            handleLanguageChange
        );

        return () => {
            window.removeEventListener(
                "languageChanged",
                handleLanguageChange
            );
        };
    }, []);

    const t = (key: string) => {
        return (
            translations[language][key] ||
            translations.uz[key] ||
            key
        );
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage LanguageProvider ichida ishlatilishi kerak"
        );
    }

    return context;
}