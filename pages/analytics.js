import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  ChartBarIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { fetchLeads } from '../utils/api';
import { formatCurrency, getFlagEmoji, getDeviceIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProgressBar = ({ label, value, total, color, icon: Icon }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
          <span className="text-xs text-gray-400">({percentage.toFixed(1)}%)</span>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-dark-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default function AnalyticsPage({ darkMode, toggleDarkMode }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('today');

  const colors = ['#0ea5e9', '#d946ef', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      let start, end;
      const today = new Date();

      switch(dateRange) {
        case 'today':
          start = end = today.toISOString().split('T')[0].replace(/-/g, '');
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          start = weekAgo.toISOString().split('T')[0].replace(/-/g, '');
          end = today.toISOString().split('T')[0].replace(/-/g, '');
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setDate(monthAgo.getDate() - 30);
          start = monthAgo.toISOString().split('T')[0].replace(/-/g, '');
          end = today.toISOString().split('T')[0].replace(/-/g, '');
          break;
        default:
          start = end = today.toISOString().split('T')[0].replace(/-/g, '');
      }

      const data = await fetchLeads(start, end);
      if (Array.isArray(data)) {
        setLeads(data);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error(error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const countryStats = leads.reduce((acc, lead) => {
    const country = lead.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const deviceStats = leads.reduce((acc, lead) => {
    const device = lead.device || 'Unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const offerStats = leads.reduce((acc, lead) => {
    const offer = lead.offer_name || 'Unknown';
    acc[offer] = (acc[offer] || 0) + 1;
    return acc;
  }, {});

  const dateStats = leads.reduce((acc, lead) => {
    const date = lead.date || (lead.created ? lead.created.split(' ')[0] : 'Unknown');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const totalPayout = leads.reduce((sum, l) => sum + (parseFloat(l.payout) || 0), 0);
  const avgPayout = leads.length ? totalPayout / leads.length : 0;

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Head>
        <title>Analytics | iKangoo</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ChartBarIcon className="w-8 h-8 text-primary-600" />
              Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Visualize your leads and performance data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-dark-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Leads</p>
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{leads.length}</p>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-dark-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <div className="w-10 h-10 rounded-xl bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-success-600 dark:text-success-400">${totalPayout.toFixed(2)}</p>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-dark-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Countries</p>
              <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                <GlobeAltIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">{Object.keys(countryStats).length}</p>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-dark-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Payout</p>
              <div className="w-10 h-10 rounded-xl bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">${avgPayout.toFixed(2)}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Country Distribution */}
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <GlobeAltIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Leads by Country</h3>
            </div>
            {Object.keys(countryStats).length === 0 ? (
              <div className="text-center py-12">
                <GlobeAltIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(countryStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([country, count], index) => (
                    <ProgressBar
                      key={country}
                      label={`${getFlagEmoji(country)} ${country}`}
                      value={count}
                      total={leads.length}
                      color={colors[index % colors.length]}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Device Distribution */}
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <DevicePhoneMobileIcon className="w-5 h-5 text-success-600 dark:text-success-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Leads by Device</h3>
            </div>
            {Object.keys(deviceStats).length === 0 ? (
              <div className="text-center py-12">
                <DevicePhoneMobileIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(deviceStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([device, count], index) => (
                    <ProgressBar
                      key={device}
                      label={`${getDeviceIcon(device)} ${device}`}
                      value={count}
                      total={leads.length}
                      color={colors[index % colors.length]}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Top Offers */}
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBagIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Top Performing Offers</h3>
            </div>
            {Object.keys(offerStats).length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(offerStats)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([offer, count], index) => {
                    const percentage = (count / leads.length) * 100;
                    return (
                      <div key={offer} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">{offer}</span>
                          <span className="badge-info text-xs">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total leads</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Daily Trend */}
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <CalendarIcon className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Daily Lead Trend</h3>
            </div>
            {Object.keys(dateStats).length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(dateStats)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, count], index) => {
                    const maxCount = Math.max(...Object.values(dateStats));
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={date} className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">{date}</span>
                        <div className="flex-1 h-8 bg-gray-100 dark:bg-dark-800 rounded-lg overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-lg transition-all duration-500 flex items-center px-3"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-white text-sm font-semibold">{count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
