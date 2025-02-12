import Link from 'next/link'
import { HomeIcon, CubeIcon, TruckIcon, GlobeAltIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Sidebar({ mobile, onClose }) {
  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Commodities', href: '/admin/commodities', icon: CubeIcon },
    { name: 'Importers', href: '/admin/importers', icon: TruckIcon },
    { name: 'Exporters', href: '/admin/exporters', icon: GlobeAltIcon },
    { name: 'FPOs', href: '/admin/fpos', icon: UsersIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  ]

  const styles = mobile ? {
    container: 'fixed inset-0 z-50 bg-gray-800',
    nav: 'flex-1 flex flex-col items-center justify-center space-y-8',
    link: 'flex items-center justify-center w-full px-4 py-4 text-2xl font-medium text-white hover:bg-gray-700',
    icon: 'h-8 w-8 mr-6'
  } : {
    container: 'hidden md:flex md:w-64 md:flex-col bg-gray-800',
    nav: 'mt-5 flex-1 px-2 space-y-1',
    link: 'group flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-gray-700',
    icon: 'mr-3 h-6 w-6 text-gray-300'
  }

  return (
    <div className={styles.container}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-6">
          <span className="text-3xl font-bold text-white">Admin Panel</span>
          {mobile && (
            <button onClick={onClose} className="text-white hover:text-gray-200 p-2">
              <XMarkIcon className="h-8 w-8" />
            </button>
          )}
        </div>
        
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={styles.link}
              onClick={mobile ? onClose : undefined}
            >
              <item.icon className={styles.icon} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
