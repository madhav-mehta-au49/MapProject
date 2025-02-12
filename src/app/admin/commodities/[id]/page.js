'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { use } from 'react'
import { toast } from 'react-hot-toast'

export default function CommodityPage({ params }) {
  const id = use(params).id
  const [commodity, setCommodity] = useState({
    name: '',
    company: '',
    weight: '',
    longitude: '',
    latitude: ''
  })
  const router = useRouter()

  useEffect(() => {
    if (id !== 'new') {
      fetchCommodity()
    }
  }, [id])

  const fetchCommodity = async () => {
    try {
      const response = await fetch(`/api/commodities/${id}`)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      if (data) {
        setCommodity({
          name: data.name || '',
          company: data.company || '',
          weight: data.weight || '',
          longitude: data.longitude || '',
          latitude: data.latitude || ''
        })
      }
    } catch (error) {
      console.error('Error fetching commodity:', error)
      router.push('/admin/commodities')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = id === 'new' ? 'POST' : 'PUT'
    const url = id === 'new' ? '/api/commodities' : `/api/commodities/${id}`

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commodity)
      })

      if (response.ok) {
        toast.success(id === 'new' ? 'Commodity created successfully' : 'Commodity updated successfully')
        router.push('/admin/commodities')
      } else {
        toast.error('Failed to save commodity')
      }
    } catch (error) {
      toast.error('Error saving commodity')
      console.error('Error saving commodity:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin/commodities')}
          className="mb-4 sm:mb-6 flex items-center text-gray-800 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="text-sm sm:text-base">Back to Commodities</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            {id === 'new' ? 'Add New Commodity' : 'Edit Commodity'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
              <input
                type="text"
                value={commodity.name}
                onChange={(e) => setCommodity({ ...commodity, name: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Company</label>
              <input
                type="text"
                value={commodity.company}
                onChange={(e) => setCommodity({ ...commodity, company: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={commodity.weight}
                onChange={(e) => setCommodity({ ...commodity, weight: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={commodity.latitude}
                  onChange={(e) => setCommodity({ ...commodity, latitude: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={commodity.longitude}
                  onChange={(e) => setCommodity({ ...commodity, longitude: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/admin/commodities')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md text-sm sm:text-base font-medium"
              >
                {id === 'new' ? 'Create Commodity' : 'Update Commodity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
