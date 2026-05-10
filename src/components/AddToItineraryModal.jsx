import React, { useState } from 'react'
import { useItinerary } from '../contexts/ItineraryContext'

const AddToItineraryModal = () => {
  const { showAddModal, pendingItem, confirmAddToItinerary, closeModal } = useItinerary()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  if (!showAddModal || !pendingItem) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!date || !time) return
    confirmAddToItinerary(date, time, notes)
    setDate('')
    setTime('')
    setNotes('')
  }

  const handleClose = () => {
    setDate('')
    setTime('')
    setNotes('')
    closeModal()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Add to Itinerary</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Adding:</p>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <p className="font-semibold text-orange-800">
              {pendingItem.place || pendingItem.title || pendingItem.name}
            </p>
            <p className="text-sm text-orange-600">
              {pendingItem.type === 'eatery' ? 'Restaurant' : 'Place'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes for this stop..."
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-3 rounded-2xl font-semibold hover:bg-orange-600 transition"
            >
              Add to Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddToItineraryModal