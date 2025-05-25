import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
    const categories = ['CPU', 'RAM', 'Card đồ họa', 'SSD', 'Mainboard'];
    const location = useLocation(); // Get current location

    return (
        <nav className="bg-gray-100 shadow-sm py-3">
            <div className="container mx-auto flex justify-center space-x-6 text-gray-700">
                {categories.map((category, index) => {
                    const categoryUrl = `/category/${category.toLowerCase()}`;
                    const isActive = location.pathname === categoryUrl;

                    return (
                        <Link
                            key={index}
                            to={categoryUrl}
                            className={`hover:text-blue-600 transition font-medium ${
                                isActive ? 'text-blue-600 font-semibold' : ''
                            }`}
                        >
                            {category}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}