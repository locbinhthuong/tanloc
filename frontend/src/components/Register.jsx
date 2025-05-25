import { useState } from 'react';
import axios from 'axios';
import {
    CheckCircleIcon,
    InformationCircleIcon,
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    ArrowPathIcon,
    PencilIcon,
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/register', { username, email, password });
            if (response.data.status === 'success') {
                setSuccess('Đăng ký thành công!');
                setTimeout(() => navigate('/login'), 1000); // Navigate to login
            }
        } catch (err) {
            setError(
                err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join('\n')
                    : 'Có lỗi xảy ra'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl transition-transform transform hover:scale-[1.02]">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Tạo tài khoản</h2>
                    <p className="text-sm text-gray-500">Vui lòng điền thông tin đăng ký</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {[
                        { label: 'Họ và tên', type: 'text', value: username, setValue: setUsername, icon: UserIcon },
                        { label: 'Địa chỉ email', type: 'email', value: email, setValue: setEmail, icon: EnvelopeIcon },
                        { label: 'Mật khẩu', type: 'password', value: password, setValue: setPassword, icon: LockClosedIcon },
                        { label: 'Xác nhận mật khẩu', type: 'password', value: confirmPassword, setValue: setConfirmPassword, icon: LockClosedIcon },
                    ].map(({ label, type, value, setValue, icon: Icon }, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                            <div className="relative mt-1">
                                <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type={type}
                                    required
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                />
                            </div>
                        </div>
                    ))}

                    {error && (
                        <div className="bg-red-50 p-4 rounded-lg text-sm text-red-600 flex items-center">
                            <InformationCircleIcon className="w-5 h-5 mr-2 text-red-500" />
                            <pre>{error}</pre>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 p-4 rounded-lg text-sm text-green-600 flex items-center">
                            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                            <pre>{success}</pre>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 text-white font-medium rounded-lg flex justify-center items-center gap-2
                            transition-all duration-200 ease-in-out ${
                                loading
                                    ? 'bg-pink-400 cursor-not-allowed'
                                    : 'bg-pink-500 hover:bg-pink-600 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                            }`}
                    >
                        {loading ? (
                            <>
                                <ArrowPathIcon className="animate-spin h-5 w-5" /> Đang xử lý...
                            </>
                        ) : (
                            <>
                                <PencilIcon className="h-5 w-5" /> Đăng ký
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-3">
                        Đã có tài khoản?{' '}
                        <a href="/login" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
                            Đăng nhập
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}