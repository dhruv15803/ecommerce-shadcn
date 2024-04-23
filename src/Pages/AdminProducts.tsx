import { backendUrl } from "@/App";
import Loader from "@/components/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminProducts = () => {
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number | "">("");
  const [productStock, setProductStock] = useState<number>(1);
  const [productImgFile, setProductImgFile] = useState<File | "">("");
  const [productImgUrl, setProductImgUrl] = useState<string>("");
  const [isProductImgLoading,setIsProductImgLoading] = useState<boolean>(false);

  const uploadProductImg = async () => {
    try {
      if (productImgFile === "") {
        return;
      }
      setIsProductImgLoading(true);
      const response = await axios.post(
        `${backendUrl}/product/uploadProductImg`,
        {
          productImg: productImgFile,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setProductImgUrl(response.data.productImgUrl);
      setIsProductImgLoading(false);
    } catch (error) {
      console.log(error);
      setIsProductImgLoading(false);
    }
  };

  useEffect(() => {
    uploadProductImg();    
  }, [productImgFile]);

  return (
    <>
      <div className="flex flex-col gap-4 border-2 rounded-lg shadow-lg m-10 p-4">
        <div className="text-2xl font-semibold">Add product</div>
        <form className="flex flex-col gap-4 my-4">
          <div className="flex flex-col gap-2">
            {(productImgUrl!=="" && isProductImgLoading===false) && <><img className="w-28 bg-cover" src={productImgUrl} alt="" /></>}
            {isProductImgLoading && <Loader width="80" height="80"/>}
            <label
              className="border-2 w-[20%] text-center rounded-lg p-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300"
              htmlFor="productImg"
            >
              {productImgUrl!=="" ? "Change image" : "Upload image"}
            </label>
            <input
              onChange={(e) => setProductImgFile(e.target.files![0])}
              hidden
              type="file"
              name="productImg"
              id="productImg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="productName">Product Name</label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border-2 rounded-lg p-2"
              type="text"
              name="productName"
              id="productName"
              placeholder="eg: Nike Flip flops"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="productDescription">Product Description</label>
            <input
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="border-2 rounded-lg p-2"
              type="text"
              name="productDescription"
              id="productDescription"
              placeholder="eg: Black rubber flip flops"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="productPrice">Product price (In Rs)</label>
            <input
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              type="number"
              name="productPrice"
              id="productPrice"
              className="border-2 rounded-lg p-2"
              placeholder="eg:700"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="productStock">Product stock</label>
            <input
              value={productStock}
              onChange={(e) => setProductStock(Number(e.target.value))}
              type="number"
              name="productStock"
              id="productStock"
              className="border-2 rounded-lg p-2"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminProducts;
