import React, { useContext, useState } from 'react'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { RxAvatar, RxHamburgerMenu } from 'react-icons/rx'
import { GlobalContext } from '@/App'
import { Button } from './ui/button'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Separator } from './ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { AlertDialogFooter, AlertDialogHeader } from './ui/alert-dialog'

type MobileNavProps = {
    logoutUser:() => void
}

const MobileNav = ({logoutUser}:MobileNavProps) => {

    const {isLoggedIn,loggedInUser} = useContext(GlobalContext);
    const navigate = useNavigate();

  return (
    <>
    <Sheet>
        <SheetTrigger><RxHamburgerMenu/></SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>{isLoggedIn ? <div className='flex items-center gap-2'>
                <div className='text-2xl'>
                    {loggedInUser.avatar!==undefined && loggedInUser.avatar!=="" ? <>
                    <img className='w-12 rounded-full bg-cover' src={loggedInUser.avatar} alt="" />
                    </> : <>
                    <RxAvatar />
                    </>}
                </div>
                {loggedInUser?.email}
                </div> : <>
                User profile
                </> }</SheetTitle>
            </SheetHeader>

            {isLoggedIn ? <>
            <div className='flex flex-col gap-2 my-4'>
                <NavLink className={({isActive}) => isActive ? 'text-orange-500' : ''} to='/cart'>Cart</NavLink>
                <NavLink className={({isActive}) => isActive ? 'text-orange-500' : ''} to='/profile'>Profile</NavLink>
                <NavLink className={({isActive}) => isActive ? 'text-orange-500' : ''} to='/orders'>My orders</NavLink>
                {loggedInUser?.isAdmin && <NavLink className={({isActive}) => isActive ? 'text-orange-500' : ''} to='/admin'>Admin panel</NavLink>}
            </div>
            <Separator/>
            {/* product category links here*/}
            </>: <></>}

            <SheetFooter className='my-4'>
                {isLoggedIn ? <>
                <Button onClick={logoutUser} variant="outline" className='border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300'>Logout</Button>
                </> : <>
                <Button onClick={() => navigate('/login')} variant="outline" className='border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:duration-300'>Login</Button>
                </>}
            </SheetFooter>
        </SheetContent>
    </Sheet>
    </>
  )
}

export default MobileNav
