import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <>
    <div className="bg-[#FF8C00]  h-15 flex items-center justify-around">
      <div></div>
      <div onClick={()=>navigate('/')} className=" text-white font-bold text-size-lg cursor-pointer">Home</div>
      <div onClick={()=>navigate('/explore')} className=" text-white text-size-lg cursor-pointer">Explore</div>
      <div onClick={()=>navigate('/eateries')} className=" text-white text-size-lg cursor-pointer">Eateries</div>
      <div className=" ">
        <button onClick={()=>navigate('/itenary')} className=" text-[#7B2D00] cursor-pointer w-25 h-12 bg-[#FFD166] rounded-[10px] font-bold">Plan Trip</button>
        </div>
   
    </div>
    </>
  )
}

export default Navbar
