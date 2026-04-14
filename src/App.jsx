import { use, useState } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Eateries from './pages/Eateries'
import Header from './components/Header'
import MultiLevelParallax from './components/MultiLevelParralx'
import { motion, useScroll, useTransform } from "framer-motion";
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
      path: '/eateries',
      element: <Eateries />
    },
  ])


  return (
    <>
      <MultiLevelParallax />
      <Home />
    </>
  )
}

export default App
