import React from 'react'

const Navbar = () => {
  return (
    <>
    <div className="bg-white h-15 flex items-center justify-around">
      <div></div>
      <div className=" text-[#F5C4B3] text-size-lg">Home</div>
      <div className=" text-[#F5C4B3] text-size-lg">Explore</div>
      <div className=" text-[#F5C4B3] text-size-lg">Eateries</div>
      <div className=" ">
        <button className=" text-[#7B2D00] w-25 h-12 bg-[#FFD166] rounded-[10px] font-bold">Plan Trip</button>
        </div>
   
    </div>
    </>
  )
}

export default Navbar
