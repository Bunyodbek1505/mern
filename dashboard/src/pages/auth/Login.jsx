import { User, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import instance from "../../axios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await instance.post("/auth/login", data);
        // console.log(res.data)
      if (res && res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("auth", res.data.token);
        console.log(res.data.token)
        navigate("/");
      }        
    } catch (error) {
      toast.error("Login da xatolik bor");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="bg-white/90 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          LOGIN
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              {...register("password", { required: "password is required" })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="ml-2 text-gray-600">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Dont have an account?
          <Link
            to={"/register"}
            href="#signup"
            className="text-blue-600 hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
