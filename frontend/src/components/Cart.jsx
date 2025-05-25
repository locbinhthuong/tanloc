import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

export default function Cart() {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const updateQuantity = (id, amount) => {
        setCart(cart.map(item => 
            item.id === id ? { ...item, quantity: Math.max(item.quantity + amount, 1) } : item
        ));
    };

    const removeItem = (id) => setCart(cart.filter(item => item.id !== id));
    const clearCart = () => setCart([]);
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-pink-50 p-6">
            {/* 🏆 Header */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center border-l-8 border-pink-300">
                <h2 className="text-2xl font-bold flex items-center text-pink-700">
                    <ShoppingCartIcon className="w-7 h-7 text-pink-500 mr-2" />
                    Giỏ hàng của bạn
                </h2>
                <Link to="/products" className="bg-pink-500 text-white py-2 px-5 rounded-lg shadow hover:bg-pink-600 transition">
                    ⬅ Tiếp tục mua hàng
                </Link>
            </div>

            {/* 🛒 Danh sách sản phẩm */}
            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                {cart.length === 0 ? (
                    <div className="text-center text-pink-500">
                        <p className="text-lg font-semibold">🛍 Giỏ hàng của bạn đang trống</p>
                        <Link to="/products" className="mt-4 inline-block text-pink-600 font-medium hover:underline">
                            ⬅ Quay lại trang sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                {/* 🖼 Hình ảnh sản phẩm */}
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-lg border border-pink-200" />
                                    <div>
                                        <p className="text-lg font-semibold text-pink-700">{item.name}</p>
                                        <p className="text-pink-500">{item.price.toLocaleString()} VNĐ</p>
                                    </div>
                                </div>
                                {/* 🔢 Điều chỉnh số lượng */}
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => updateQuantity(item.id, -1)} 
                                        className="p-2 bg-pink-200 rounded-lg hover:bg-pink-300 transition"
                                    >
                                        <MinusIcon className="w-5 h-5 text-pink-700" />
                                    </button>
                                    <span className="text-lg font-medium text-pink-700">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, 1)} 
                                        className="p-2 bg-pink-200 rounded-lg hover:bg-pink-300 transition"
                                    >
                                        <PlusIcon className="w-5 h-5 text-pink-700" />
                                    </button>
                                </div>
                                {/* 💰 Thành tiền */}
                                <p className="text-lg font-medium text-pink-700">{(item.price * item.quantity).toLocaleString()} VNĐ</p>
                                {/* 🗑 Nút xóa */}
                                <button 
                                    onClick={() => removeItem(item.id)} 
                                    className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 🏦 Tổng tiền và thanh toán */}
            {cart.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                    <div className="flex justify-between text-lg font-semibold text-pink-700">
                        <span>Tổng tiền:</span>
                        <span className="text-pink-600">{totalAmount.toLocaleString()} VNĐ</span>
                    </div>
                    {/* 🚀 Nút thanh toán */}
                    <button className="w-full mt-4 bg-pink-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-pink-600 transition">
                        🛒 Tiến hành thanh toán
                    </button>
                    {/* 🗑 Nút xóa tất cả */}
                    <button 
                        onClick={clearCart} 
                        className="w-full mt-4 bg-pink-400 text-white py-3 rounded-lg text-lg font-medium hover:bg-pink-500 transition"
                    >
                        ❌ Xóa tất cả
                    </button>
                </div>
            )}
        </div>
    );
}
