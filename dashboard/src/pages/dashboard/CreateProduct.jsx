import { useForm } from "react-hook-form";
import instance from "../../axios";
import { useEffect, useState } from "react";

const CreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getAllCategory = async () => {
    try {
      const { data } = await instance.get("category/categories");
      if (data) {
        setCategories(data.categories);
      } else {
        console.log(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Category fetch error:", error);
      console.log("Something went wrong in Category fetching");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle image upload
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await instance.post("/product/upload", formData);
      return response.data.url;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Image upload failed");
    }
  };

  // Handle product creation
  const createProduct = async (productData) => {
    try {
      const data = {
        ...productData,
        price: Number(productData.price),
      };
      const response = await instance.post("/product/products", data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Product creation failed"
      );
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Upload image first
      let imageUrl = "";
      const file = data.image[0];

      if (file) {
        imageUrl = await uploadImage(file);
      }

      // Prepare product data
      const productData = {
        name: data.name,
        description: data.description,
        color: data.color,
        price: Number(data.price),
        category: data.category,
        image: imageUrl,
      };

      // Create product
      await createProduct(productData);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="bg-gray-100 flex items-center p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Add New Product
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
              {...register("name", { required: "Product name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Product Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="w-full p-3"
              {...register("image", { required: "Product image is required" })}
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
              rows="4"
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              Color
            </label>
            <input
              type="text"
              id="color"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product color"
              {...register("color", { required: "Color is required" })}
            />
            {errors.color && (
              <p className="text-red-500 text-sm">{errors.color.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product price"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select a category</option>
                {categories && categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No categories available
                  </option>
                )}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
