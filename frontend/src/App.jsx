import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProductHome from "./components/ProductHome";
import Cart from "./components/Cart";
import AdminHome from "./components/AdminHome";

const LoadingScreen = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
    </div>
);

const ProtectedRoute = ({ element, allowedRoles, redirectPath = "/login" }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && allowedRoles.includes(user.role) ? element : <Navigate to={redirectPath} replace />;
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserAuthentication = useCallback(() => {
        try {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        } catch (error) {
            console.error("Authentication check error:", error);
            localStorage.removeItem("user");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkUserAuthentication();
    }, [checkUserAuthentication]);

    const handleLoginSuccess = useCallback((userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    if (loading) return <LoadingScreen />;

    const isLoggedIn = !!user;
    const isAdmin = user?.role === "admin";

    return (
        <Router>
            <Routes>
                <Route 
                    path="/login" 
                    element={isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
                />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/products" replace /> : <Register />} />
                <Route path="/products" element={<ProductHome user={user} onLogout={handleLogout} />} />
                <Route path="/cart" element={<ProtectedRoute element={<Cart user={user} onLogout={handleLogout} />} allowedRoles={["user", "admin"]} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard user={user} onLogout={handleLogout} />} allowedRoles={["user", "admin"]} />} />
                <Route path="/admin" element={<ProtectedRoute element={<AdminHome user={user} onLogout={handleLogout} />} allowedRoles={["admin"]} redirectPath="/products" />} />
                <Route path="/adminhome" element={<Navigate to="/admin" replace />} />
                <Route path="/" element={<Navigate to={isLoggedIn ? (isAdmin ? "/admin" : "/dashboard") : "/login"} replace />} />
                <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
