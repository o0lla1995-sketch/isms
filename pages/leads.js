import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  SignalIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { fetchLeads } from '../utils/api';
import { formatDate, formatCurrency, formatNumber, getFlagEmoji, getDeviceIcon, downloadJSON, exportToCSV } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function LeadsPage({ darkMode, toggleDarkMode }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Set default dates to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDateStart(today);
    setDateEnd(today);
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const start = dateStart.replace(/-/g, '');
      const end = dateEnd.replace(/-/g, '');
      const data = await fetchLeads(start, end);

      if (Array.isArray(data)) {
        setLeads(data);
        toast.success(`Loaded ${data.length} leads`);
      } else if (data.error) {
        toast.error(data.message || 'Failed to fetch leads');
        setLeads([]);
      } else {
        setLeads([]);
        toast('No leads found for selected dates');
      }
    } catch (error) {
      toast.error('Failed to fetch leads. Check your credentials.');
      console.error(error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (lead.country && lead.country.toLowerCase().includes(term)) ||
      (lead.offer_name && lead.offer_name.toLowerCase().includes(term)) ||
      (lead.device && lead.device.toLowerCase().includes(term)) ||
      (lead.traffic_source && lead.traffic_source.toLowerCase().includes(term)) ||
      (lead.tracking && lead.tracking.toLowerCase().includes(term))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const stats = {
    total: filteredLeads.length,
    totalPayout: filteredLeads.reduce((sum, l) => sum + (parseFloat(l.payout) || 0), 0),
    countries: [...new Set(filteredLeads.map(l => l.country).filter(Boolean))].length,
    devices: [...new Set(filteredLeads.map(l => l.device).filter(Boolean))].length,
  };

  const handleExportJSON = () => {
    if (filteredLeads.length === 0) {
      toast.error('No data to export');
      return;
    }
    downloadJSON(filteredLeads, `leads-${dateStart}-${dateEnd}.json`);
    toast.success('Exported as JSON');
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error('No data to export');
      return;
    }
    const headers = ['id', 'country', 'offer_id', 'offer_name', 'referrer', 'isp', 'device', 'traffic_source', 'tracking', 'payout', 'currency', 'date', 'created'];
    exportToCSV(filteredLeads, headers, `leads-${dateStart}-${dateEnd}.csv`);
    toast.success('Exported as CSV');
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Head>
        <title>Leads | iKangoo</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <UsersIcon className="w-8 h-8 text-success-600" />
              Leads Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              View and analyze your leads data
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl p-4 border border-gray-100 dark:border-dark-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatNumber(stats.total)}</p>
          </div>
          <div className="bg-white dark:bg-dark-900 rounded-xl p-4 border border-gray-100 dark:border-dark-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Payout</p>
            <p className="text-2xl font-bold text-success-600 dark:text-success-400 mt-1">{formatCurrency(stats.totalPayout)}</p>
          </div>
          <div className="bg-white dark:bg-dark-900 rounded-xl p-4 border border-gray-100 dark:border-dark-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Countries</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">{stats.countries}</p>
          </div>
          <div className="bg-white dark:bg-dark-900 rounded-xl p-4 border border-gray-100 dark:border-dark-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Devices</p>
            <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mt-1">{stats.devices}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" />
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFetch}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-95 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <FunnelIcon className="w-5 h-5" />
                )}
                Fetch
              </button>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        {filteredLeads.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-dark-800/80">
                  <th className="table-header">ID</th>
                  <th className="table-header">Country</th>
                  <th className="table-header">Offer</th>
                  <th className="table-header">Device</th>
                  <th className="table-header">Payout</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
                {paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      {loading ? 'Loading...' : 'No leads found. Select dates and click Fetch.'}
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead, index) => (
                    <tr key={lead.id || index} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/30 transition-colors">
                      <td className="table-cell font-mono text-xs">{lead.id || '-'}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFlagEmoji(lead.country)}</span>
                          <span className="text-sm">{lead.country || '-'}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.offer_name || '-'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {lead.offer_id || '-'}</p>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <span>{getDeviceIcon(lead.device)}</span>
                          <span className="text-sm">{lead.device || '-'}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm font-semibold text-success-600 dark:text-success-400">
                          {formatCurrency(parseFloat(lead.payout) || 0, lead.currency || 'USD')}
                        </span>
                      </td>
                      <td className="table-cell whitespace-nowrap">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {lead.created ? formatDate(lead.created, 'yyyy-MM-dd') : lead.date || '-'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-800 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-30 transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white dark:bg-dark-900 px-6 py-4 border-b border-gray-100 dark:border-dark-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lead Details</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                  <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">{selectedLead.id}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Country</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    <span className="text-lg">{getFlagEmoji(selectedLead.country)}</span>
                    {selectedLead.country}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Offer</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLead.offer_name}</p>
                  <p className="text-xs text-gray-400">ID: {selectedLead.offer_id}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Payout</p>
                  <p className="text-sm font-semibold text-success-600 dark:text-success-400">
                    {formatCurrency(parseFloat(selectedLead.payout) || 0, selectedLead.currency)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Device</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    <span>{getDeviceIcon(selectedLead.device)}</span>
                    {selectedLead.device}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">ISP</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLead.isp || '-'}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">Referrer</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white break-all">{selectedLead.referrer || '-'}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">Tracking</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLead.tracking || '-'}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">Traffic Source</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLead.traffic_source || '-'}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLead.created || selectedLead.date || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
