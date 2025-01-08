import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import instance from "../../axios";
import { useForm } from "react-hook-form";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  console.log(categories);

  const { register, handleSubmit, reset } = useForm();

  const getAllCategory = async () => {
    try {
      const { data } = await instance.get("category/categories");
      if (data) {
        setCategories(data.categories);
      }
    } catch (error) {
      toast.error("Category olishda xatolik bor");
      console.log("Category", error);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      console.log(formData)
      formData.append("image", file);
      const response = await instance.post("/category/category-image", formData);
      console.log(response)
      return response.data.url;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Image upload failed");
    }
  };
  

  const createCategory = async (categoryData) => {
    try {
      const data = {...categoryData}
      const response = await instance.post("category/categories", data);
      console.log("Response Data:", response.data);
      toast.success(`${data.name} qo'shildi`);
      getAllCategory();
    } catch (error) {
      toast.error("Category yaratishda xatolik bor");
      console.log("Create Error:", error.response || error.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      // Faylni yuborish (faqat image)
      const file = data.image[0];
      if (file) {
        imageUrl = await uploadImage(file);
      }

      const categoryData = {
        name: data.name,
        image: imageUrl,
      };

      await createCategory(categoryData);
      reset();
    } catch (error) {
      toast.error("Category yaratishda xatolik bor");
      console.log(error);
    }
  };

  const deleteCategory = async(id) => {
    try {
      const {data} = await instance.delete(`category/categories/${id}`)
      if(data){
        getAllCategory()
        toast.success(`${data.newCategory.name} o'chirildi`);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <>
      <div className=" mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Categories
        </h1>
        <form
          className="w-full flex items-center gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 outline-none"
            type="text"
            placeholder="New Category"
            {...register("name", { required: true })}
          />
          <input type="file" {...register("image", { required: true })} />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Category
          </button>
        </form>
      </div>

      <div className=" mx-auto bg-white shadow-lg rounded-lg p-6 mt-3">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          All Categories
        </h1>
        <div className="space-y-4">
          {categories.map((c) => {
            // console.log(c)
            return (

              <div
                key={c._id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm"
              >
                <div>
                  <img src={`http://localhost:9000/images/${c.image}`} alt="img" />
                  <h2 className="text-lg font-medium text-gray-800">{c.name}</h2>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
                    Edit
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition" onClick={() => deleteCategory(c._id)}>
                    Delete
                  </button>
                </div>
              </div>
            )
          }
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;
