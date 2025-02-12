'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { use } from 'react'
import { toast } from 'react-hot-toast'

export default function ImporterPage({ params }) {
  const id = use(params).id
  const [importer, setImporter] = useState({
    name: '',
    company: '',
    location: '',
    quantity_mt: '',
    year: '',
    longitude: '',
    latitude: '',
    commodityId: ''
  })
  const [commodities, setCommodities] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchCommodities()
    if (id !== 'new') {
      fetchImporter()
    }
  }, [id])

  const fetchCommodities = async () => {
    const response = await fetch('/api/commodities')
    const data = await response.json()
    setCommodities(data.data || [])
  }

  const fetchImporter = async () => {
    try {
      const response = await fetch(`/api/importers/${id}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      if (data) {
        setImporter({
          name: data.data.name || '',
          company: data.data.company || '',
          location: data.data.location || '',
          quantity_mt: data.data.quantity_mt || '',
          year: data.data.year || '',
          longitude: data.data.longitude || '',
          latitude: data.data.latitude || '',
          commodityId: data.data.commodityId || ''
        })
      }
    } catch (error) {
      console.error('Error fetching importer:', error)
      router.push('/admin/importers')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = id === 'new' ? 'POST' : 'PUT'
    const url = id === 'new' ? '/api/importers' : `/api/importers/${id}`

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importer)
      })

      if (response.ok) {
        toast.success(id === 'new' ? 'Importer created successfully' : 'Importer updated successfully')
        router.push('/admin/importers')
      } else {
        toast.error('Failed to save importer')
      }
    } catch (error) {
      toast.error('Error saving importer')
      console.error('Error saving importer:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin/importers')}
          className="mb-6 flex items-center text-gray-800 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Importers
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            {id === 'new' ? 'Add New Importer' : 'Edit Importer'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
              <input
                type="text"
                value={importer.name}
                onChange={(e) => setImporter({ ...importer, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Company</label>
              <input
                type="text"
                value={importer.company}
                onChange={(e) => setImporter({ ...importer, company: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
              <input
                type="text"
                value={importer.location}
                onChange={(e) => setImporter({ ...importer, location: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Quantity (MT)</label>
              <input
                type="number"
                value={importer.quantity_mt}
                onChange={(e) => setImporter({ ...importer, quantity_mt: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Year</label>
              <input
                type="number"
                value={importer.year}
                onChange={(e) => setImporter({ ...importer, year: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={importer.latitude}
                  onChange={(e) => setImporter({ ...importer, latitude: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={importer.longitude}
                  onChange={(e) => setImporter({ ...importer, longitude: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Commodity</label>
              <select
                value={importer.commodityId}
                onChange={(e) => setImporter({ ...importer, commodityId: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                required
              >
                <option value="">Select Commodity</option>
                {[...new Set(commodities.map(c => c.name))].map((name) => {
                  const commodity = commodities.find(c => c.name === name)
                  return (
                    <option key={commodity.id} value={commodity.id}>
                      {name}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/admin/importers')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md font-medium"
              >
                {id === 'new' ? 'Create Importer' : 'Update Importer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
