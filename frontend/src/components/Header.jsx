import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function Header({ cartCount, onSearch }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login'); // Use navigate to redirect
    };

    return (
        <header className="bg-gradient-to-r from-pink-500 to-pink-400 shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-extrabold text-white hover:scale-105 transition">
                    🛍️ Linh Kiện Store
                </Link>
                <div className="relative w-1/3">
                    <input
                        type="text"
                        onChange={(e) => onSearch(e.target.value.trim())}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full pl-12 pr-4 py-2 rounded-full bg-white text-gray-900 shadow-md border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center space-x-4">
                    <Link
                        to="/cart"
                        className="relative flex items-center space-x-2 text-white font-semibold hover:scale-105 transition"
                    >
                        <ShoppingCartIcon className="w-7 h-7" />
                        <span className="text-lg">({cartCount})</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-white text-pink-500 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-pink-100 transition"
                    >
                        <span>Đăng Xuất</span>
                    </button>
                </div>
            </div>
        </header>
    );
}