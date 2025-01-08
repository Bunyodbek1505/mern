import "./App.css";
import { Routes, Route } from "react-router-dom";
import Products from "./pages/dashboard/Products";
import CreateProduct from "./pages/dashboard/CreateProduct";
import UpdateProduct from "./pages/dashboard/UpdateProduct";
import SingleProduct from "./pages/dashboard/SingleProduct";
import NotFoundPage from "./pages/dashboard/NotFoundPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/routes/PrivateRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Categories from "./pages/dashboard/Categories";

function App() {
  return (
    <>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard/>}/>
            <Route path="/products" element={<Products />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/update-product" element={<UpdateProduct />} />
            <Route path="/single-product" element={<SingleProduct />} />
            <Route path="/category" element={<Categories/>}/>
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
