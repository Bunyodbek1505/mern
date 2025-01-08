import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth(); 

  return (
    <header className="flex justify-between p-6">
      <div>
        <h1>Online Shop</h1>
      </div>
      <ul className="flex gap-3">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <button onClick={logout} className="text-blue-500">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;
