import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminHome() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isAdding, setIsAdding] = useState(false); // State để kiểm soát hiển thị form thêm sản phẩm

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        image: "",
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token được lấy từ localStorage:", token); // Thêm dòng này
            const response = await axios.get("/api/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
            setError("Không thể tải danh sách sản phẩm.");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            image: e.target.files[0],
        }));
    };

    const handleAddProduct = () => {
        setIsAdding(true);
        setFormData({ name: "", description: "", price: "", quantity: "", image: "" });
        setError(null);
        setSuccessMessage(null);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('quantity', formData.quantity);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await axios.post("/api/products", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Quan trọng để gửi file
                },
            });
            setSuccessMessage("Thêm sản phẩm thành công.");
            setError(null);
            setIsAdding(false);
            fetchProducts(); // Tải lại danh sách sản phẩm
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            setError("Thêm sản phẩm thất bại.");
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            image: product.image, // Có thể cần xử lý khác nếu muốn cập nhật ảnh
        });
        setEditMode(true);
        setIsAdding(false);
        setError(null);
        setSuccessMessage(null);
    };

    const handleUpdate = async () => {
        if (isUpdating) return;
        setIsUpdating(true);

        try {
            const token = localStorage.getItem("token");
            await axios.put(`/api/products/${selectedProduct.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
            setEditMode(false);
            setSuccessMessage("Cập nhật sản phẩm thành công.");
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            setError("Cập nhật thất bại.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
            setSuccessMessage("Xóa sản phẩm thành công.");
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            setError("Xóa thất bại.");
        }
    };

    if (loading) return <div className="text-center text-lg font-semibold">Đang tải...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <nav className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-700">Quản lý sản phẩm</h2>
                <Link to="/dashboard" className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400">
                    Quản lý người dùng
                </Link>
            </nav>

            {error && <div className="text-red-500 text-center mb-2 font-semibold">{error}</div>}
            {successMessage && <div className="text-green-500 text-center mb-2 font-semibold">{successMessage}</div>}

            <div className="mb-4">
                <button onClick={handleAddProduct} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Thêm sản phẩm mới
                </button>
            </div>

            {isAdding && (
                <div className="mb-6 p-4 border rounded-md shadow-sm bg-gray-50">
                    <h3 className="text-xl font-semibold mb-3">Thêm sản phẩm mới</h3>
                    <form onSubmit={handleAddSubmit}>
                        <div className="mb-2">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Tên sản phẩm:</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Giá:</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Số lượng:</label>
                            <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh:</label>
                            <input type="file" id="image" name="image" onChange={handleImageChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mr-2">Thêm</button>
                            <button type="button" onClick={handleCancelAdd} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-md rounded-md">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="border p-3">Tên sản phẩm</th>
                            <th className="border p-3">Mô tả</th>
                            <th className="border p-3">Giá</th>
                            <th className="border p-3">Số lượng</th>
                            <th className="border p-3">Hình ảnh</th>
                            <th className="border p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="text-center hover:bg-gray-100 transition">
                                    <td className="border p-3">{product.name}</td>
                                    <td className="border p-3 truncate w-64">{product.description}</td>
                                    <td className="border p-3 text-green-600 font-bold">${product.price}</td>
                                    <td className="border p-3">{product.quantity}</td>
                                    <td className="border p-3">
                                        <img src={product.image} alt={product.name} className="w-20 h-20 mx-auto rounded-lg shadow" />
                                    </td>
                                    <td className="border p-3 flex justify-center gap-2">
                                        <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                            Sửa
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500 p-4 font-semibold">Không có sản phẩm nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editMode && selectedProduct && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h3 className="text-xl font-semibold mb-3">Sửa sản phẩm</h3>
                        <form>
                            <div className="mb-2">
                                <label htmlFor="edit-name" className="block text-gray-700 text-sm font-bold mb-2">Tên sản phẩm:</label>
                                <input type="text" id="edit-name" name="name" value={formData.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="edit-description" className="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
                                <textarea id="edit-description" name="description" value={formData.description} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="edit-price" className="block text-gray-700 text-sm font-bold mb-2">Giá:</label>
                                <input type="number" id="edit-price" name="price" value={formData.price} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="edit-quantity" className="block text-gray-700 text-sm font-bold mb-2">Số lượng:</label>
                                <input type="number" id="edit-quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="edit-image" className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh:</label>
                                <input type="file" id="edit-image" name="image" onChange={handleImageChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                {selectedProduct.image && <img src={selectedProduct.image} alt={selectedProduct.name} className="mt-2 w-20 h-20 rounded-lg shadow" />}
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2">Cập nhật</button>
                                <button type="button" onClick={() => setEditMode(false)} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}