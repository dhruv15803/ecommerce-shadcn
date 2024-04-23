import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { Checkbox } from '../ui/checkbox';
import axios from 'axios';
import { backendUrl } from '@/App';

type errorMsgType = {
    message:string;
    messageType: "ERROR" | "RESOLVED"
}

const Register = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [passwordValidityErrorMessages,setPasswordValidityErrorMessages] = useState<errorMsgType[] | null | string | []>(null);
    const navigate = useNavigate();

    // passwords requirement
    // passwords should have a min length of 8
    // passwords should have atleast 1 uppercase char
    // passwords should have atleast 1 special char
    // passwords should include atleast numeric value

    const isPasswordUpperCase = (password:string):boolean => {
        let numString="0123456789 ";
        let specialChar = "@#$%&";
        let isUppercase = false;
        for(let i=0;i<password.length;i++){
            if(password.charAt(i).toUpperCase()===password.charAt(i) && !numString.includes(password.charAt(i)) && !specialChar.includes(password.charAt(i)) ) {
                isUppercase=true;
                return true;
            }
        }
        return false;
    }

    const isPasswordSpecialChar = (password:string):boolean => {
        const specialChars = "@#$%!&";
        for(let i=0;i<specialChars.length;i++) {
            for(let j=0;j<password.length;j++) {
                if(password.charAt(j)===specialChars.charAt(i)) {
                    return true;
                }
            }
        }
        return false;
    }

    const isPasswordNumeric = (password:string):boolean => {
        let nums ="0123456789";
        for(let i=0;i<nums.length;i++) {
            for(let j=0;j<password.length;j++) {
                if(password.charAt(j)===nums.charAt(i)) {
                    return true;
                }
            }
        }
        return false;
    }

    const registerUser = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let isPasswordValid = true;
            if(email.trim()==="" || password.trim()==="" || confirmPassword.trim()==="") {
                setPasswordValidityErrorMessages("Please enter all the required fields!");
                setTimeout(() => {
                    setPasswordValidityErrorMessages(null);
                },5000)
                return;
            } else if(password!==confirmPassword) {
                setPasswordValidityErrorMessages("Please check your details");
                setTimeout(() => {
                    setPasswordValidityErrorMessages(null);
                },5000)
                return;
            } else {
                setPasswordValidityErrorMessages([]);
                // go through checklist above to check validity
                if(password.length < 8) {
                    isPasswordValid=false;
                    setPasswordValidityErrorMessages((prev) => {
                        if(prev.length===0) return [
                            {
                                message:"password should have a minimum length of 8",
                                messageType:"ERROR",
                            }
                        ]
    
                        return [
                        ...prev,
                        {
                            message:"password should have a minimum length of 8",
                            messageType:"ERROR",
                        },
                    ]});
                }
                if( !isPasswordUpperCase(password)) {
                    isPasswordValid=false;
                    setPasswordValidityErrorMessages((prev) => {
                        
                        if(prev.length===0) return [
                            {
                                message:"password should have atleast 1 uppercase char",
                                messageType:"ERROR",
                            }
                        ]
    
                        return [
                        ...prev,
                        {
                            message:"password should have atleast 1 uppercase char",
                            messageType:"ERROR"
                        }
                    ]})
                }
                if(!isPasswordSpecialChar(password)) {
                    isPasswordValid=false;
                    setPasswordValidityErrorMessages((prev) =>{
    
                        if(prev.length===0) return [
                            {
                                message:"password should have atleast 1 special char",
                                messageType:"ERROR",
                            }
                        ]
                        
                        return [
                        ...prev,
                        {
                            message:"password should have atleast 1 special char",
                            messsageType:"ERROR",
                        }
                    ]})
                }
                if(!isPasswordNumeric) {
                    isPasswordValid=false;
                    setPasswordValidityErrorMessages((prev) => {
    
                        if(prev.length===0) return [
                            {
                                message:"password should have atleast 1 numeric char",
                                messageType:"ERROR",
                            }
                        ]
    
                        return [
                        ...prev,
                        {
                            message:"password should have atleast 1 numeric char",
                            messageType:"ERROR",
                        }
                    ]})
                }
                if(!isPasswordValid) {
                    return;
                }
    
                const response = await axios.post(`${backendUrl}/user/register`,{
                    email,
                    password,
                },{withCredentials:true});
                console.log(response);
                setPasswordValidityErrorMessages([]);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className='border-2 p-4 rounded-lg flex flex-col shadow-lg my-24 w-[50%] mx-auto'>
                <div className='text-xl text-orange-500 font-semibold'>
                    Register
                </div>
                <form onSubmit={(e) => registerUser(e)} className='flex flex-col gap-4 mt-4'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="email">Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className='border-2 rounded-lg p-2' type="email" name="email" id="email" placeholder='Enter email' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="password">password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} className='border-2 rounded-lg p-2' type={isShowPassword ? "text" : "password"} name="password" id="password" />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="confirmPassword">confirm password</label>
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='border-2 rounded-lg p-2' type={isShowPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Checkbox checked={isShowPassword} onClick={() => setIsShowPassword(!isShowPassword)} id="show-password" />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="show-password">Show password</label>
                    </div>
                    {typeof passwordValidityErrorMessages==="string" ? <div className='flex'>
                        {passwordValidityErrorMessages}
                    </div> : <><div className='flex flex-col gap-1'>
                        <ul>
                            {passwordValidityErrorMessages?.map((item,index) => {
                                return <li className='text-red-500' key={index}>{item.message}</li>
                            })}
                        </ul>
                        </div></>}

                    <div className='flex gap-2'>
                        Already have an account? <Link className='text-orange-500' to='/login'>Click here to login</Link>
                    </div>
                    <Button variant="outline" className='border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300'>Register</Button>
                </form>
            </div>
        </>
    )
}

export default Register
