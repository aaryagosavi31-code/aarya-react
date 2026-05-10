import { useRoutes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Eateries from './pages/Eateries'
import Header from './components/Header'
import MultiLevelParallax from './components/MultiLevelParralx'
import Itenary from './pages/Itenary'
import { ItineraryProvider } from './contexts/ItineraryContext'
import AddToItineraryModal from './components/AddToItineraryModal'

function App() {
  const routes = useRoutes([
    {
      path: '/',
      element: <>
        <MultiLevelParallax />
        <Home />
        <Footer />
      </>
    },
    {
      path: '/explore',
      element: <>
        <Navbar />
        <Explore />
        <Footer />
      </>
    },
    {
      path: '/eateries',
      element: <>
        <Navbar />
        <Eateries />
        <Footer />
      </>
    },
    {
      path: '/itenary',
      element: <>
        <Navbar />
        <Itenary />
        <Footer />
      </>
    }

  ])

  return (
    <ItineraryProvider>
      {routes}
      <AddToItineraryModal />
    </ItineraryProvider>
  )
}

export default App
