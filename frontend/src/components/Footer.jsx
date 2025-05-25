export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-10">
            <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div>
                    <h3 className="text-xl font-bold text-white">🚀 Về chúng tôi</h3>
                    <p className="mt-3 text-sm leading-relaxed">
                        Chuyên cung cấp linh kiện điện tử chính hãng, chất lượng cao.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">📞 Liên hệ</h3>
                    <p className="mt-3 text-sm">📍 123 Đường ABC, TP.HCM</p>
                    <p className="text-sm">
                        📞 Hotline: <span className="text-pink-400 font-semibold">0123 456 789</span>
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">🌐 Kết nối</h3>
                    <div className="flex space-x-5 mt-3">
                        <a href="#" className="hover:text-white transition">
                            📘 Facebook
                        </a>
                        <a href="#" className="hover:text-white transition">
                            💬 Zalo
                        </a>
                        <a href="#" className="hover:text-white transition">
                            🎥 YouTube
                        </a>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm mt-8 text-gray-500 border-t border-gray-700 pt-6">
                © 2025 Linh Kiện Store. All rights reserved.
            </p>
        </footer>
    );
}