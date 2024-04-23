import { GlobalContext, User, backendUrl } from "@/App";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { FaFileUpload } from "react-icons/fa";


type userDataMsg = {
  message:string;
  type:"ERROR" | "SUCCESS"
}

const Profile = () => {
  const { loggedInUser, setLoggedInUser }:{loggedInUser:User;setLoggedInUser:React.Dispatch<SetStateAction<User>>} = useContext(GlobalContext);
  const [name, setName] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<null | File>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);
  const [addUserDataMsg,setAddUserDataMsg] = useState<userDataMsg | null>(null);

  const uploadAvatar = async () => {
    try {
      if (!avatarFile) {
        return;
      }
      setIsAvatarLoading(true);
      const response = await axios.post(
        `${backendUrl}/user/uploadAvatar`,
        {
          avatar: avatarFile,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setAvatarUrl(response.data.url);
      setIsAvatarLoading(false);
    } catch (error) {
      console.log(error);
      setIsAvatarLoading(false);
    }
  };

  const addUserData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (
        name.trim() === "" ||
        addressLine1.trim() === "" ||
        addressLine2.trim() === "" ||
        city.trim() === ""
      ) {
        setAddUserDataMsg({
          message:'Please check your details',
          type:'ERROR'
        })
        setTimeout(() => {
          setAddUserDataMsg(null);
        },4000)
        return;
      }
      const response = await axios.post(
        `${backendUrl}/user/addUserData`,
        {
          avatarUrl,
          name,
          addressLine1,
          addressLine2,
          city,
        },
        { withCredentials: true }
      );
      console.log(response);
      setLoggedInUser(response.data.updatedUser);
      setAddUserDataMsg({
        message:"updated user profile",
        type:'SUCCESS'
      })
      setTimeout(() => {
        setAddUserDataMsg(null);
      },4000)
    } catch (error) {
      console.log(error);
      setAddUserDataMsg({
        message:'Please check your details',
        type:'ERROR'
      })
    }
  };


  useEffect(() => {
    uploadAvatar();
  }, [avatarFile]);

  useEffect(()=>{
    const populateUserData = () => {
      setAddressLine1(loggedInUser?.address_line_1 || "");
      setAddressLine2(loggedInUser?.address_line_2 || "");
      setName(loggedInUser?.name || "");
      setCity(loggedInUser?.city || "");
      setAvatarUrl(loggedInUser?.avatar || "");
    }
    populateUserData();
  },[loggedInUser])

  return (
    <>
      <div className="flex flex-col my-28 w-[80%] md:w-[50%] mx-auto border-2 rounded-lg p-4 shadow-lg">
        <div className="text-2xl font-semibold">User profile</div>
        <div className="my-4">
          {isAvatarLoading && <Loader height="80" width="80" />}
          {avatarUrl !== "" && !isAvatarLoading && (
            <img
              className="rounded-full w-28  bg-cover"
              src={avatarUrl}
              alt=""
            />
          )}
        </div>
        <div className="flex my-4 gap-2">
          <label
            className="flex items-center gap-2 border-2 rounded-lg p-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300"
            htmlFor="avatar"
          >
            <FaFileUpload />
            <span>{avatarUrl !== "" ? "Change avatar" : "Upload avatar"}</span>
          </label>
          <input
            hidden
            onChange={(e) => setAvatarFile(e.target.files![0])}
            type="file"
            name="avatar"
            id="avatar"
          />
        </div>
        <form
          onSubmit={(e) => addUserData(e)}
          className="flex flex-col gap-2 my-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              readOnly
              className="border-2 rounded-lg p-2 bg-blue-100"
              value={loggedInUser?.email}
              type="text"
              name="email"
              id="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 rounded-lg p-2 bg-blue-100"
              type="text"
              name="name"
              id="name"
              placeholder="Enter name"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col w-[50%]">
              <label htmlFor="addressLine1">Address line 1</label>
              <input
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="border-2 rounded-lg p-2 bg-blue-100"
                type="text"
                name="addressLine1"
                id="addressline1"
              />
            </div>
            <div className="flex flex-col w-[50%]">
              <label htmlFor="addressLine2">Address line 2</label>
              <input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="border-2 rounded-lg p-2 bg-blue-100"
                type="text"
                name="addressLine2"
                id="addressLine2"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="city">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-2 rounded-lg p-2 bg-blue-100"
              type="text"
              name="city"
              id="city"
            />
          </div>
          {addUserDataMsg?.type==='ERROR' ? <span className="text-red-500">{addUserDataMsg?.message}</span> : <span className="text-orange-500">{addUserDataMsg?.message}</span>}
          <Button>Submit</Button>
        </form>
      </div>
    </>
  );
};

export default Profile;
