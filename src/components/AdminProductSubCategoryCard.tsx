import React, { SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { ProductSubCategory, backendUrl } from "@/App";
import axios from "axios";

type AdminProductSubCategoryCardProps = {
  id: string;
  productSubCategoryName: string;
  parentCategory: string;
  subCategories: ProductSubCategory[];
  setSubCategories: React.Dispatch<SetStateAction<ProductSubCategory[]>>;
};

const AdminProductSubCategoryCard = ({
  id,
  productSubCategoryName,
  parentCategory,
  subCategories,
  setSubCategories,
}: AdminProductSubCategoryCardProps) => {
  const [isSubCategoryEdit, setIsSubCategoryEdit] = useState<boolean>(false);
  const [newSubCategory, setNewSubCategory] = useState<string>("");
  const [subCategoryEditId, setSubCategoryEditId] = useState<string>("");
  const [editSubCategoryError,setEditSubCategoryError] = useState<string>("");

  const editSubCategory = async (id:string) => {
    try {
        if(newSubCategory.trim()==="") {
            setEditSubCategoryError("Please enter the required fields");
            setTimeout(() => {
                setEditSubCategoryError("");
            },5000)
            return;
        }
        if(newSubCategory.trim().toLowerCase()===productSubCategoryName) {
            setIsSubCategoryEdit(false);
            setNewSubCategory("");
            setSubCategoryEditId("");
            return;
        }
        const response = await axios.put(`${backendUrl}/product/editSubCategory`,{
            subCategoryEditId,
            newSubCategory,
            parentCategory,
        },{withCredentials:true});
        console.log(response);
        const newSubCategories = subCategories.map((subcategory) => {
            if(subcategory._id===subCategoryEditId) {
                return response.data.newSubCategory;
            } else {
                return subcategory;
            }
        })
        setSubCategories(newSubCategories);
        setIsSubCategoryEdit(false);
        setNewSubCategory("");
        setSubCategoryEditId("");
    } catch (error:any) {
        console.log(error);
        setEditSubCategoryError(error.response.data.message);
        setTimeout(() => {
            setEditSubCategoryError("");
        },5000)
    }
  }


  const deleteSubCategory = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/product/deleteSubCategory/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newSubCategories = subCategories.filter(
        (subcategory) => subcategory._id !== id
      );
      setSubCategories(newSubCategories);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className="flex flex-col  border-b-2 p-2">
    <div className="flex items-center">
        <div className="flex items-center flex-wrap w-[50%] font-semibold text-xl">
          {isSubCategoryEdit ? (
            <>
              <input
                className="border-2 rounded-lg p-2"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                type="text"
                name="newSubCategory"
                id="newSubCategory"
              />
            </>
          ) : (
            productSubCategoryName
          )}
        </div>
        <div className="flex items-center gap-4">
          {isSubCategoryEdit ? (
            <>
              <Button
                onClick={() => {
                  setIsSubCategoryEdit(false);
                  setNewSubCategory("");
                  setSubCategoryEditId("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => editSubCategory(id)}>Edit</Button>
            </>
          ) : (
            <>
              <Button onClick={() => deleteSubCategory(id)}>Delete</Button>
              <Button
                onClick={() => {
                  setIsSubCategoryEdit(true);
                  setSubCategoryEditId(id);
                  setNewSubCategory(productSubCategoryName);
                }}
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="text-red-500">{editSubCategoryError}</div>
    </div>
    </>
  );
};

export default AdminProductSubCategoryCard;
