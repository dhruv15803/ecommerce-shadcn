import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Layout from "./components/Layouts/Layout"
import Login from "./components/Pages/Login"
import Register from "./components/Pages/Register"
import { createContext, useEffect, useState } from "react"
import axios from "axios"
import Loader from "./components/Loader"
export const backendUrl="http://localhost:5000"
export const GlobalContext = createContext(null);

type User = {
  _id:string;
  email:string;
  password:string;
  name?:string;
  address_line_1?:string;
  address_line_2?:string;
  city?:string;
  avatar?:string;
  isAdmin:boolean;
}

function App() {
  const [loggedInUser,setLoggedInUser] = useState<{} | User>({});
  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);


  const getLoggedInUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendUrl}/user/getLoggedInUser`,{
        withCredentials:true,
      });
      if(response.data.success===true) {
        setLoggedInUser(response?.data?.user);
        setIsLoggedIn(true);
      }
      setIsLoading(false);  
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getLoggedInUser();
  },[])

  if(isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 my-20">
        <Loader height="80" width="80"/>
        <span className="text-orange-500">Loading...</span>
      </div>
    )
  }

  return (
    <>
    <GlobalContext.Provider value={{
      setLoggedInUser,
      loggedInUser,
      isLoggedIn,
      setIsLoggedIn,
    }}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
        </Route>
      </Routes>
    </Router>
    </GlobalContext.Provider>
    </>
  )
}

export default App
