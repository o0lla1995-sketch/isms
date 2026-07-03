import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { logoutUser, getCurrentUser } from '../utils/auth';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'SMS Data', href: '/sms', icon: ChatBubbleLeftRightIcon },
  { name: 'Leads', href: '/leads', icon: UsersIcon },
  { name: 'Offers', href: '/offers', icon: ShoppingBagIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Layout({ children, darkMode, toggleDarkMode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 
                    transform transition-transform duration-300 ease-in-out lg:translate-x-0 
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 dark:border-dark-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-lg">iK</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">iKangoo</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">API Dashboard</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 dark:from-primary-900/30 dark:to-primary-800/20 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {item.name}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Administrator'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger-600 dark:text-danger-400 
                       hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-800">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="text-gray-900 dark:text-white font-medium">
                  {menuItems.find(item => isActive(item.href))?.name || 'Dashboard'}
                </span>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-100 dark:bg-dark-800 rounded-xl px-4 py-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-48"
                />
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                {darkMode ? (
                  <SunIcon className="w-5 h-5 text-warning-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
