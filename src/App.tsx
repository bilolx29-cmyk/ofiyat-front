import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import Help from "./pages/Help";

function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                    <Route
                        path="/orders"
                        element={<Orders />}
                    />

                    <Route
                        path="/reviews"
                        element={<Reviews />}
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetail />}
                    />

                    <Route
                        path="/favorites"
                        element={<Favorites />}
                    />

                    <Route
                        path="/help"
                        element={<Help />}
                    />
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    );
}

export default App;