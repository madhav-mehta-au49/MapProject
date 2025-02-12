'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function CommoditiesPage() {
    const [commodities, setCommodities] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('name')
    const [sortDirection, setSortDirection] = useState('asc')
    const itemsPerPage = 10
    const router = useRouter()

    useEffect(() => {
        fetchCommodities()
    }, [])

    const fetchCommodities = async () => {
        const response = await fetch('/api/commodities')
        const data = await response.json()
        setCommodities(data.data || [])
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const handleEdit = (id) => {
        router.push(`/admin/commodities/${id}`)
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this commodity?')) {
            try {
                const response = await fetch(`/api/commodities/${id}`, {
                    method: 'DELETE',
                })
                const data = await response.json()
                if (data.success) {
                    toast.success('Commodity deleted successfully')
                    fetchCommodities()
                } else {
                    toast.error('Failed to delete commodity')
                }
            } catch (error) {
                toast.error('Error deleting commodity')
            }
        }
    }

    const filteredCommodities = commodities.filter(commodity =>
        commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commodity.company.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredCommodities.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage)

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Commodities</h1>
                    <button
                        onClick={() => router.push('/admin/commodities/new')}
                        className="w-full sm:w-auto bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md font-medium"
                    >
                        Add New Commodity
                    </button>
                </div>

                <div className="mb-6 relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search commodities..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm sm:text-base"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-100 text-center">ID</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-100 text-center">Name</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-100 text-center">Company</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-100 text-center">Weight (kg)</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-100 text-center">Latitude</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-100 text-center">Longitude</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-100 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredCommodities.map((commodity) => (
                                    <tr key={commodity.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900 text-center">{commodity.id}</td>
                                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900 text-center">{commodity.name}</td>
                                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900 text-center">{commodity.company}</td>
                                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900 text-center">{commodity.weight}</td>
                                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900 text-center">{commodity.latitude.toFixed(4)}</td>
                                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900 text-center">{commodity.longitude.toFixed(4)}</td>
                                        <td className="px-4 sm:px-6 py-3 flex justify-center space-x-2 sm:space-x-3">
                                            <button
                                                onClick={() => handleEdit(commodity.id)}
                                                className="p-1.5 sm:p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                                title="Edit"
                                            >
                                                <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(commodity.id)}
                                                className="p-1.5 sm:p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                                                title="Delete"
                                            >
                                                <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200 gap-4 sm:gap-0">
                        <div className="text-sm text-gray-700 text-center sm:text-left">
                            <p>
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(indexOfLastItem, commodities.length)}</span> of{' '}
                                <span className="font-medium">{commodities.length}</span> results
                            </p>
                        </div>

                        <nav className="flex justify-center sm:justify-end space-x-1 sm:space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx + 1)}
                                    className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                        currentPage === idx + 1
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}
