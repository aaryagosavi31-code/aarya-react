import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

 const linkStyle = (path) => {
  const isCurrentPage = location.pathname === path;

  return `text-white text-lg cursor-pointer pb-1 transition-all duration-200
    ${isCurrentPage ? 'font-bold border-b-2 border-white' : 'font-medium border-b-2 border-transparent hover:border-white'}`;
};
  return (
    <nav className="sticky top-0 z-50 bg-[#FF8C00]/95 backdrop-blur-md shadow-md h-16 flex items-center justify-between px-6 md:px-12">
     

      <div className="flex items-center gap-8 md:gap-12">
        <div onClick={() => navigate('/')} className={linkStyle('/')}>
          Home
        </div>
        <div onClick={() => navigate('/explore')} className={linkStyle('/explore')}>
          Explore
        </div>
        <div onClick={() => navigate('/eateries')} className={linkStyle('/eateries')}>
          Eateries
        </div>
      </div>

      <div>
        <button 
          onClick={() => navigate('/itenary')} 
          className="text-[#7B2D00] font-bold px-5 py-2.5 bg-[#FFD166] rounded-xl shadow-sm hover:bg-[#ffe094] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Plan Trip
        </button>
      </div>
    </nav>
  )
}

export default Navbar
