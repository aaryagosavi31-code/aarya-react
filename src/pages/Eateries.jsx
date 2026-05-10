import React, { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ReactMarkdown from 'react-markdown'
import { useItinerary } from '../contexts/ItineraryContext'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' })

const Eateries = () => {
  const [selectedPlace, setSelectedPlace] = useState('')
  const [eateries, setEateries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { addToItinerary } = useItinerary()

  const places = [
    'Gateway of India',
    'Marine Drive',
    'Elephanta Caves',
    'Chhatrapati Shivaji Terminus',
    'Juhu Beach',
    'Siddhivinayak Temple',
    'Bandra Bandstand',
    'Worli Sea Face',
    'Fort Area',
    'Colaba',
    'Andheri',
    'Bhandup'
  ]

  const findEateries = async () => {
    if (!selectedPlace.trim()) {
      setError('Please select or enter a location')
      return
    }

    setLoading(true)
    setError('')
    setEateries([])

    try {
      const prompt = `
Find 5 popular restaurants and eateries near ${selectedPlace} in Mumbai. 
For each eatery, provide the information in this exact format:

1. **Restaurant Name** | Cuisine Type | ⭐ Rating (out of 5)
   - 📍 Area: (specific area)
   - 🍽️ Specialty: (main dish/specialty)
   - 💰 Price Range: (Budget/Mid/Premium)
   - ⏰ Best Time: (lunch/dinner/both)

2. **Restaurant Name** | Cuisine Type | ⭐ Rating
   ... and so on

Keep it concise and practical for travelers.`

      const result = await model.generateContent(prompt)
      const text = result.response.text()
      
     
      const eateriesArray = text.split(/\d+\.\s+\*\*/).filter(Boolean).map((item, idx) => ({
        id: idx,
        content: `**${item}`
      }))

      setEateries(eateriesArray.length > 0 ? eateriesArray : [{ id: 0, content: text }])
    } catch (err) {
      console.error('Error fetching eateries:', err)
      setError('Failed to fetch eateries. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    findEateries()
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] py-12 px-4 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="rounded-4xl bg-white shadow-2xl border border-orange-100 p-8">
          <h1 className="text-4xl font-bold text-orange-700 mb-3">Find Local Eateries</h1>
          <p className="text-gray-600 mb-8">
            Select a location in Mumbai and discover the best restaurants nearby
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select a Location
                </label>
                <select
                  value={selectedPlace}
                  onChange={(e) => setSelectedPlace(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                >
                  <option value="">Choose a place...</option>
                  {places.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
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
              {selectedPlace ? `Eateries near ${selectedPlace}` : 'Search Results'}
            </h2>
            {eateries.length > 0 && (
              <p className="text-gray-500">Found {eateries.length} recommendations</p>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-orange-300 border-t-orange-600 rounded-full mb-4"></div>
              <p className="text-gray-600">Finding the best eateries for you...</p>
            </div>
          )}

          {!loading && eateries.length === 0 && !error && (
            <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50 p-12 text-center text-orange-700">
              <p className="text-lg font-semibold">Select a location and click "Find Eateries" to discover restaurants</p>
            </div>
          )}

          {!loading && eateries.length > 0 && (
            <div className="space-y-6">
              {eateries.map((eatery) => (
                <div
                  key={eatery.id}
                  className="rounded-3xl border border-gray-200 p-6 bg-linear-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition relative"
                >
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => addToItinerary({
                        name: eatery.content.split('**')[1]?.split('|')[0]?.trim() || 'Restaurant',
                        place: eatery.content.split('**')[1]?.split('|')[0]?.trim() || 'Restaurant',
                        type: 'eatery'
                      })}
                      className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition"
                    >
                      Add to Itinerary
                    </button>
                  </div>
                  <div className="prose prose-orange max-w-none text-gray-800 pr-32">
                    <ReactMarkdown>{eatery.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Eateries
