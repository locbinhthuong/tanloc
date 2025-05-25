import { useState } from 'react';
import axios from 'axios';
import { UserCircleIcon, LockClosedIcon, EnvelopeIcon, InformationCircleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('/api/login', {
                email,
                password,
            });
    
            if (response.data.status === 'success') {
                setSuccess('Đăng nhập thành công!');
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('authToken', response.data.token); // Lưu token vào localStorage
                const role = response.data.role;
                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'user') {
                    navigate('/products');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center space-y-6">
                <h2 className="text-4xl font-extrabold text-pink-500 tracking-wide">
                    💖 Chào mừng đến với cửa hàng! 💖
                </h2>
                <p className="text-gray-500 text-sm">
                    Vui lòng đăng nhập để trải nghiệm những sản phẩm tốt nhất.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ email</label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center text-red-600 bg-red-100 p-3 rounded-xl">
                            <InformationCircleIcon className="w-5 h-5 mr-2 text-red-500" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center text-green-600 bg-green-100 p-3 rounded-xl">
                            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 flex items-center justify-center text-white rounded-xl font-medium 
                            ${loading ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 transition'}`}
                    >
                        {loading && <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        {loading ? 'Đang xử lý...' : 'Truy Cập Hệ Thống'}
                    </button>

                    <p className="text-gray-600 text-sm">
                        Chưa có tài khoảnnnnn,,,,,?{' '}
                        <a href="/register" className="text-pink-500 font-medium hover:underline">Đăng ký ngay</a>
                    </p>
                </form>
            </div>
        </div>
    );
}