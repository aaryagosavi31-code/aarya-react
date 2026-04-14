import React from 'react'
import marinedrive from '../assets/marinedrive.png'
import csmt from '../assets/csmt.png'
import gateway from '../assets/gateway.png'
import temple from '../assets/temple.png'
import juhu from '../assets/juhu.png'

const Header = () => {

  const slides=[
    {
      src: marinedrive,
    },
    {
      src: csmt,
    },
    {
      src: gateway,
    },
    {
      src: temple,
    },
    {
      src: juhu,
    },
  ];



  return (
    <>
    <div className='h-100 w-[ 1358px ]'>
      <img className='rounded-[50px]' src={slides[2].src} alt="" />
    </div>
    </>
  )
}

export default Header
