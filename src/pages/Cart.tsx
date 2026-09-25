import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/cart.css";

export default function Cart() {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
    } = useCart();

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">
                <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>

                    <h1>Savatingiz bo‘sh</h1>

                    <p>
                        Hozircha savatingizda mahsulot yo‘q.
                    </p>

                    <Link
                        to="/"
                        className="cart-back-btn"
                    >
                        Mahsulotlarni ko‘rish
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <div>
                        <span>OFIYAT MARKET</span>
                        <h1>Savat</h1>
                    </div>

                    <span className="cart-count">
                        {totalItems} ta mahsulot
                    </span>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <article
                                className="cart-item"
                                key={item.id}
                            >
                                <div className="cart-item-image">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        
                                    />
                                </div>

                                <div className="cart-item-info">
                                    <span className="cart-item-category">
                                        {item.category}
                                    </span>

                                    <h3>{item.name}</h3>

                                    <strong>
                                        {item.price.toLocaleString()} so'm
                                    </strong>
                                </div>

                                <div className="quantity-control">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            decreaseQuantity(item.id)
                                        }
                                    >
                                        −
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            increaseQuantity(item.id)
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="cart-item-total">
                                    <strong>
                                        {(
                                            item.price * item.quantity
                                        ).toLocaleString()}{" "}
                                        so'm
                                    </strong>
                                </div>

                                <button
                                    className="remove-cart-item"
                                    type="button"
                                    onClick={() =>
                                        removeFromCart(item.id)
                                    }
                                    aria-label="Mahsulotni o‘chirish"
                                >
                                    🗑️
                                </button>
                            </article>
                        ))}

                        <button
                            className="clear-cart-btn"
                            type="button"
                            onClick={clearCart}
                        >
                            🗑️ Savatni tozalash
                        </button>
                    </div>

                    <aside className="cart-summary">
                        <h2>Buyurtma</h2>

                        <div className="summary-row">
                            <span>Mahsulotlar:</span>

                            <strong>
                                {totalItems} ta
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>Yetkazib berish:</span>

                            <strong>
                                Hisoblanadi
                            </strong>
                        </div>

                        <div className="summary-line" />

                        <div className="summary-total">
                            <span>Jami:</span>

                            <strong>
                                {totalPrice.toLocaleString()} so'm
                            </strong>
                        </div>

                        <Link
                            to="/checkout"
                            className="checkout-btn"
                        >
                            Buyurtma berish →
                        </Link>

                        <Link
                            to="/"
                            className="continue-shopping"
                        >
                            ← Xaridni davom ettirish
                        </Link>
                    </aside>
                </div>
            </div>
        </main>
    );
}