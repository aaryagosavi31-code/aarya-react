import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ReactMarkdown from 'react-markdown'
import { useItinerary } from '../contexts/ItineraryContext'
import { channels } from '../data/channels'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' })

const getThumbnail = (embedId) => `https://img.youtube.com/vi/${embedId}/hqdefault.jpg`

const extractEateryTitle = (content) => {
  const match = content.match(/\*\*(.*?)\s*\|/)
  return match?.[1]?.trim() || 'Restaurant'
}

const parseEateries = (text, startIdx = 0) =>
  text
    .split(/\d+\.\s+\*\*/)
    .filter(Boolean)
    .map((item, idx) => ({
      id: startIdx + idx,
      content: `**${item.trim()}`,
    }))

const useChannelAvatar = (channelId) => {
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    if (!channelId) return
    const url = `https://www.youtube.com/channel/${channelId}`
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
      .then((res) => res.json())
      .then((data) => {
        if (data.thumbnail_url) setAvatarUrl(data.thumbnail_url)
      })
      .catch(() => {})
  }, [channelId])

  return avatarUrl
}

function VideoModal({ video, onClose }) {
  if (!video) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold leading-none transition"
        >
          &times;
        </button>
        <div className={`relative w-full ${video.isShort ? 'aspect-9/16 max-w-xs mx-auto' : 'aspect-video'}`}>
          <iframe
            src={`https://www.youtube.com/embed/${video.embedId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div className="p-4 bg-gray-900">
          <p className="text-white font-semibold text-sm line-clamp-2">{video.title}</p>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ video, accentColor, onClick }) {
  return (
    <button
      onClick={() => onClick(video)}
      className="group shrink-0 w-52 text-left focus:outline-none"
    >
      <div className="relative rounded-xl overflow-hidden shadow-md aspect-video bg-gray-100 mb-2">
        <img
          src={getThumbnail(video.embedId)}
          alt={video.title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          onError={(event) => {
            event.target.onerror = null
            event.target.src = 'https://placehold.co/400x225/FFF7ED/f97316?text=Video'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: accentColor }}
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {video.isShort && (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            SHORT
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug px-0.5">
        {video.title}
      </p>
    </button>
  )
}

function ChannelRow({ channel, onVideoClick }) {
  const scrollRef = useRef(null)
  const avatarUrl = useChannelAvatar(channel.channelId)

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 240, behavior: 'smooth' })
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: channel.accentColor }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={channel.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            channel.name.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-base leading-tight truncate">{channel.name}</p>
          <p className="text-xs text-gray-500 truncate">{channel.description}</p>
        </div>
        <a
          href={channel.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
        >
          Visit ↗
        </a>
      </div>

      <div className="relative group/row">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition hover:shadow-lg"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {channel.videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              accentColor={channel.accentColor}
              onClick={onVideoClick}
            />
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition hover:shadow-lg"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 border-b border-orange-100" />
    </div>
  )
}

function ChannelsSection() {
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <div className="rounded-4xl bg-white shadow-2xl border border-orange-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🎬</span>
        <div>
          <h2 className="text-2xl font-bold text-orange-700 leading-tight">Mumbai Food Channels</h2>
          <p className="text-gray-500 text-sm">Watch the best street food content from Mumbai's top creators</p>
        </div>
      </div>

      {channels.map((channel) => (
        <ChannelRow
          key={channel.id}
          channel={channel}
          onVideoClick={setActiveVideo}
        />
      ))}

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  )
}

const famousSpotsByFood = {
  'Vada Pav': {
    title: 'Aram Vada Pav',
    location: 'Dadar',
    description: 'Iconic Mumbai stall known for its spicy chutney and soft buns.',
  },
  'Pav Bhaji': {
    title: 'Sardar Pav Bhaji',
    location: 'Tardeo',
    description: 'Legendary eatery serving buttery, flavour-packed pav bhaji.',
  },
  'Bhel Puri': {
    title: 'Juhu Beach Bhel Puri Stalls',
    location: 'Juhu Beach',
    description: 'Famous beachside vendors dishing up fresh, crunchy bhel puri.',
  },
  'Pani Puri': {
    title: 'Elco Pani Puri Center',
    location: 'Bandra',
    description: 'A buzzing spot known for punchy pani puris and lively street food.',
  },
  'Misal Pav': {
    title: 'Aaswad',
    location: 'Dadar East',
    description: 'Beloved Maharashtrian restaurant famous for its spicy misal pav.',
  },
  'Bombay Sandwich': {
    title: 'Cafe Madras',
    location: 'Matunga',
    description: 'Classic South Bombay café praised for its crisp Bombay sandwiches.',
  },
}

const matchFoodKey = (query) =>
  Object.keys(famousSpotsByFood).find(
    (k) => k.toLowerCase() === query?.toLowerCase()
  ) || null

const Eateries = () => {
  const [selectedPlace, setSelectedPlace] = useState('')
  const [foodQuery, setFoodQuery] = useState('')
  const [eateries, setEateries] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [lastSearchedPlace, setLastSearchedPlace] = useState('')
  const [lastSearchWasFood, setLastSearchWasFood] = useState(false)

  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const autoSearchRef = useRef(false)
  const { addToItinerary } = useItinerary()

  useEffect(() => {
    if (location.hash !== '#options') return
    if (loading) return
    const optionsElement = document.getElementById('options')
    optionsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.hash, loading, eateries.length])

  const extractEateryArea = (content) => {
    const match = content.match(/- 📍 Area:\s*(.+)/i)
    return match?.[1]?.trim() || ''
  }

  const getEateryMapQuery = (eatery) => {
    const title = extractEateryTitle(eatery.content)
    const area = extractEateryArea(eatery.content)
    const query = area ? `${title} ${area}, Mumbai` : `${title}, Mumbai`
    return encodeURIComponent(query)
  }

  const findEateries = async (isLoadMore = false, searchText = '') => {
    const locationToSearch = isLoadMore
      ? lastSearchedPlace
      : (searchText.trim() || selectedPlace.trim())

    if (!locationToSearch) {
      setError('Please enter a location or food item')
      return
    }

    const isFood = !!matchFoodKey(locationToSearch)

    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setEateries([])
      setLastSearchedPlace(locationToSearch)
      setLastSearchWasFood(isFood)
    }
    setError('')

    try {
      const existingNames = eateries.map(e => extractEateryTitle(e.content)).filter(name => name !== 'Restaurant')
      const exclusionClause = existingNames.length > 0
        ? `Do NOT include any of these restaurants: [${existingNames.join(', ')}]. Provide entirely different alternatives.`
        : ''

      const prompt = `Find 5 popular restaurants and eateries near ${locationToSearch} in Mumbai. ${exclusionClause}\n\nFor each eatery, provide the information in this exact format:\n\n1. **Restaurant Name** | Cuisine Type | ⭐ Rating (out of 5)\n   - 📍 Area: (specific area)\n   - 🍽️ Specialty: (main dish/specialty)\n   - 💰 Price Range: (Budget/Mid/Premium)\n   - ⏰ Best Time: (lunch/dinner/both)\n\n2. **Restaurant Name** | Cuisine Type | ⭐ Rating\n... and so on\n\nDo not include any introductory text, greeting, or conversational filler before the first restaurant listing. Start directly with the string "1. **Restaurant Name**". Keep it concise and practical for travelers.`

      const result = await model.generateContent(prompt)
      let text = result.response.text().trim()

      const firstListingIndex = text.search(/\d+\.\s+\*\*/)
      if (firstListingIndex !== -1) {
        text = text.substring(firstListingIndex)
      }

      const parsed = parseEateries(text, eateries.length)

      if (isLoadMore) {
        setEateries(prev => [...prev, ...parsed])
      } else {
        setEateries(parsed.length > 0 ? parsed : [{ id: 0, content: text }])
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch eateries. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    findEateries(false)
  }

  useEffect(() => {
    const food = searchParams.get('food')?.trim()
    if (food) {
      setSelectedPlace(food)
      setFoodQuery(food)
      if (!autoSearchRef.current) {
        autoSearchRef.current = true
        findEateries(false, food)
      }
    }
  }, [searchParams])

  const normalizedFoodKey = matchFoodKey(foodQuery) || matchFoodKey(lastSearchedPlace)
  const popularFoodSpot = normalizedFoodKey ? famousSpotsByFood[normalizedFoodKey] : null

  const resultsTitle = lastSearchWasFood || normalizedFoodKey
    ? `Best places to enjoy ${lastSearchedPlace || foodQuery}`
    : lastSearchedPlace
      ? `Eateries near ${lastSearchedPlace}`
      : 'Search Results'

  return (
    <div className="min-h-screen bg-[#FFF7ED] py-12 px-4 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <ChannelsSection />

        {(foodQuery || normalizedFoodKey) && (
          <div className="rounded-4xl bg-orange-50 border border-orange-200 p-8">
            <h2 className="text-3xl font-bold text-orange-700 mb-3">Famous spot for {foodQuery || lastSearchedPlace}</h2>
            <p className="text-gray-700 leading-relaxed">
              {popularFoodSpot
                ? `${popularFoodSpot.title} in ${popularFoodSpot.location} is one of Mumbai's most loved places for ${foodQuery || lastSearchedPlace}. ${popularFoodSpot.description}`
                : `Discover Mumbai's top spots for ${foodQuery || lastSearchedPlace} across the city.`}
            </p>
          </div>
        )}

        <div id="options" className="rounded-4xl bg-white shadow-2xl border border-orange-100 p-8">
          <h1 className="text-4xl font-bold text-orange-700 mb-3">Find Local Eateries</h1>
          <p className="text-gray-600 mb-8">Type a location or food item in Mumbai and discover the best restaurants nearby</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter a location or food item</label>
                <input
                  type="text"
                  value={selectedPlace}
                  onChange={(event) => setSelectedPlace(event.target.value)}
                  placeholder="e.g. Bandra, Colaba, Vada Pav, Pav Bhaji..."
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white text-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading || loadingMore}
                  className="w-full lg:w-auto inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-white font-semibold shadow-lg transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Find Eateries'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-4xl bg-white shadow-2xl border border-orange-100 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {resultsTitle}
            </h2>
            {eateries.length > 0 && <p className="text-gray-500">Found {eateries.length} recommendations</p>}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-orange-300 border-t-orange-600 rounded-full mb-4" />
              <p className="text-gray-600">Finding the best eateries for you...</p>
            </div>
          )}

          {!loading && eateries.length === 0 && !error && (
            <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50 p-12 text-center text-orange-700">
              <p className="text-lg font-semibold">Type a location and click "Find Eateries" to discover restaurants</p>
            </div>
          )}

          {eateries.length > 0 && (
            <div className="space-y-6">
              {eateries.map((eatery) => (
                <div
                  key={eatery.id}
                  className="rounded-3xl border border-gray-200 p-6 bg-linear-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition relative"
                >
                  <div className="absolute top-4 right-4 flex flex-col gap-3">
                    <button
                      onClick={() =>
                        addToItinerary({
                          name: extractEateryTitle(eatery.content),
                          place: extractEateryTitle(eatery.content),
                          type: 'eatery',
                        })
                      }
                      className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition"
                    >
                      Add to Itinerary
                    </button>
                    <button
                      onClick={() => navigate(`/explore?place=${getEateryMapQuery(eatery)}#map-view`)}
                      className="bg-white text-orange-600 border border-orange-300 px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-50 transition"
                    >
                      Show on Map
                    </button>
                  </div>
                  <div className="prose prose-orange max-w-none text-gray-800 pr-32">
                    <ReactMarkdown>{eatery.content}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {!loading && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => findEateries(true)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-3 rounded-full border-2 border-orange-500 px-8 py-3 text-orange-600 font-bold shadow-sm transition hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-orange-300 border-t-orange-600 rounded-full" />
                        Loading alternatives...
                      </>
                    ) : (
                      '✨ Show More Places'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Eateries