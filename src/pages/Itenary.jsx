import React, { useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import ReactMarkdown from 'react-markdown'
import { useItinerary } from '../contexts/ItineraryContext'
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

const Itenary = () => {
  const [place, setPlace] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  
  // Gemini States
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const { itinerary, addToItinerary: addToItineraryContext, removeFromItinerary } = useItinerary()

  const getGeminiResponse = async (placeName) => {
    if (!placeName) return;
    setLoading(true);
    try {
      const prompt = `
  Format the response for ${placeName} strictly as follows:
  ### 📍 Visiting Tip
  (Tip here)
  
  ### 🍴 Food Recommendation
  (Food here)
  
  ### ⏰ Best Time
  (Time here)
  
  Use clear headers and bullet points.
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!place.trim() || !date || !time) return

    const newItem = {
      place: place.trim(),
      date,
      time,
      notes: notes.trim(),
      type: 'place'
    }

    addToItineraryContext(newItem)

    setPlace('')
    setDate('')
    setTime('')
    setNotes('')
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] py-10 px-4 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
  
        <div className="rounded-4xl bg-white shadow-2xl border border-orange-100 p-8">
          <h1 className="text-4xl font-bold text-orange-700 mb-3">Plan Your Itinerary</h1>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">Place</span>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Enter location name"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">Time</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">Notes (optional)</span>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note for this stop"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleAddItem}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-white font-semibold shadow-lg transition hover:bg-orange-600"
            >
              Add Stop
            </button>
          </div>
        </div>

      
        <div className="p-6 bg-white rounded-4xl shadow-xl border border-orange-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Travel Assistant</h3>
            <button
              onClick={() => getGeminiResponse(itinerary[0]?.place || 'Mumbai')}
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors text-sm"
              disabled={loading}
            >
              {loading ? 'Asking Gemini...' : 'Get Tips for Next Stop'}
            </button>
          </div>

          {response && (
            <div className="mt-4 p-4 bg-orange-50 rounded-2xl text-gray-800 border border-orange-100">
              <div className="mt-4 p-6 bg-white rounded-3xl border-2 border-orange-100 shadow-inner overflow-hidden">
                <div className="prose prose-orange max-w-none text-gray-800">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-4xl bg-white shadow-2xl border border-orange-100 p-8">
           <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Itinerary</h2>
           {itinerary.length === 0 ? (
             <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50 p-10 text-center text-orange-700">
               No itinerary items yet.
             </div>
           ) : (
             <div className="space-y-4">
               {itinerary.map((item, index) => (
                 <div key={item.id} className="rounded-3xl border border-gray-200 p-5 shadow-sm bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs uppercase text-orange-600 font-bold">Stop {index + 1}</p>
                        <h3 className="text-xl font-semibold">{item.place}</h3>
                      </div>
                      <button onClick={() => removeFromItinerary(item.id)} className="text-red-500 text-sm font-bold">Remove</button>
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

export default Itenary





