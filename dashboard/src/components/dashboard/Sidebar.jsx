import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('auth');

  const handleLogout = () => {
    localStorage.removeItem('auth'); // Remove authentication data
    navigate('/login'); // Redirect to login page
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/' },
    { name: 'Products', icon: '🛒', path: '/products' },
    { name: 'Category', icon: '👤', path: '/category' },
    { name: 'Create-Product', icon: '📦', path: '/create-product' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-50 shadow-lg">
      <ul className="space-y-2 p-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-bold text-gray-900' : ''
                }`
              }
            >
              <span>{item.icon}</span>
              {item.name}
            </NavLink>
          </li>
        ))}

        {isAuthenticated && (
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full"
            >
              🚪 Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
