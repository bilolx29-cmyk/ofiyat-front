import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/help.css";

const questions = [
    {
        question: "Buyurtmani qanday beraman?",
        answer:
            "Kerakli mahsulotni savatga qo‘shing. Savatga kirib, “Buyurtma berish” tugmasini bosing. Keyin ism, telefon raqam va yetkazib berish manzilingizni kiriting.",
    },
    {
        question: "Yetkazib berish qanday amalga oshiriladi?",
        answer:
            "Hozircha yetkazib berish Toshkent shahri bo‘ylab amalga oshiriladi. Buyurtma berishda aniq manzilingizni kiriting.",
    },
    {
        question: "Yetkazib berish narxi qancha?",
        answer:
            "Yetkazib berish narxi buyurtma va manzilga qarab belgilanadi. Buyurtma berish vaqtida yetkazib berish shartlari ko‘rsatiladi.",
    },
    {
        question: "Buyurtmam holatini qayerdan ko‘raman?",
        answer:
            "Buyurtma berilgandan keyin “Buyurtmalarim” bo‘limiga o‘tib, buyurtmalaringizni ko‘rishingiz mumkin.",
    },
    {
        question: "Buyurtmani bekor qilish mumkinmi?",
        answer:
            "Agar buyurtmangiz hali yetkazib berishga topshirilmagan bo‘lsa, yordam xizmatiga murojaat qilib bekor qilish imkoniyatini aniqlashingiz mumkin.",
    },
    {
        question: "Muammo bo‘lsa kimga murojaat qilaman?",
        answer:
            "Buyurtma yoki mahsulot bilan bog‘liq muammo yuzaga kelsa, Ofiyat Market yordam xizmatiga murojaat qiling.",
    },
];

export default function Help() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex(
            openIndex === index ? null : index
        );
    };

    return (
        <main className="help-page">
            <div className="help-container">

                <div className="help-header">
                    <Link
                        to="/"
                        className="help-back"
                    >
                        ← Bosh sahifa
                    </Link>

                    <div className="help-title">
                        <span>OFIYAT MARKET</span>
                        <h1>Yordam</h1>
                        <p>
                            Savollaringizga javob toping
                        </p>
                    </div>
                </div>

                <section className="help-content">

                    <div className="help-intro">
                        <div className="help-intro-icon">
                            ?
                        </div>

                        <div>
                            <h2>
                                Sizga qanday yordam beramiz?
                            </h2>

                            <p>
                                Quyidagi savollardan birini
                                tanlang va kerakli ma’lumotni
                                oling.
                            </p>
                        </div>
                    </div>

                    <div className="help-list">
                        {questions.map((item, index) => (
                            <div
                                className={`help-item ${openIndex === index
                                        ? "open"
                                        : ""
                                    }`}
                                key={item.question}
                            >
                                <button
                                    type="button"
                                    className="help-question"
                                    onClick={() =>
                                        toggleQuestion(index)
                                    }
                                >
                                    <span>
                                        {item.question}
                                    </span>

                                    <b>
                                        {openIndex === index
                                            ? "−"
                                            : "+"}
                                    </b>
                                </button>

                                {openIndex === index && (
                                    <div className="help-answer">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="help-contact">
                        <div>
                            <h2>
                                Javob topa olmadingizmi?
                            </h2>

                            <p>
                                Biz bilan bog‘laning,
                                yordam berishga tayyormiz.
                            </p>
                        </div>

                        <a
                            href="https://t.me/+998900448004"
                            target="_blank"
                            rel="noreferrer"
                            className="help-contact-btn"
                        >
                            📞 Bog‘lanish
                        </a>
                    </div>

                </section>
            </div>
        </main>
    );
}