import React, { SetStateAction, useContext, useState } from "react";
import { Button } from "./ui/button";
import { GlobalContext, ProductCategory, backendUrl } from "@/App";
import axios from "axios";

type AdminProductCategoryCardProps = {
  id: string;
  productCategoryName: string;
};

const AdminProductCategoryCard = ({
  id,
  productCategoryName,
}: AdminProductCategoryCardProps) => {
  const {
    productCategories,
    setProductCategories,
  }: {
    productCategories: ProductCategory[] | [];
    setProductCategories: React.Dispatch<
      SetStateAction<ProductCategory[] | []>
    >;
  } = useContext(GlobalContext);
  const [isProductCategoryEdit, setIsProductCategoryEdit] =
    useState<boolean>(false);
  const [productCategoryEditId, setProductCategoryEditId] = useState<
    string | null
  >(null);
  const [newProductCategoryName, setNewProductCategoryName] =
    useState<string>("");

  const [newCategoryError, setNewCategoryError] = useState<string>("");

  const deleteProductCategory = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/product/deleteCategory/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newCategories = productCategories.filter(
        (category) => category._id !== id
      );
      setProductCategories(newCategories);
    } catch (error) {
      console.log(error);
    }
  };

  const editProductCategory = async (id: string) => {
    try {
      if (newProductCategoryName.trim() === "") {
        setNewCategoryError("Please enter a category");
        setTimeout(() => {
          setNewCategoryError("");
        }, 5000);
        return;
      }
      if (newProductCategoryName.trim().toLowerCase() === productCategoryName) {
        setIsProductCategoryEdit(false);
        setProductCategoryEditId(null);
        setNewProductCategoryName("");
        return;
      }

      // api call
      const response = await axios.put(
        `${backendUrl}/product/editProductCategory`,
        {
          productCategoryEditId,
          newProductCategoryName,
        },
        { withCredentials: true }
      );
      console.log(response);

      const newProductCategories = productCategories.map((category) => {
        if (category._id === productCategoryEditId) {
          return response.data.newCategory;
        } else {
          return category;
        }
      });

      setProductCategories(newProductCategories);
      setIsProductCategoryEdit(false);
      setNewProductCategoryName("");
      setProductCategoryEditId(null);
    } catch (error: any) {
      console.log(error);
      setNewCategoryError(error.response.data.message);
      setTimeout(() => {
        setNewCategoryError("");
      }, 5000);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center border-b-2 gap-2">
        <div className="flex items-center  p-2 gap-4">
          <div className="text-xl font-semibold w-[50%] flex flex-wrap">
            {isProductCategoryEdit ? (
              <>
                <input
                  value={newProductCategoryName}
                  onChange={(e) => setNewProductCategoryName(e.target.value)}
                  className="border-2 rounded-lg p-2 w-[100%]"
                  type="text"
                  name="newProductCategoryName"
                  id="newProductCategoryName"
                />
              </>
            ) : (
              productCategoryName
            )}
          </div>
          <div className="flex items-center gap-2">
            {isProductCategoryEdit ? (
              <>
                <Button
                  onClick={() => {
                    setIsProductCategoryEdit(false);
                    setNewProductCategoryName("");
                    setProductCategoryEditId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => editProductCategory(id)}>Edit</Button>
              </>
            ) : (
              <>
                {" "}
                <Button onClick={() => deleteProductCategory(id)}>
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    setIsProductCategoryEdit(true);
                    setProductCategoryEditId(id);
                    setNewProductCategoryName(productCategoryName);
                  }}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="text-red-500 px-2">{newCategoryError}</div>
      </div>
    </>
  );
};

export default AdminProductCategoryCard;
