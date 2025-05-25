import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    CogIcon,
    UserIcon,
    UserGroupIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
        username: "",
        email: "",
    });
    const [updateError, setUpdateError] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) setCurrentUser(JSON.parse(user));
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setUsers(response.data);
        } catch (error) {
            setError("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.delete(`/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                setUsers(users.filter(user => user.id !== userId));
            }
        } catch (err) {
            alert(err.response?.data?.message || "Có lỗi xảy ra khi xóa");
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenUpdateModal = (user) => {
        setSelectedUser(user);
        setUpdateFormData({ username: user.username, email: user.email });
        setIsUpdateModalOpen(true);
        setUpdateError("");
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedUser(null);
        setUpdateFormData({ username: "", email: "" });
        setUpdateError("");
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData({ ...updateFormData, [name]: value });
    };

    const handleUpdateUser = async () => {
        setActionLoading(true);
        setUpdateError("");
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(`/api/users/${selectedUser.id}`, updateFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status === "success") {
                setUsers(users.map(user =>
                    user.id === selectedUser.id ? response.data.user : user
                ));
                handleCloseUpdateModal();
            } else {
                setUpdateError(response.data.message || "Có lỗi khi cập nhật thông tin.");
            }
        } catch (error) {
            setUpdateError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-100">
            {/* 🔹 Navbar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-pink-600 flex items-center">
                            <CogIcon className="w-6 h-6 mr-2 text-pink-400" />
                            Quản lý tài khoản
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 flex items-center">
                            <UserIcon className="w-5 h-5 text-gray-500 mr-1" />
                            {currentUser?.username || "User"}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </nav>

            {/* 🔹 Main Content */}
            <div className="max-w-7xl mx-auto py-6">
                {/* 🔹 Stats Card */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-pink-200 text-pink-600 rounded-full">
                            <UserGroupIcon className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tổng số người dùng</p>
                            <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                        </div>
                    </div>
                    <div>
                        <Link
                            to="/AdminHome"
                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 inline-block"
                        >
                            ← Quay lại Quản lý sản phẩm
                        </Link>
                    </div>
                </div>

                {/* 🔹 Users Table */}
                <div className="bg-white shadow-lg rounded-lg mt-6">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900 text-center">Danh sách người dùng</h3>
                    </div>
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-4 text-red-500">{error}</div>
                    ) : (
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-pink-100 text-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Ngày tạo</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-pink-50">
                                        <td className="px-6 py-4 text-sm">{user.id}</td>
                                        <td className="px-6 py-4 text-sm">{user.username}</td>
                                        <td className="px-6 py-4 text-sm">{user.email}</td>
                                        <td className="px-6 py-4 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => handleOpenUpdateModal(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <CogIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* 🔹 Update User Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng</h2>
                        {updateError && <p className="text-red-500 mb-2">{updateError}</p>}
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                                Tên người dùng:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={updateFormData.username}
                                onChange={handleUpdateInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={updateFormData.email}
                                onChange={handleUpdateInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseUpdateModal}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateUser}
                                disabled={actionLoading}
                                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${actionLoading && 'opacity-50 cursor-not-allowed'}`}
                            >
                                {actionLoading ? "Đang cập nhật..." : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}