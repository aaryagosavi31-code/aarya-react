import React from 'react'
import Header from '../components/Header'
import { motion, useScroll,useTransform } from "framer-motion"
const Home = () => {
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
      name: "siddhivinayak temple",
      description: "A revered Hindu temple dedicated to Lord Ganesha, attracting millions of devotees annually.",
      image: "https://chalbanjare.com/crmnew/img_master/package/ShreeSiddhivinayakTemple_17722588610.webp"
    }
  ];

  const { scrollYProgress } = useScroll();


 
 
 
  return (
    <div>
     <motion.div

    className='w-full bg-white border-orange-300 '>
        <p className='text-6xl font-bold text-center text-[#FF8C00] py-10'>
            Explore Mumbai </p>
    </motion.div>
    
    <div className="py-10 bg-gray-100">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Famous Places in Mumbai</h2>
      <motion.div 
      


      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {places.map((place, index) => (
          <motion.div 
          
         initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}


          key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{place.name}</h3>
              <p className="text-gray-600">{place.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
  )
}

export default Home
