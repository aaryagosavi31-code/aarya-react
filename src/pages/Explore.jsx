import React, { useEffect, useState } from 'react'
import { useItinerary } from '../contexts/ItineraryContext'

const images = [
  {
    title: 'Juhu Beach',
    caption: 'Sunset vibes and food stalls along Mumbai.',
    src: new URL('../assets/juhu.png', import.meta.url).href,
    id: 'ChIJB7rUlb_J5zsRoc62Npx8BDU',
    address: 'Juhu, Mumbai, Maharashtra',
    mapUrl: "https://www.google.com/maps?q=Juhu+Beach,Mumbai&output=embed"
  },
  {
    title: 'Gateway of India',
    caption: 'Mumbai iconic monument by the Arabian Sea.',
    src: new URL('../assets/gateway.png', import.meta.url).href,
    id: 'ChIJrVwNOsfR5zsRPHOcIKclCsc',
    address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra',
    mapUrl: "https://www.google.com/maps?q=Gateway+Of+India,Mumbai&output=embed"
  },
  {
    title: 'Marine Drive',
    caption: 'The Queens Necklace sparkling after dusk.',
    src: new URL('../assets/marinedrive.png', import.meta.url).href,
    id: 'EiVNYXJpbmUgRHIsIE11bWJhaSwgTWFoYXJhc2h0cmEsIEluZGlh',
    address: 'Marine Dr, Mumbai, Maharashtra',
    mapUrl: "https://www.google.com/maps?q=Marine+Drive,Mumbai&output=embed"
  },
  {
    title: 'Mumbai Skyline',
    caption: 'City lights and high-rises that define the Mumbai skyline.',
    src: new URL('../assets/mumbaiskyline.png', import.meta.url).href,
    id: 'ChIJRXjLHyXR5zsRyhqOjYu8ztE',
    address: 'WRVF+M28, Marine Dr, Mumbai',
    mapUrl: "https://www.google.com/maps?q=Mumbai+Skyline+View+Point&output=embed"
  },
]

const Explore = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [apiResults, setApiResults] = useState([])
  const [mapUrl, setMapUrl] = useState(images[0].mapUrl)
  const [selectedPlaceName, setSelectedPlaceName] = useState(images[0].title)
  const [isSearching, setIsSearching] = useState(false)

  const { addToItinerary } = useItinerary()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (searchTerm.length < 3) {
      setApiResults([])
      return
    }
    const delayDebounceFn = setTimeout(() => {
      fetchLocations(searchTerm)
    }, 800)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const fetchLocations = async (query) => {
    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        { headers: { 'User-Agent': 'Mumbai-Explore-App-Aarya' } }
      )
      const data = await response.json()
      setApiResults(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSearching(false)
    }
  }

  const selectFromSlider = (index) => {
    setSelectedPlaceName(images[index].title)
    setMapUrl(images[index].mapUrl)
    setSearchTerm('')
  }

  const selectFromApi = (place) => {
    const { lat, lon, display_name } = place
    setSelectedPlaceName(display_name.split(',')[0])
    setMapUrl(`https://www.google.com/maps?q=${lat},${lon}&output=embed`)
    setApiResults([])
    setSearchTerm('')
  }

  const localSuggestions = images.filter(img => 
    img.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FFF7ED] py-12 space-y-12">
      <div className="w-full">
        <div className="relative overflow-hidden rounded-4xl shadow-2xl bg-black h-105 sm:h-130 group mx-4 lg:mx-8">
          <img 
            key={currentIndex} 
            src={images[currentIndex].src} 
            alt={images[currentIndex].title} 
            className="absolute inset-0 w-full h-full object-cover animate-fade-in duration-700" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-8 text-white">
            <h2 className="text-4xl font-bold">{images[currentIndex].title}</h2>
            <p className="mt-2 max-w-md text-lg text-gray-200">{images[currentIndex].caption}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-150">
          <div className="lg:col-span-1 bg-white rounded-4xl shadow-xl overflow-hidden flex flex-col border border-orange-100">
            <div className="p-6 bg-orange-500 text-white space-y-4">
              <h3 className="text-xl font-bold">Find Destinations</h3>
              <input 
                type="text"
                placeholder="Search places..."
                className="w-full py-2 px-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {localSuggestions.map((place) => (
                <div 
                  key={place.id} 
                  className="p-4 rounded-2xl cursor-pointer bg-orange-50 border border-orange-200 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div onClick={() => selectFromSlider(images.indexOf(place))} className="flex-1">
                      <h4 className="font-semibold text-orange-700"> {place.title}</h4>
                      <p className="text-xs text-orange-600/70">{place.address}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToItinerary({ ...place, type: 'place' })
                      }}
                      className="ml-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-orange-600 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}

              {apiResults.map((place) => (
                <div 
                  key={place.place_id} 
                  className="p-4 rounded-2xl cursor-pointer bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div onClick={() => selectFromApi(place)} className="flex-1">
                      <h4 className="font-semibold text-gray-800">{place.display_name.split(',')[0]}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{place.display_name}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToItinerary({
                          place: place.display_name.split(',')[0],
                          address: place.display_name,
                          type: 'place'
                        })
                      }}
                      className="ml-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-orange-600 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}

              {searchTerm.length >= 3 && localSuggestions.length === 0 && apiResults.length === 0 && (
                <div className="text-center py-10 text-gray-400 italic text-sm">
                  {isSearching ? "Searching global map..." : "No places found"}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 relative rounded-4xl shadow-xl overflow-hidden bg-gray-100 border border-gray-200">
            <iframe 
              title="Map View" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              src={mapUrl}
            ></iframe>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-gray-700"> {selectedPlaceName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore