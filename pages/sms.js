import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { fetchSMSData, SMS_SOURCES, saveCredentials, getSavedCredentials } from '../utils/api';
import { formatDate, copyToClipboard, downloadJSON, truncateText } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function SMSPage({ darkMode, toggleDarkMode }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const saved = localStorage.getItem('sms_search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const data = await fetchSMSData(phoneNumber, selectedSource);

      // Handle different response types
      if (data.error) {
        toast.error(data.message || 'Invalid API key or error occurred');
        setResults({ error: true, message: data.message });
      } else if (Array.isArray(data) && data.length === 0) {
        toast('No results found for this number', { icon: '🔍' });
        setResults([]);
      } else {
        const entries = Array.isArray(data) ? data : Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        setResults(entries);

        // Save to history
        const newHistory = [
          { number: phoneNumber, source: selectedSource, date: new Date().toISOString(), count: entries.length },
          ...history.slice(0, 19),
        ];
        setHistory(newHistory);
        localStorage.setItem('sms_search_history', JSON.stringify(newHistory));

        toast.success(`Found ${entries.length} result(s)`);
      }
    } catch (error) {
      toast.error('Failed to fetch SMS data. Check your API key.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = async (message) => {
    const success = await copyToClipboard(message);
    if (success) toast.success('Message copied to clipboard');
  };

  const handleExport = () => {
    if (!results || results.length === 0) {
      toast.error('No data to export');
      return;
    }
    downloadJSON(results, `sms-data-${phoneNumber}-${new Date().toISOString().split('T')[0]}.json`);
    toast.success('Data exported successfully');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('sms_search_history');
    toast.success('History cleared');
  };

  // Pagination
  const totalPages = results ? Math.ceil(results.length / itemsPerPage) : 0;
  const paginatedResults = results ? results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Head>
        <title>SMS Data | iKangoo</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600" />
              SMS Data Lookup
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Search SMS messages by phone number and source
            </p>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Phone Number Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number (e.g. 9613950001)"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              {/* Source Filter */}
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Source Filter
                </label>
                <div className="relative">
                  <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                  >
                    {SMS_SOURCES.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-500 hover:to-primary-400 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-800/50 p-3 rounded-lg">
              <ExclamationTriangleIcon className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
              <p>
                Data is stored for 10 minutes only. Only the latest entry per number and source is returned.
                Include country code without the + sign (e.g. 9613950001).
              </p>
            </div>
          </form>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Search Results
                </h3>
                <span className="badge-info">
                  {Array.isArray(results) ? results.length : 0} found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Export JSON
                </button>
              </div>
            </div>

            {Array.isArray(results) && results.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-dark-800/80">
                        <th className="table-header">Source</th>
                        <th className="table-header">Number</th>
                        <th className="table-header">Message</th>
                        <th className="table-header">Date</th>
                        <th className="table-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
                      {paginatedResults.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/30 transition-colors">
                          <td className="table-cell">
                            <span className="badge-info">
                              {item.cli || item.id || 'Unknown'}
                            </span>
                          </td>
                          <td className="table-cell font-mono text-xs">
                            {item.number || phoneNumber}
                          </td>
                          <td className="table-cell max-w-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {truncateText(item.message, 100)}
                            </p>
                          </td>
                          <td className="table-cell whitespace-nowrap">
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <ClockIcon className="w-3.5 h-3.5" />
                              <span className="text-xs">{item.date ? formatDate(item.date) : 'N/A'}</span>
                            </div>
                          </td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyMessage(item.message)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
                                title="Copy message"
                              >
                                <DocumentDuplicateIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-800 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, results.length)} of {results.length}
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
              </>
            ) : (
              <div className="px-6 py-12 text-center">
                <XCircleIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {results.error ? results.message : 'No results found for this number'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search History */}
        {history.length > 0 && (
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-800 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Search History</h3>
              <button
                onClick={clearHistory}
                className="text-sm text-danger-600 dark:text-danger-400 hover:underline"
              >
                Clear All
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-dark-800">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-800/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setPhoneNumber(item.number);
                    setSelectedSource(item.source);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.number}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.source || 'All Sources'} • {new Date(item.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="badge-info text-xs">
                    {item.count} results
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
