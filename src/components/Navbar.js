import React from 'react'
import {HiMenuAlt4} from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import logo from '../images/logo.png'

const NavbarItem = ({title , classProps}) =>{
  return (
    <li className={`mx-4 cursor-pointer ${classProps}`}>
      {title}
    </li>
  )
}

const Navbar = ({accounts , setAccounts, isConnected , setIsConnected }) => {
const [toggleMenu , setToggleMenu] = React.useState(false);


  return (
    <nav className='w-full flex md:justify-center justify-around items-center p-4'>
      <div className='md:flex-[0.5] flex-initial justify-around items-center'>
        {/* <img src={logo} alt="Logo" className='w-32 cursor-pointer' /> */}
        <h1 className=' sm:text-2xl text-white text-gradient py-1 '>
         CryptoWarranty
          </h1>
      </div>
      <ul className='text-white md:flex hidden list-none flex-row justify-between items-center flex-initial'>
        {["About" ,"Tutorials" , "Support"].map((item,index)=> <NavbarItem key={item+index} title={item}/>)}
         {/* <li className='bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]' >Login</li> */}
        
        
      </ul>
      <div className='flex-relative'>
        {toggleMenu 
        ? <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer " onClick={()=>setToggleMenu(false)} />
        : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer " onClick={()=>setToggleMenu(true)} />
      }
      {toggleMenu && (
        <ul
        className='z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
        flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in
        '
        >
          <li className='text-xl w-ful my-2'>
            <AiOutlineClose onClick={()=>setToggleMenu(false) }/>

          </li>
          {["About" , "Tutorials"].map((item,index)=> <NavbarItem key={item+index} title={item} classProps="my-2 text-lg"/>)}
        </ul>
      )}
      </div>
    </nav>
  )
}

export default Navbar
