import { useEffect, useState } from "react";
import instance from "../axios";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]); 
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    getAllCategories();
  }, []);

  // Handle products loading based on filters
  useEffect(() => {
    if (isFiltering) {
      filterProducts();
    } else {
      productList();
    }
  }, [page, isFiltering]);

  const getAllCategories = async () => {
    try {
      const { data } = await instance.get("/category/categories");
      if (data) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const productList = async () => {
    try {
      const { data } = await instance.get(
        `/product/product-pagination?page=${page}`
      );
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryFilter = (value, id) => {
    let updatedChecked;
    if (value) {
      updatedChecked = [...checked, id];
    } else {
      updatedChecked = checked.filter((c) => c !== id);
    }
    setChecked(updatedChecked);
    setIsFiltering(updatedChecked.length > 0 || minPrice > 0 || maxPrice < 1000000);
    setPage(1); // Reset to first page when filtering
  };
  

  const handlePriceChange = (type, value) => {
    const numValue = Number(value);
    if (type === 'min') {
      setMinPrice(numValue);
    } else {
      setMaxPrice(numValue);
    }
    setIsFiltering(checked.length > 0 || numValue > 0 || (type === 'min' ? maxPrice < 1000000 : numValue < 1000000));
    setPage(1); // Reset to first page when filtering
  };

  const filterProducts = async () => {
    try {
      const { data } = await instance.get("/product/filter-product", {
        params: {
          category: checked.join(","), // Categories as a comma-separated string
          minPrice,
          maxPrice,
          page, // Include pagination
        },
      });
      if (data) {
        setProducts(data.filterProducts);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };
  

  const handleApplyFilters = () => {
    setIsFiltering(true);
    setPage(1);
    filterProducts();
  };

  const clearFilters = () => {
    setChecked([]);
    setMinPrice(0);
    setMaxPrice(1000000);
    setIsFiltering(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
        All Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Filters</h2>

          <div className="mb-4">
            <h3 className="text-gray-700 font-medium mb-2">Category</h3>
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={cat._id}
                  value={cat._id}
                  onChange={(e) =>
                    handleCategoryFilter(e.target.checked, cat._id) 
                  }
                  checked={checked.includes(cat._id)} 
                  className="mr-2"
                />
                <label htmlFor={cat._id} className="text-gray-700">
                  {cat.name}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full p-2 border rounded-md"
                min="0"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Apply Filters
            </button>
            {isFiltering && (
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <img
                  className="w-full h-48 object-cover"
                  src={`https://backend-fuom.onrender.com/images/${product.image}`}
                  alt={product.name}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {product.description.substring(0, 50)}...
                  </p>
                  <p className="text-gray-800 font-bold mt-2">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No products available.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md mr-2 disabled:opacity-50"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md ml-2 disabled:opacity-50"
          onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;