import { use, useState } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
    },
    {
      path: '/',
    },
    {
      path: '/',
    },
  ])


  return (
    <>
      <Navbar />
      
      <Footer />     
    </>
  )
}

export default App
