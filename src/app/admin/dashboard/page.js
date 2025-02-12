'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function DashboardPage() {
  const [commodities, setCommodities] = useState([])
  const [importers, setImporters] = useState([])
  const [exporters, setExporters] = useState([])
  const [fpos, setFpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCommodities, setVisibleCommodities] = useState(10)
  const [sortBy, setSortBy] = useState('weight')
  const [filterBy, setFilterBy] = useState('all')

  const [stats, setStats] = useState([
    { name: 'Total Commodities', value: '0', icon: '📦' },
    { name: 'Active Importers', value: '0', icon: '🚢' },
    { name: 'Active Exporters', value: '0', icon: '🌍' },
    { name: 'Total Weight', value: '0 kg', icon: '⚖️' },
    { name: 'Total Import', value: '0 MT', icon: '📥' },
    { name: 'Total Export', value: '0 MT', icon: '📤' },
    { name: 'Total FPOs', value: '0', icon: '👥' },
    { name: 'Total Members', value: '0', icon: '👨‍🌾' }
  ])

  const COLORS = [
    '#2563eb', // Dark blue
    '#dc2626', // Dark red
    '#059669', // Dark green
    '#7c3aed', // Dark purple
    '#c026d3', // Dark pink
    '#0891b2', // Dark cyan
    '#ca8a04', // Dark yellow
    '#be123c', // Dark rose
    '#4f46e5', // Dark indigo
    '#0d9488'  // Dark teal
  ]

  const EXPORTER_COLORS = [
    '#f97316', '#84cc16', '#06b6d4', '#8b5cf6', '#ec4899',
    '#f43f5e', '#facc15', '#a855f7', '#14b8a6', '#f59e0b'
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commoditiesRes = await fetch('/api/commodities')
        const { data: commoditiesData } = await commoditiesRes.json()
        setCommodities(commoditiesData || [])

        const importersRes = await fetch('/api/importers')
        const { data: importersData } = await importersRes.json()
        setImporters(importersData || [])

        const exportersRes = await fetch('/api/exporters')
        const { data: exportersData } = await exportersRes.json()
        setExporters(exportersData || [])

        const fposRes = await fetch('/api/fpos')
        const { data: fposData } = await fposRes.json()
        setFpos(fposData || [])

        setStats([
          { name: 'Total Commodities', value: String(commoditiesData?.length || 0), icon: '📦' },
          { name: 'Active Importers', value: String(importersData?.length || 0), icon: '🚢' },
          { name: 'Active Exporters', value: String(exportersData?.length || 0), icon: '🌍' },
          { name: 'Total Weight', value: `${commoditiesData?.reduce((acc, curr) => acc + (curr.weight || 0), 0) || 0} kg`, icon: '⚖️' },
          { name: 'Total Import', value: `${importersData?.reduce((acc, curr) => acc + (curr.quantity_mt || 0), 0) || 0} MT`, icon: '📥' },
          { name: 'Total Export', value: `${exportersData?.reduce((acc, curr) => acc + (curr.quantity_mt || 0), 0) || 0} MT`, icon: '📤' },
          { name: 'Total FPOs', value: String(fposData?.length || 0), icon: '👥' },
          { name: 'Total Members', value: String(fposData?.reduce((acc, curr) => acc + (curr.members || 0), 0) || 0), icon: '👨‍🌾' }
        ])

        setLoading(false)
      } catch (error) {
        console.error('Data fetch error:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSortBy = (e) => {
    setSortBy(e.target.value)
  }

  const handleFilter = (e) => {
    setFilterBy(e.target.value)
    switch (e.target.value) {
      case 'top10':
        setVisibleCommodities(10)
        break
      case 'top50':
        setVisibleCommodities(50)
        break
      default:
        setVisibleCommodities(commodities.length)
    }
  }

  const processChartData = () => {
    let data = Array.isArray(commodities) ? commodities.reduce((acc, commodity) => {
      const existingEntry = acc.find(item => item.name === commodity.name)
      if (existingEntry) {
        existingEntry.commodities.push({
          weight: commodity.weight,
          company: commodity.company
        })
        existingEntry.totalWeight += commodity.weight
      } else {
        acc.push({
          name: commodity.name,
          commodities: [{
            weight: commodity.weight,
            company: commodity.company
          }],
          totalWeight: commodity.weight
        })
      }
      return acc
    }, []) : []

    if (sortBy === 'weight') {
      data.sort((a, b) => b.totalWeight - a.totalWeight)
    } else {
      data.sort((a, b) => a.name.localeCompare(b.name))
    }

    return data.slice(0, visibleCommodities)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.payload.commodities[entry.dataKey.match(/\d+/)[0]].company}: {entry.value} kg
            </p>
          ))}
          <p className="font-bold text-gray-900 mt-2 border-t pt-2">
            Total: {payload.reduce((sum, entry) => sum + entry.value, 0)} kg
          </p>
        </div>
      )
    }
    return null
  }

  const importerData = Array.isArray(importers) ? importers.reduce((acc, importer) => {
    if (importer?.commodity?.name) {
      const existingEntry = acc.find(item => item.name === importer.commodity.name)
      if (existingEntry) {
        existingEntry.importers += 1
        existingEntry.quantity += importer.quantity_mt
      } else {
        acc.push({
          name: importer.commodity.name,
          importers: 1,
          quantity: importer.quantity_mt
        })
      }
    }
    return acc
  }, []) : []

  const exporterData = Array.isArray(exporters) ? exporters.reduce((acc, exporter) => {
    if (exporter?.commodity?.name) {
      const existingEntry = acc.find(item => item.name === exporter.commodity.name)
      if (existingEntry) {
        existingEntry.exporters += 1
        existingEntry.quantity += exporter.quantity_mt
      } else {
        acc.push({
          name: exporter.commodity.name,
          exporters: 1,
          quantity: exporter.quantity_mt
        })
      }
    }
    return acc
  }, []) : []


  const fpoData = Array.isArray(fpos) ? fpos.reduce((acc, fpo) => {
    if (fpo?.commodity?.name) {
      const existingEntry = acc.find(item => item.name === fpo.commodity.name)
      if (existingEntry) {
        existingEntry.fpos += 1
        existingEntry.members += fpo.members
      } else {
        acc.push({
          name: fpo.commodity.name,
          fpos: 1,
          members: fpo.members
        })
      }
    }
    return acc
  }, []) : []
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Commodity Distribution</h2>
            <div className="flex gap-4">
              <select
                onChange={handleSortBy}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              >
                <option value="weight">Sort by Weight</option>
                <option value="name">Sort by Name</option>
              </select>
              <select
                onChange={handleFilter}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              >
                <option value="all">All Commodities</option>
                <option value="top10">Top 10</option>
                <option value="top50">Top 50</option>
              </select>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart data={processChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {processChartData()[0]?.commodities.map((_, index) => (
                  <Bar
                    key={index}
                    dataKey={`commodities[${index}].weight`}
                    name={`Company ${index + 1}`}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}
                    radius={[index === 0 ? 4 : 0, index === 0 ? 4 : 0, 0, 0]}
                    barSize={50}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Importers by Commodity</h2>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={importerData}
                  dataKey="importers"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={5}
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {importerData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} importers`]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Exporters by Commodity</h2>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={exporterData}
                  dataKey="exporters"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={5}
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {exporterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={EXPORTER_COLORS[index % EXPORTER_COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} exporters`]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* FPO Distribution Chart */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">FPO Member Distribution</h2>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <BarChart data={fpoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#4B5563', fontSize: 14 }}
                  interval={0}
                />
                <YAxis
                  tick={{ fill: '#4B5563', fontSize: 14 }}
                  label={{ value: 'Members', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#1F2937'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="members"
                  name="Total Members"
                  fill="#8B5CF6"
                  radius={[8, 8, 0, 0]}
                  barSize={50}
                >
                  {fpoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
