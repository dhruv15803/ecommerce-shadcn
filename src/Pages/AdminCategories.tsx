import { GlobalContext, ProductCategory, backendUrl } from "@/App";
import AdminProductCategoryCard from "@/components/AdminProductCategoryCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { SetStateAction, useContext, useState } from "react";

const AdminCategories = () => {
  const [productCategoryName, setProductCategoryName] = useState<string>("");
  const [productCategoryError, setProductCategoryError] = useState<string>("");
  const {
    productCategories,
    setProductCategories,
  }: {
    productCategories: ProductCategory[] | [];
    setProductCategories: React.Dispatch<
      SetStateAction<ProductCategory[] | []>
    >;
  } = useContext(GlobalContext);

  

  const addProductCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        if (productCategoryName.trim() === "") {
            setProductCategoryError("Please enter the required fields");
            setTimeout(() => {
              setProductCategoryError("");
            }, 5000);
            return;
          }
          const response = await axios.post(
            `${backendUrl}/product/addProductCategory`,
            {
              productCategoryName,
            },
            { withCredentials: true }
          );
          setProductCategories((prev) => [...prev, response.data.newCategory]);
          setProductCategoryName("");
    } catch (error:any) {
        console.log(error);
        setProductCategoryError(error.response.data.message);
        setTimeout(() => {
            setProductCategoryError("");
        },5000)
    }
  };

  return (
    <>
      <div className="border-2 rounded-lg p-2 m-10 flex flex-col shadow-lg">
        <div className="text-2xl font-semibold">Add category</div>
        <form
          onSubmit={(e) => addProductCategory(e)}
          className="flex flex-col gap-2 my-4"
        >
          <label htmlFor="productCategoryName">Enter category</label>
          <input
            value={productCategoryName}
            onChange={(e) => setProductCategoryName(e.target.value)}
            className="border-2 rounded-lg p-2"
            type="text"
            name="productCategoryName"
            id="productCategoryName"
            placeholder="eg:men's clothing"
          />
          <div className="text-red-500">{productCategoryError}</div>
          <Button>Add category</Button>
        </form>
        <div className="flex flex-col gap-4">
          {productCategories?.map((category) => {
            return (
              <AdminProductCategoryCard
                key={category._id}
                id={category._id}
                productCategoryName={category.productCategoryName}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminCategories;
