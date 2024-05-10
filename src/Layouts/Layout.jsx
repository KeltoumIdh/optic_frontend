import { GaugeIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ChevronLeft, LogOutIcon, Menu } from "lucide-react";
import { Sidebare } from './Sidebare'
import {useUserContext} from "../context/AuthContext.jsx";
import AuthApi from '../services/Api/Auth/AuthApi.js';
// import {logo} from "../assets/logo.jpg"

 
export default function Layout() {
  // const { user, logout } = useAuthContext();
  // const {logout, user} = useUserContext()
  const {authenticated, setUser,user, setAuthenticated, logout: contextLogout} = useUserContext()
 
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    if (authenticated === true) {
      setIsLoading(false)
      AuthApi.getUser().then(({data}) => {
        setUser(data)
        setAuthenticated(true)
      }).catch((reason) => {
        contextLogout()
      })
    } else {
      navigate('/login')
    }

  }, [authenticated]);
  return (
    <>
     <header>
    <nav
      className="sticky top-0 z-10 block w-full max-w-full px-4 py-2 text-black bg-white border rounded-none shadow-md h-max border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
           {/* <img
        src={logo}
           className="w-12 h-12 
         "
           alt="logo"
         /> */}

        {/* <a href="#"
          className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-medium leading-relaxed text-inherit antialiased">
          Material Tailwind
        </a> */}
        <div className="flex items-center gap-4">
        <div className="hidden mr-4 lg:block">
                <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                <Link className={'flex items-center'} to={'/'}><GaugeIcon className='mx-1' size={20}/> Dashboard</Link>
                </li>
                <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                <Link className={'flex items-center'} to={'/clients'}> Clients</Link>
                </li>
                </ul>
            </div>
          <div className="flex items-center gap-x-1">
               <div className="flex justify-center items-center flex-row gap-3 mr-3">
       
        

      
      </div>
          
          
          </div>
          <button
            className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            type="button">
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor"
                strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </span>
          </button>
      
         
         
       
            </div>
        </div>
        </nav>
    </header>

    <main className={'mx-auto  space-y-4 '}>
        <div className='flex '>
            <div className=' md:h-1/4'><Sidebare/></div>
            <div className='p-4 sm:ml-64 w-full'><Outlet/></div>
        </div>
    </main>
</>
)
}
