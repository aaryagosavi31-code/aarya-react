import { useState } from 'react'
import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const places = [
    {
      name: "Gateway of India",
      description: "A historic monument built during the British Raj, offering stunning views of the Arabian Sea.",
      image: "https://www.fabhotels.com/blog/wp-content/uploads/2019/05/Gateway-Of-India_600-1.jpg"
    },
    {
      name: "Marine Drive",
      description: "A picturesque promenade along the Arabian Sea, known as the Queen's Necklace.",
      image: "https://hblimg.mmtcdn.com/content/hubble/img/mumbai/mmt/activities/m_Marine%20Drive_1_l_401_672.jpg"
    },
    {
      name: "Elephanta Caves",
      description: "Ancient rock-cut caves featuring Hindu and Buddhist sculptures, a UNESCO World Heritage Site.",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/elephanta-caves-mumbai-maharashtra-10-musthead-hero?qlt=82&ts=1742180919067"
    },
    {
      name: "Chhatrapati Shivaji Terminus",
      description: "A magnificent Victorian Gothic railway station, another UNESCO World Heritage Site.",
      image: "https://www.fabhotels.com/blog/wp-content/uploads/2019/09/CSMT.jpg"
    },
    {
      name: "Juhu Beach",
      description: "A popular beach known for its vibrant atmosphere, street food, and sunset views.",
      image: "https://i.redd.it/sunset-at-juhu-beach-v0-a5enqxzehgue1.jpg?width=4032&format=pjpg&auto=webp&s=b66bb493b68d1028cdf51cd4c5714d1fd87180e2"
    },
    {
      name: "Siddhivinayak Temple",
      description: "A revered Hindu temple dedicated to Lord Ganesha, attracting millions of devotees annually.",
      image: "https://chalbanjare.com/crmnew/img_master/package/ShreeSiddhivinayakTemple_17722588610.webp"
    }
  ];

  const foodItems = [
    {
      name: "Vada Pav",
      image: "https://www.cookwithmanali.com/wp-content/uploads/2018/04/Vada-Pav-500x500.jpg"
    },
    {
      name: "Pav Bhaji",
      image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Bhel Puri",
      image: "https://vegecravings.com/wp-content/uploads/2018/06/Bhel-Puri-Recipe-Step-By-Step-Instructions.jpg"
    },
    {
      name: "Pani Puri",
      image: "https://www.sidechef.com/recipe/3883dffb-5fa2-4ee9-8054-d8de1409899f.jpg?d=1408x1120"
    },
    {
      name: "Misal Pav",
      image: "https://www.ohmyveg.co.uk/wp-content/uploads/2023/12/Misal-Pav-2-2-e1722869218662.jpg"
    },
    {
      name: "Bombay Sandwich",
      image: "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const [hovered, setHovered] = useState(null);

  const FoodItem = ({ food }) => (
    <div
      onClick={() => navigate(`/eateries?food=${encodeURIComponent(food.name)}#options`)}
      className="flex flex-col items-center justify-center text-center cursor-pointer group shrink-0"
    >
      <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border border-gray-200/80 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-orange-400 group-hover:shadow-md">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="mt-3 text-gray-600 font-medium text-base group-hover:text-orange-500 transition-colors duration-200 whitespace-normal max-w-32.5">
        {food.name}
      </span>
    </div>
  );

  return (
    <div>
      <motion.div className='w-full bg-white border-orange-300 '>
        <p className='text-6xl font-bold text-center text-[#FF8C00] py-10'>
          Explore Mumbai
        </p>
      </motion.div>

      <div className="py-10 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Famous Places in Mumbai</h2>

        <div className="flex gap-3 px-4">
          {places.map((place, index) => (
            <motion.div
              key={index}
              onHoverStart={() => setHovered(index)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => navigate(`/explore?place=${encodeURIComponent(place.name)}#map-view`)}
              animate={{
                flex: hovered !== null && hovered + 1 === index
                  ? 0
                  : hovered === index
                    ? 3
                    : 1,
                opacity: hovered !== null && hovered + 1 === index ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative overflow-hidden rounded-xl cursor-pointer min-w-0 h-72"
            >
              <img src={place.image} alt={place.name} className="w-full h-full object-cover" />

              <motion.div
                animate={{ opacity: hovered === index ? 1 : 0 }}
                className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex flex-col justify-end p-5"
              >
                <h3 className="text-white font-medium text-lg">{place.name}</h3>
                <p className="text-white/80 text-sm mt-1">{place.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12 mb-6">
          <button
            onClick={() => navigate('/explore')}
            className="px-8 py-3 bg-white border-2 border-orange-300 text-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
          >
            Explore
          </button>
        </div>

        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-12 py-1">Must-Try Street Food</h2>

        <div className="bg-white py-8 border-y border-gray-200/60">
          <div className="flex justify-center gap-12 px-6 flex-wrap">
            {foodItems.map((food, index) => (
              <FoodItem key={index} food={food} />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button onClick={() => navigate('/eateries')} className="px-8 py-3 border-2 border-orange-300 text-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
            Explore All Food
          </button>
        </div>

      </div>

      <div className="text-center py-10">
        <h3 className="text-4xl font-bold text-gray-800">Ready to Explore??</h3>
        <p className="text-gray-600 py-2">Discover the best of Mumbai!</p>
        <button onClick={() => navigate('/itenary')} className="px-8 py-3 border-2 border-orange-300 text-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
          Make My Itenary
        </button>
      </div>
    </div>
  )
}

export default Home