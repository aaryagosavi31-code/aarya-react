import { use, useState } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Itenary from './pages/Itenary' 
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/explore',
      element: <Explore />
    },
    {
      path: '/itenary',
      element: <Itenary />
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
