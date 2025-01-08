/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import instance from "../../axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewImage, setPreviewImage] = useState(""); // Fayl preview uchun

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const getAllProduct = async () => {
    try {
      const { data } = await instance.get("/product/products");
      if (data) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error("Productlarni olishda xatolik bor");
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { data } = await instance.delete(`/product/products/${id}`);
      if (data) {
        toast.success("Product o'chirildi");
        getAllProduct();
      }
    } catch (error) {
      toast.error("Productlarni olishda xatolik bor");
      console.log(error);
    }
  };

  const updateProduct = async (formData) => {
    try {
      // Fayl uchun form-data ni tayyorlang
      const imageFile = watch("image")[0]; // Birinchi faylni olamiz
      let imageUrl = editProduct.image; // Agar yangi fayl tanlanmagan bo'lsa, avvalgi URL qoldiriladi

      if (imageFile) {
        const imgData = new FormData();
        imgData.append("image", imageFile);

        const uploadResponse = await instance.post("/product/upload", imgData); // Fayl yuklash API
        if (uploadResponse.data && uploadResponse.data.url) {
          imageUrl = uploadResponse.data.url; // Yuklangan rasm URL
        }
      }

      // To'liq ma'lumotni JSON ko'rinishida yuboramiz
      const updatedProduct = { ...formData, image: imageUrl };
      const { data: responseData } = await instance.put(
        `/product/products/${editProduct._id}`,
        updatedProduct
      );

      if (responseData) {
        toast.success("Product yangilandi");
        setModalOpen(false);
        getAllProduct();
      }
    } catch (error) {
      toast.error("Product yangilashda xatolik bor");
      console.log(error);
    }
  };

  // Fayl preview ni yangilash uchun useEffect
  useEffect(() => {
    const imageFile = watch("image")?.[0]; // Faylni kuzatish
    if (imageFile && imageFile instanceof Blob) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewImage(fileReader.result); // Yangi previewni o‘rnatish
      };
      fileReader.readAsDataURL(imageFile);
    } else if (editProduct) {
      // Fayl tanlanmagan bo'lsa, eski rasmdan foydalanish
      setPreviewImage(editProduct.image);
    }
  }, [watch("image"), editProduct]);

  const openModal = (prd) => {
    setEditProduct(prd);
    setValue("name", prd.name);
    setValue("description", prd.description);
    setValue("price", prd.price);
    setValue("color", prd.color);
    setValue("image", prd.image);
    setModalOpen(true);
    setPreviewImage(prd.image); // Eski rasmni o‘rnatish
  };

  const productList = async () => {
    try {
      const { data } = await instance.get(
        `/product/product-pagination?page=${page}&category=${category}`
      );
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    productList();
  }, [page, category]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prd) => {
          return (
            <div
              key={prd._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                className="w-full h-48 object-cover"
                src={`http://localhost:9000/images/${prd.image}`}
                alt={prd.name}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {prd.name}
                </h2>
                <p className="text-gray-600 text-sm mt-2">{prd.description}</p>
                <h3 className="text-lg font-bold text-blue-600 mt-4">
                  ${prd.price}
                </h3>
                <h4 className="text-sm text-gray-500">Color: {prd.color}</h4>
                <div className="flex gap-3">
                  <button
                    className="bg-green-700 text-white px-6 py-1 rounded-md"
                    onClick={() => openModal(prd)}
                  >
                    edit
                  </button>
                  <button
                    className="bg-red-700 text-white px-6 py-1 rounded-md"
                    onClick={() => deleteProduct(prd._id)}
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* pagination */}
      <div className="flex justify-center mt-8">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md ml-2"
          onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal product */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit(updateProduct)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  {...register("price", { required: "Price is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  type="text"
                  {...register("color", { required: "Color is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.color && (
                  <p className="text-red-500 text-sm">{errors.color.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                {previewImage && (
                  <img
                    src={
                      previewImage.startsWith("data")
                        ? previewImage
                        : `http://localhost:9000/images/${previewImage}`
                    }
                    alt="Preview"
                    className="w-full h-48 object-cover mb-4"
                  />
                )}

                <input
                  type="file"
                  {...register("image")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
