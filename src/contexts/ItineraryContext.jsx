import React, { createContext, useContext, useState, useEffect } from 'react'

const ItineraryContext = createContext()

export const useItinerary = () => {
  const context = useContext(ItineraryContext)
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider')
  }
  return context
}

export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [pendingItem, setPendingItem] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('mumbai-itinerary')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setItinerary(parsed)
      } catch (error) {
        console.error('Error loading itinerary:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mumbai-itinerary', JSON.stringify(itinerary))
  }, [itinerary])

  const addToItinerary = (item) => {
    setPendingItem(item)
    setShowAddModal(true)
  }

  const confirmAddToItinerary = (date, time, notes = '') => {
    if (!pendingItem || !date || !time) return

    const newItem = {
      id: Date.now(),
      place: pendingItem.place || pendingItem.title || pendingItem.name,
      date,
      time,
      notes: notes.trim(),
      type: pendingItem.type || 'place', 
      createdAt: new Date(`${date}T${time}`)
    }

    setItinerary((current) => {
      const next = [...current, newItem].sort((a, b) => a.createdAt - b.createdAt)
      return next
    })

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

  const value = {
    itinerary,
    showAddModal,
    pendingItem,
    addToItinerary,
    confirmAddToItinerary,
    removeFromItinerary,
    closeModal
  }

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  )
}