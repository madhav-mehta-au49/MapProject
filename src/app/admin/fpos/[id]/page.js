'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { use } from 'react'
import { toast } from 'react-hot-toast'

export default function FPOPage({ params }) {
    const id = use(params).id
    const [fpo, setFpo] = useState({
        name: '',
        location: '',
        members: '',
        commodityId: ''
    })
    const [commodities, setCommodities] = useState([])
    const router = useRouter()

    useEffect(() => {
        fetchCommodities()
        if (id !== 'new') {
            fetchFpo()
        }
    }, [id])

    const fetchCommodities = async () => {
        const response = await fetch('/api/commodities')
        const data = await response.json()
        setCommodities(data.data || [])
    }

    const fetchFpo = async () => {
        try {
            const response = await fetch(`/api/fpos/${id}`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            if (data) {
                setFpo({
                    name: data.data.name || '',
                    location: data.data.location || '',
                    members: data.data.members || '',
                    commodityId: data.data.commodityId || ''
                })
            }
        } catch (error) {
            console.error('Error fetching FPO:', error)
            router.push('/admin/fpos')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const method = id === 'new' ? 'POST' : 'PUT'
        const url = id === 'new' ? '/api/fpos' : `/api/fpos/${id}`

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fpo)
            })

            if (response.ok) {
                toast.success(id === 'new' ? 'FPO created successfully' : 'FPO updated successfully')
                router.push('/admin/fpos')
            } else {
                toast.error('Failed to save FPO')
            }
        } catch (error) {
            toast.error('Error saving FPO')
            console.error('Error saving FPO:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => router.push('/admin/fpos')}
                    className="mb-6 flex items-center text-gray-800 hover:text-gray-900 transition-colors font-medium"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to FPOs
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">
                        {id === 'new' ? 'Add New FPO' : 'Edit FPO'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
                            <input
                                type="text"
                                value={fpo.name}
                                onChange={(e) => setFpo({ ...fpo, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
                            <input
                                type="text"
                                value={fpo.location}
                                onChange={(e) => setFpo({ ...fpo, location: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Members</label>
                            <input
                                type="number"
                                value={fpo.members}
                                onChange={(e) => setFpo({ ...fpo, members: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Commodity</label>
                            <select
                                value={fpo.commodityId}
                                onChange={(e) => setFpo({ ...fpo, commodityId: e.target.value })}
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
                                onClick={() => router.push('/admin/fpos')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md font-medium"
                            >
                                {id === 'new' ? 'Create FPO' : 'Update FPO'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
