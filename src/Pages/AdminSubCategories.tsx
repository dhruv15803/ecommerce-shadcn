import {
  GlobalContext,
  ProductCategory,
  ProductSubCategory,
  backendUrl,
} from "@/App";
import AdminProductSubCategoryCard from "@/components/AdminProductSubCategoryCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const AdminSubCategories = () => {
  const { productCategories }: { productCategories: ProductCategory[] } =
    useContext(GlobalContext);
  const [parentCategoryId, setParentCategoryId] = useState<string>(productCategories[0]?._id || "");
  const [subCategories, setSubCategories] = useState<ProductSubCategory[]>([]);
  const [isAddSubCategory, setIsAddSubCategory] = useState<boolean>(false);
  const [subCategory, setSubCategory] = useState<string>("");
  const [subCategoryErrorMsg,setSubCategoryErrorMsg] = useState<string>("");

  const getSubCategoriesByParentCategory = async () => {
    try {
      if (parentCategoryId === "") return;
      const response = await axios.get(
        `${backendUrl}/product/getSubCategoriesByParentCategory/${parentCategoryId}`
      );
      setSubCategories(response.data.subCategories);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  
  const addSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if(parentCategoryId==="") return;
      if(subCategory.trim()==="") {
        setSubCategoryErrorMsg("Please enter the requried fields");
        setTimeout(() => {
          setSubCategoryErrorMsg("");
        },5000)
      }
      const response = await axios.post(`${backendUrl}/product/addSubCategory`,{
        subCategory,
        parentCategoryId,
      },{withCredentials:true});
      console.log(response);
      setSubCategories(prev => [...prev,response.data.newSubCategory]);
      setSubCategory("");
    } catch (error:any) {
      console.log(error);
      setSubCategoryErrorMsg(error.response.data.message);
      setTimeout(() => {
        setSubCategoryErrorMsg("");
      },5000)
    }
  }

  useEffect(() => {
    const setInitialParentCategory = () => {
      if(productCategories.length===0) return;
      setParentCategoryId(productCategories[0]?._id);
    }
    setInitialParentCategory();
  },[productCategories]);

  useEffect(() => {
    getSubCategoriesByParentCategory();
  }, [parentCategoryId]);


  console.log(parentCategoryId);

  return (
    <>
      <div className="border-2 rounded-lg p-4 m-10">
        <div className="text-2xl font-semibold">Add subcategory</div>
        <div className="flex flex-col gap-2 my-4">
          <label htmlFor="parentCategory">Select parent category</label>
          <select
            value={parentCategoryId}
            onChange={(e) => setParentCategoryId(e.target.value)}
            className="border-2 rounded-lg p-2"
            name="parentCategory"
            id="parentCategory"
          >
            {productCategories?.map((category) => {
              return (
                <option key={category._id} value={category._id}>
                  {category.productCategoryName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col gap-4">
          {subCategories?.map((subCategory) => {
            return (
              <AdminProductSubCategoryCard
                key={subCategory._id}
                id={subCategory._id}
                productSubCategoryName={subCategory.productSubCategoryName}
                parentCategory={subCategory.parentCategory}
                subCategories={subCategories}
                setSubCategories={setSubCategories}
              />
            );
          })}
        </div>
        <div className="my-4">
        <Button onClick={() => setIsAddSubCategory(!isAddSubCategory)}>
          {isAddSubCategory ? "Cancel" : "Add"}
        </Button>
        </div>
        {isAddSubCategory && (
          <>
            <form onSubmit={(e) => addSubCategory(e)} className="flex items-center gap-4 my-4">
              <input
                className="border-2 rounded-lg p-2"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                type="text"
                name="subCategory"
                id="subCategory"
              />
              <Button>Add subcategory</Button>
            </form>
            <div className="text-red-500">
              {subCategoryErrorMsg}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminSubCategories;
