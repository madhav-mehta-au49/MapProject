'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { use } from 'react'
import { toast } from 'react-hot-toast'

export default function ExporterPage({ params }) {
    const id = use(params).id
    const [exporter, setExporter] = useState({
        name: '',
        company: '',
        location: '',
        quantity_mt: '',
        year: '',
        commodityId: ''
    })
    const [commodities, setCommodities] = useState([])
    const router = useRouter()

    useEffect(() => {
        fetchCommodities()
        if (id !== 'new') {
            fetchExporter()
        }
    }, [id])

    const fetchCommodities = async () => {
        const response = await fetch('/api/commodities')
        const data = await response.json()
        setCommodities(data.data || [])
    }

    const fetchExporter = async () => {
        try {
            const response = await fetch(`/api/exporters/${id}`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            if (data) {
                setExporter({
                    name: data.data.name || '',
                    company: data.data.company || '',
                    location: data.data.location || '',
                    quantity_mt: data.data.quantity_mt || '',
                    year: data.data.year || '',
                    commodityId: data.data.commodityId || ''
                })
            }
        } catch (error) {
            console.error('Error fetching exporter:', error)
            router.push('/admin/exporters')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const method = id === 'new' ? 'POST' : 'PUT'
        const url = id === 'new' ? '/api/exporters' : `/api/exporters/${id}`

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exporter)
            })

            if (response.ok) {
                toast.success(id === 'new' ? 'Exporter created successfully' : 'Exporter updated successfully')
                router.push('/admin/exporters')
            } else {
                toast.error('Failed to save exporter')
            }
        } catch (error) {
            toast.error('Error saving exporter')
            console.error('Error saving exporter:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => router.push('/admin/exporters')}
                    className="mb-6 flex items-center text-gray-800 hover:text-gray-900 transition-colors font-medium"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Exporters
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">
                        {id === 'new' ? 'Add New Exporter' : 'Edit Exporter'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
                            <input
                                type="text"
                                value={exporter.name}
                                onChange={(e) => setExporter({ ...exporter, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Company</label>
                            <input
                                type="text"
                                value={exporter.company}
                                onChange={(e) => setExporter({ ...exporter, company: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
                            <input
                                type="text"
                                value={exporter.location}
                                onChange={(e) => setExporter({ ...exporter, location: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Quantity (MT)</label>
                            <input
                                type="number"
                                value={exporter.quantity_mt}
                                onChange={(e) => setExporter({ ...exporter, quantity_mt: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Year</label>
                            <input
                                type="number"
                                value={exporter.year}
                                onChange={(e) => setExporter({ ...exporter, year: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Commodity</label>
                            <select
                                value={exporter.commodityId}
                                onChange={(e) => setExporter({ ...exporter, commodityId: e.target.value })}
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
                                onClick={() => router.push('/admin/exporters')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md font-medium"
                            >
                                {id === 'new' ? 'Create Exporter' : 'Update Exporter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
