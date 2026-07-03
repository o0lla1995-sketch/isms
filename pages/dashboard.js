import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { fetchOffers, getSavedCredentials } from '../utils/api';
import { formatNumber } from '../utils/helpers';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, delay }) => (
  <div className="stat-card animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
            {trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard({ darkMode, toggleDarkMode }) {
  const [stats, setStats] = useState({
    totalSMS: 0,
    totalLeads: 0,
    totalOffers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    setCredentials(getSavedCredentials());
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const offersData = await fetchOffers();
      const offersCount = Array.isArray(offersData) ? offersData.length : Object.keys(offersData || {}).length;

      setStats({
        totalSMS: 0,
        totalLeads: 0,
        totalOffers: offersCount,
        totalRevenue: offersCount * 12.5,
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total SMS', value: formatNumber(stats.totalSMS), icon: ChatBubbleLeftRightIcon, color: 'bg-gradient-to-br from-primary-500 to-primary-600' },
    { title: 'Total Leads', value: formatNumber(stats.totalLeads), icon: UsersIcon, color: 'bg-gradient-to-br from-success-500 to-success-600' },
    { title: 'Active Offers', value: formatNumber(stats.totalOffers), icon: ShoppingBagIcon, color: 'bg-gradient-to-br from-secondary-500 to-secondary-600' },
    { title: 'Revenue', value: `$${formatNumber(stats.totalRevenue.toFixed(0))}`, icon: CurrencyDollarIcon, color: 'bg-gradient-to-br from-warning-500 to-warning-600' },
  ];

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Head>
        <title>Dashboard | iKangoo</title>
      </Head>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your API activity</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-4 h-4 inline mr-1" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <StatCard key={card.title} {...card} delay={index * 100} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/sms" className="group bg-gradient-to-br from-primary-500/10 to-primary-600/5 dark:from-primary-900/20 dark:to-primary-800/10 rounded-2xl p-6 border border-primary-100 dark:border-primary-800/30 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">SMS Lookup</h3>
                <p className="text-sm text-gray-500">Search SMS by number</p>
              </div>
            </div>
          </a>

          <a href="/leads" className="group bg-gradient-to-br from-success-500/10 to-success-600/5 rounded-2xl p-6 border border-success-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success-500 flex items-center justify-center shadow-lg">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">View Leads</h3>
                <p className="text-sm text-gray-500">Browse all leads</p>
              </div>
            </div>
          </a>

          <a href="/offers" className="group bg-gradient-to-br from-secondary-500/10 to-secondary-600/5 rounded-2xl p-6 border border-secondary-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-500 flex items-center justify-center shadow-lg">
                <ShoppingBagIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Browse Offers</h3>
                <p className="text-sm text-gray-500">Filter and search offers</p>
              </div>
            </div>
          </a>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">API Configuration Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500" />
                <span className="text-sm font-medium text-success-700">SMS API Key</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Configured</p>
            </div>
            <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500" />
                <span className="text-sm font-medium text-success-700">Username</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">abdala1996</p>
            </div>
            <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500" />
                <span className="text-sm font-medium text-success-700">Products API Key</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Configured</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
