import { createContext, useContext, useState, useEffect } from 'react'

const ItineraryContext = createContext()
 
export const useItinerary = () => {
  const context = useContext(ItineraryContext)
  if (!context) throw new Error('useItinerary must be used within an ItineraryProvider')
  return context
}
 
export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [pendingItem, setPendingItem] = useState(null)
 
  useEffect(() => {
    const saved = localStorage.getItem('mumbai-itinerary')
    if (saved) {
      try { setItinerary(JSON.parse(saved)) } catch (e) { console.error(e) }
    }
  }, [])
 
  useEffect(() => {
    localStorage.setItem('mumbai-itinerary', JSON.stringify(itinerary))
  }, [itinerary])
 
  const addToItinerary = (item) => {
    setPendingItem(item)
    setShowAddModal(true)
  }
 
  const confirmAddToItinerary = (date, time, notes = '', overrideItem = null) => {
    const source = overrideItem || pendingItem
    if (!source || !date || !time) return
 
    const newItem = {
      id: overrideItem?._forceId || Date.now(),
      place: source.place || source.title || source.name || 'Unknown',
      date,
      time,
      notes: notes.trim(),
      type: source.type || 'place',
      createdAt: new Date(`${date}T${time}`).toISOString(),
    }
 
    setItinerary((current) =>
      [...current, newItem].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    )
 
    setPendingItem(null)
    setShowAddModal(false)
  }
 
  const removeFromItinerary = (id) => {
    setItinerary((current) => current.filter((item) => item.id !== id))
  }
 
  const closeModal = () => {
    setShowAddModal(false)
    setPendingItem(null)
  }
 
  return (
    <ItineraryContext.Provider value={{
      itinerary,
      showAddModal,
      pendingItem,
      addToItinerary,
      confirmAddToItinerary,
      removeFromItinerary,
      closeModal,
    }}>
      {children}
    </ItineraryContext.Provider>
  )
}