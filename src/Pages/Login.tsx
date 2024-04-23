import React, { useContext, useState } from 'react'
import { Button } from '../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { Checkbox } from '../components/ui/checkbox';
import axios from 'axios';
import { GlobalContext, backendUrl } from '@/App';

const Login = () => {

    const [isShowPassword,setIsShowPassword] = useState<boolean>(false);
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [loginErrorMsg,setLoginErrorMsg] = useState<string>("");
    const {setLoggedInUser,setIsLoggedIn} = useContext(GlobalContext);
    const navigate = useNavigate();

    const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(email.trim()==="" || password.trim()==="") {
                setLoginErrorMsg("Please enter the required fields");
                setTimeout(() => {
                    setLoginErrorMsg("");
                },5000)
                return;
            }
            const response = await axios.post(`${backendUrl}/user/login`,{
                email,
                password,
            },{withCredentials:true});
            console.log(response);
            setLoggedInUser(response.data.user);
            setIsLoggedIn(true);
            setEmail("");
            setPassword("");
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
    <div className='border-2 p-4 rounded-lg flex flex-col shadow-lg my-28 w-[50%] mx-auto'>
        <div className='text-xl text-orange-500 font-semibold'>
            Login
        </div>
        <form onSubmit={(e) => loginUser(e)} className='flex flex-col gap-4 mt-4'>
            <div className='flex flex-col gap-1'>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className='border-2 rounded-lg p-2' type="email" name="email" id="email" placeholder='Enter email'/>
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} className='border-2 rounded-lg p-2' type={isShowPassword ? "text" : "password"} name="password" id="password"/>
            </div>
            <div className='flex items-center gap-1'>
                <Checkbox checked={isShowPassword} onClick={() => setIsShowPassword(!isShowPassword)} id='show-password'/>
                <label htmlFor="show-password">Show password</label>
            </div>
            <div className='flex gap-2'>
                Don't have an account? <Link className='text-orange-500' to='/register'>Click here to register</Link>
            </div>
            <Button variant="outline" className='border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300'>Login</Button>
        </form>
    </div>
    </>
  )
}

export default Login
