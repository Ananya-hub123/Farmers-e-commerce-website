import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Header from "../../Layouts/Header";
import AdminMenu from "./AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { Select } from "antd";
const { Option } = Select;

function UpdateProduct() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [id, setId] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  //get single product

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/get-product/${params.slug}`
      );
      setId(data.product._id);
      setName(data.product.name);
      setCategory(data.product.category._id);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setDescription(data.product.description);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
        console.log(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went worng in getting category");
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  // delete product
  const handleDelete = async () => {
    try {
       
      const {data} = await axios.delete(`http://localhost:8080/api/v1/product/delete-product/${id}`)
      toast.success(data.message)
      navigate('/dashboard/admin/products')

    } catch (error) {
       console.log(error)
       toast.error('something went wrong')
    }
  };

  //create product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("price", price);
      productData.append("description", description);
      productData.append("quantity", quantity);
      image && productData.append("image", image);
      productData.append("category", category);

      const { data } = await axios.put(
        `http://localhost:8080/api/v1/product/update-product/${id}`,
        productData
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("error in updating the product");
    }
  };
  return (
    <>
      {" "}
      <Header />
      <div className=" flex">
        <AdminMenu />
        <div>
          <h1 className=" text-center items-center text-4xl">Update Product</h1>

          <div className=" text-white px-20 py-10">
            <Select
              className=" columns-md text-black"
              placeholder="Select Category"
              size="large"
              S
              showSearch
              onChange={(value) => {
                setCategory(value);
              }}
              value={category}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
            <div className="mt-6 flex max-w-md gap-x-4 mb-3 text-black">
              <label className="focus:outline-none focus:border-blue-500 border border-gray-300 rounded-md columns-md p-2">
                {image ? image.name : "Upload Product Image"}
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                  autoComplete="off"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Add new category"
                />
              </label>
            </div>
            <div className=" mb-3">
              {image ? (
                <div className=" text-center">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="product image"
                    width={"200px"}
                  />
                </div>
              ) : (
                <div className=" text-center">
                  <img
                    src={`http://localhost:8080/api/v1/product/product-image/${id}`}
                    alt="product image"
                    width={"200px"}
                  />
                </div>
              )}
            </div>

            <div className=" mt-6 flex max-w-md gap-x-4 mb-3 text-black">
              <label className="focus:outline-none focus:border-blue-500 border border-gray-300 rounded-md  columns-md p-0 ">
                <input
                  id="product-name"
                  name="product-name"
                  value={name}
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-inset  sm:text-sm sm:leading-6"
                  placeholder="Product Name"
                />
              </label>
            </div>

            <div className=" mt-6 flex max-w-md gap-x-4 mb-3 text-black">
              <label className="focus:outline-none focus:border-blue-500 border border-gray-300 rounded-md  columns-md p-0 ">
                <input
                  id="product-price"
                  value={price}
                  name="product-price"
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                  autoComplete="off"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-inset  sm:text-sm sm:leading-6"
                  placeholder="Product Price"
                />
              </label>
            </div>

            <div className=" mt-6 flex max-w-md gap-x-4 mb-3 text-black">
              <label className="focus:outline-none focus:border-blue-500 border border-gray-300 rounded-md  columns-md p-0 ">
                <textarea
                  cols={60}
                  id="product-description"
                  value={description}
                  name="product-description"
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  autoComplete="off"
                  required
                  className="min-w-0   col-span-9 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-inset  sm:text-sm sm:leading-6"
                  placeholder="Product description"
                />
              </label>
            </div>

            <div className=" mt-6 flex max-w-md gap-x-4 mb-3 text-black">
              <label className="focus:outline-none focus:border-blue-500 border border-gray-300 rounded-md  columns-md p-0 ">
                <input
                  id="product-quantity"
                  value={quantity}
                  name="product-quantity"
                  type="number"
                  onChange={(e) => setQuantity(e.target.value)}
                  autoComplete="off"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-inset  sm:text-sm sm:leading-6"
                  placeholder="Product quantity"
                />
              </label>
            </div>

            <div className=" mb-3">
              <label className="focus:outline-none focus:border-blue-500 border border-gray-300 rounded-md  columns-md p-1 ">
                <Select
                  bordered={false}
                  className=" columns-md"
                  placeholder=" Select Shipping"
                  showSearch
                  onChange={(value) => {
                    setShipping(value);
                  }}
                  value={shipping ? "Yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </label>
            </div>
            <div className="flex justify- justify-around">
            <button
              type="submit"
              className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={handleUpdate}
            >
              update Product
            </button>
           
            <button
              type="submit"
              className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={handleDelete}
            >
              Delete Product
            </button>
          </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default UpdateProduct;
