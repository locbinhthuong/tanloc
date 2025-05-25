import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../dulieu/data';
import Header from './header';
import Footer from './footer';
import Navigation from './Navigation';

export default function ProductHome() {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300">
            <Header cartCount={cart.length} onSearch={setSearchTerm} />
            <Navigation />
            <main className="container mx-auto px-6 py-10 flex-grow">
                <h2 className="text-5xl font-extrabold text-pink-600 text-center mb-8">
                    🌸 Mua sắm gì chưa người đẹp :)) 🌸
                </h2>
                {filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">Không tìm thấy sản phẩm phù hợp.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

function ProductCard({ product, addToCart }) {
    return (
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden transition transform hover:scale-105 hover:shadow-2xl">
            <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-t-3xl" />
            <div className="p-6">
                <h3 className="text-xl font-semibold text-pink-700">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <p className="text-red-500 font-bold text-2xl mt-2">{product.price.toLocaleString()}đ</p>
                <div className="flex space-x-3 mt-5">
                    <Link
                        to={`/product/${product.id}`}
                        className="flex-1 bg-blue-500 text-white py-3 text-center rounded-full font-bold hover:bg-blue-600 transition"
                    >
                        🔍 Xem chi tiết
                    </Link>
                    <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-green-500 text-white py-3 rounded-full font-bold hover:bg-green-600 transition"
                    >
                        🛒 Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
}