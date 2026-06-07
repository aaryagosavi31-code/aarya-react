import { useState } from 'react'
import { useItinerary } from '../contexts/ItineraryContext'

const Itenary = () => {
  const { itinerary, confirmAddToItinerary, removeFromItinerary } = useItinerary()

  const [place, setPlace] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editPlace, setEditPlace] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const handleAddItem = () => {
    if (!place.trim() || !date || !time) return
    confirmAddToItinerary(date, time, notes, { place: place.trim(), type: 'place' })
    setPlace(''); setDate(''); setTime(''); setNotes('')
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditPlace(item.place)
    setEditDate(item.date)
    setEditTime(item.time)
    setEditNotes(item.notes || '')
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = (id) => {
    if (!editPlace.trim() || !editDate || !editTime) return
    removeFromItinerary(id)
    confirmAddToItinerary(editDate, editTime, editNotes, {
      place: editPlace.trim(),
      type: 'place',
      _forceId: id,
    })
    setEditingId(null)
  }

  const formatDateTime = (date, time) => {
    if (!date || !time) return ''
    return new Date(`${date}T${time}`).toLocaleString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] py-10 px-4 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="rounded-4xl bg-white shadow-2xl border border-orange-100 p-8">
          <h1 className="text-4xl font-bold text-orange-700 mb-3">Plan Your Itinerary</h1>
          <p className="text-gray-500 text-sm mb-6">Add places, eateries, and attractions to your Mumbai trip.</p>
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
          <div className="mt-6">
            <button
              onClick={handleAddItem}
              disabled={!place.trim() || !date || !time}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-white font-semibold shadow-lg transition hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Add Stop
            </button>
          </div>
        </div>

        <div className="rounded-4xl bg-white shadow-2xl border border-orange-100 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Itinerary</h2>

          {itinerary.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50 p-10 text-center text-orange-700">
              <p className="text-lg font-semibold">No stops yet — add one above or from the Explore / Eateries pages.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div key={item.id} className="rounded-3xl border border-gray-200 p-5 shadow-sm bg-gray-50 transition hover:shadow-md">
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <p className="text-xs uppercase text-orange-600 font-bold mb-2">Editing Stop {index + 1}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input type="text" value={editPlace} onChange={(e) => setEditPlace(e.target.value)} placeholder="Place name" className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                        <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                        <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                        <input type="text" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Notes (optional)" className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => saveEdit(item.id)} className="rounded-full bg-orange-500 text-white px-4 py-1.5 text-sm font-semibold hover:bg-orange-600 transition">Save</button>
                        <button onClick={cancelEdit} className="rounded-full bg-gray-200 text-gray-700 px-4 py-1.5 text-sm font-semibold hover:bg-gray-300 transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-xs uppercase text-orange-500 font-bold">
                         
                          </p>
                          <h3 className="text-lg font-semibold text-gray-800">{item.place}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{formatDateTime(item.date, item.time)}</p>
                          {item.notes && <p className="text-sm text-gray-400 italic mt-1">"{item.notes}"</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEdit(item)} className="text-sm font-semibold text-orange-500 border border-orange-200 px-3 py-1 rounded-full hover:bg-orange-50 transition">Edit</button>
                        <button onClick={() => removeFromItinerary(item.id)} className="text-sm font-semibold text-red-400 border border-red-100 px-3 py-1 rounded-full hover:bg-red-50 transition">Remove</button>
                      </div>
                    </div>
                  )}
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