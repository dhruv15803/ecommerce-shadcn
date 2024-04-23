import { Separator } from '@/components/ui/separator'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <>
    <div className='flex flex-col mx-10 my-5'>
        <div className='font-semibold text-2xl'>Admin</div>
        <div className='flex items-center gap-4 mt-8'>
            <NavLink className={({isActive}) => isActive ? 'text-orange-500 text-xl font-semibold' : ' text-xl font-semibold'} end to='.'>Products</NavLink>
            <NavLink className={({isActive}) => isActive ? 'text-orange-500 text-xl font-semibold' : ' text-xl font-semibold'} to='categories'>Categories</NavLink>
            <NavLink className={({isActive}) => isActive ? 'text-orange-500 text-xl font-semibold' : ' text-xl font-semibold'} to='subcategories'>Subcategories</NavLink>
        </div>
    </div>
    <Outlet/>
    </>
  )
}

export default AdminLayout