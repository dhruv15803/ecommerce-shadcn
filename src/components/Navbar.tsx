import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { GlobalContext, backendUrl } from "@/App";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const navigate = useNavigate();
  const { loggedInUser, isLoggedIn, setLoggedInUser, setIsLoggedIn } =
    useContext(GlobalContext);

  const logoutUser = async () => {
    try {
      const response = await axios.delete(`${backendUrl}/user/logout`, {
        withCredentials: true,
      });
      console.log(response);
      setLoggedInUser({});
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-10 bg-white flex items-center p-4 justify-between border-b-2">
        <div className="text-3xl text-orange-500 font-semibold">
          <Link to="/">eBazzar</Link>
        </div>
        {isLoggedIn ? (
          <>
            <div className="hidden md:flex md:items-center md:gap-4">
              <div className="flex items-center gap-1">
                <div className="text-2xl mx-2">
                    {loggedInUser.avatar!==undefined && loggedInUser.avatar!=="" ? <>
                    <img className="w-12 bg-cover rounded-full" src={loggedInUser.avatar}/>
                    </> : <><RxAvatar /></>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="cursor-pointer hover:text-orange-500 hover:duration-300">
                      {loggedInUser?.email}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/cart')}>
                      Cart
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                        My orders
                    </DropdownMenuItem>
                    {loggedInUser?.isAdmin && <DropdownMenuItem onClick={() => navigate('/admin')}>
                        Admin panel
                        </DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <AlertDialog>
                <AlertDialogTrigger className="border-orange-500 py-1 px-2 border-2 rounded-lg text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300">
                  Logout
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="border-orange-500 border-1 bg-white text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300"
                      onClick={logoutUser}
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        ) : (
          <div className="hidden md:block">
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300"
            >
              Login
            </Button>
          </div>
        )}
        <div className="text-2xl  md:hidden">
          <MobileNav logoutUser={logoutUser} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
