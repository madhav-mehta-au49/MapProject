'use client'
import { useState, useEffect } from 'react'
import { PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function ExportersPage() {
    const [exporters, setExporters] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortField, setSortField] = useState('name')
    const [sortDirection, setSortDirection] = useState('asc')
    const itemsPerPage = 5
    const router = useRouter()

    useEffect(() => {
        fetchExporters()
    }, [])

    const fetchExporters = async () => {
        try {
            const response = await fetch('/api/exporters')
            const data = await response.json()
            setExporters(data.data || [])
        } catch (error) {
            console.error('Error fetching exporters:', error)
        }
    }

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exporter?')) {
            try {
                const response = await fetch(`/api/exporters/${id}`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    toast.success('Exporter deleted successfully')
                    fetchExporters()
                } else {
                    toast.error('Failed to delete exporter')
                }
            } catch (error) {
                toast.error('Error deleting exporter')
            }
        }
    }

    const filteredExporters = exporters.filter(exporter =>
        exporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exporter.company.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredExporters.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredExporters.length / itemsPerPage)

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Exporters</h1>
                    <button
                        onClick={() => router.push('/admin/exporters/new')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md font-medium"
                    >
                        Add New Exporter
                    </button>
                </div>
                <div className="mb-6 relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search exporters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-900"
                    />
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">ID</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">Name</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">Company</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">Location</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">Quantity (MT)</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">Year</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">Commodity ID</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {currentItems.map((exporter) => (
                                    <tr key={exporter.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{exporter.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{exporter.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{exporter.company}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{exporter.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{exporter.quantity_mt}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{exporter.year}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{exporter.commodityId}</td>
                                        <td className="px-6 py-4 flex justify-center space-x-3">
                                            <button
                                                onClick={() => router.push(`/admin/exporters/${exporter.id}`)}
                                                className="inline-flex items-center justify-center p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                                title='Edit'
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exporter.id)}
                                                className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                                                title="Delete"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(indexOfLastItem, exporters.length)}</span> of{' '}
                                        <span className="font-medium">{exporters.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalPages)].map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentPage(idx + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === idx + 1
                                                    ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                    }`}
                                            >
                                                {idx + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
