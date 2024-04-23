import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "./components/Loader";
import Profile from "./Pages/Profile";
import AdminLayout from "./Layouts/AdminLayout";
import AdminProducts from "./Pages/AdminProducts";
import AdminCategories from "./Pages/AdminCategories";
import AdminSubCategories from "./Pages/AdminSubCategories";
export const backendUrl = "http://localhost:5000";
export const GlobalContext = createContext(null);

export type User = {
  _id: string;
  email: string;
  password: string;
  name?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  avatar?: string;
  isAdmin: boolean;
};

export type Product = {
  _id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productCategoryId: string;
  productSubCategoryId: string;
};

export type ProductCategory = {
  _id: string;
  productCategoryName: string;
};

function App() {
  const [loggedInUser, setLoggedInUser] = useState<{} | User>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productCategories, setProductCategories] = useState<
    [] | ProductCategory[]
  >([]);
  const [products, setProducts] = useState<[] | Product[]>([]);

  const getLoggedInUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendUrl}/user/getLoggedInUser`, {
        withCredentials: true,
      });
      if (response.data.success === true) {
        setLoggedInUser(response?.data?.user);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getProductCategories = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/product/getProductCategories`
      );
      setProductCategories(response.data.productCategories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLoggedInUser();
    getProductCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 my-20">
        <Loader height="80" width="80" />
        <span className="text-orange-500">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <GlobalContext.Provider
        value={{
          setLoggedInUser,
          loggedInUser,
          isLoggedIn,
          setIsLoggedIn,
          productCategories,
          setProductCategories,
          products,
          setProducts,
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="subcategories" element={<AdminSubCategories />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
