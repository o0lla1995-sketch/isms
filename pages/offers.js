import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  LinkIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  PhotoIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { fetchOffers, OFFER_FLOWS, OFFER_CATEGORIES, COUNTRIES } from '../utils/api';
import { formatCurrency, getFlagEmoji, truncateText } from '../utils/helpers';
import toast from 'react-hot-toast';

const OfferCard = ({ offer, index }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = ['from-primary-500 to-primary-600', 'from-secondary-500 to-secondary-600', 'from-success-500 to-success-600', 'from-warning-500 to-warning-600'];
  const colorClass = colors[index % colors.length];

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 overflow-hidden card-hover group">
      {/* Image/Header */}
      <div className="relative h-44 overflow-hidden">
        {offer.image ? (
          <img src={offer.image} alt={offer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
            <ShoppingBagIcon className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span className="badge bg-white/90 text-gray-800 text-xs font-semibold backdrop-blur-sm">
            {offer.flow}
          </span>
          {offer.category && (
            <span className="badge bg-primary-500/80 text-white text-xs backdrop-blur-sm">
              {offer.category}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">{offer.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payout</p>
            <p className="text-xl font-bold text-success-600 dark:text-success-400">
              {formatCurrency(parseFloat(offer.payout) || 0, offer.currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{offer.id}</p>
          </div>
        </div>

        {/* Countries */}
        {offer.countries && (
          <div className="flex items-center gap-2 mb-3">
            <GlobeAltIcon className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {offer.countries.split(',').slice(0, 5).map((c, i) => (
                <span key={i} className="text-lg" title={c.trim()}>
                  {getFlagEmoji(c.trim())}
                </span>
              ))}
              {offer.countries.split(',').length > 5 && (
                <span className="text-xs text-gray-400 self-center">+{offer.countries.split(',').length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* Operators */}
        {offer.operators && Array.isArray(offer.operators) && offer.operators.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <DevicePhoneMobileIcon className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {offer.operators.slice(0, 3).map((op, i) => (
                <span key={i} className="badge bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 text-xs">
                  {op.mcc_mnc || op}
                </span>
              ))}
              {offer.operators.length > 3 && (
                <span className="text-xs text-gray-400 self-center">+{offer.operators.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Tracking Link */}
        {offer.tracking_link && (
          <a
            href={offer.tracking_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] transition-all text-sm font-semibold"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            Get Tracking Link
          </a>
        )}

        {/* Resources */}
        {offer.resources && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-800">
            <div className="flex items-center gap-3">
              {offer.resources.previews && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {offer.resources.previews.length} previews
                </span>
              )}
              {offer.resources.screenshots && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {offer.resources.screenshots.length} screenshots
                </span>
              )}
              {offer.resources.banners && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {offer.resources.banners.length} banners
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function OffersPage({ darkMode, toggleDarkMode }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    flow: 'ALL',
    country: '',
    operator: '',
    category: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const itemsPerPage = 12;

  const handleFetch = async () => {
    setLoading(true);
    setOffers([]);
    try {
      const data = await fetchOffers(filters);

      if (Array.isArray(data)) {
        setOffers(data);
        toast.success(`Loaded ${data.length} offers`);
      } else if (data && typeof data === 'object' && !data.error) {
        const offersArray = Object.values(data);
        setOffers(offersArray);
        toast.success(`Loaded ${offersArray.length} offers`);
      } else if (data && data.error) {
        toast.error(data.message || 'Failed to fetch offers');
      } else {
        setOffers([]);
        toast('No offers found for selected filters');
      }
    } catch (error) {
      toast.error('Failed to fetch offers. Check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter offers
  const filteredOffers = offers.filter(offer => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (offer.name && offer.name.toLowerCase().includes(term)) ||
      (offer.flow && offer.flow.toLowerCase().includes(term)) ||
      (offer.category && offer.category.toLowerCase().includes(term)) ||
      (offer.id && offer.id.toString().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const paginatedOffers = filteredOffers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Head>
        <title>Offers | iKangoo</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ShoppingBagIcon className="w-8 h-8 text-secondary-600" />
              Offers Catalog
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Browse and filter available offers from iKangoo
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flow</label>
              <select
                value={filters.flow}
                onChange={(e) => setFilters({ ...filters, flow: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              >
                {OFFER_FLOWS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              >
                {COUNTRIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              >
                {OFFER_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operator (MCC+MNC)</label>
              <input
                type="text"
                value={filters.operator}
                onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
                placeholder="e.g. 41001"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFetch}
                disabled={loading}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <FunnelIcon className="w-5 h-5" />}
                {loading ? 'Loading...' : 'Filter'}
              </button>
            </div>
          </div>
        </div>

        {/* Search & Count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search offers by name, flow, category..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{filteredOffers.length}</span> offers
            </span>
          </div>
        </div>

        {/* Offers Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedOffers.map((offer, index) => (
              <OfferCard key={offer.id || index} offer={offer} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-dark-800/80">
                    <th className="table-header">ID</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Flow</th>
                    <th className="table-header">Payout</th>
                    <th className="table-header">Countries</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
                  {paginatedOffers.map((offer, index) => (
                    <tr key={offer.id || index} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/30 transition-colors">
                      <td className="table-cell font-mono text-xs">{offer.id}</td>
                      <td className="table-cell">
                        <p className="font-medium text-gray-900 dark:text-white">{offer.name}</p>
                        <p className="text-xs text-gray-500">{offer.category}</p>
                      </td>
                      <td className="table-cell">
                        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs">
                          {offer.flow}
                        </span>
                      </td>
                      <td className="table-cell font-semibold text-success-600 dark:text-success-400">
                        {formatCurrency(parseFloat(offer.payout) || 0, offer.currency)}
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-1">
                          {offer.countries && offer.countries.split(',').slice(0, 5).map((c, i) => (
                            <span key={i} className="text-lg">{getFlagEmoji(c.trim())}</span>
                          ))}
                        </div>
                      </td>
                      <td className="table-cell">
                        {offer.tracking_link && (
                          <a
                            href={offer.tracking_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center gap-1"
                          >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            Link
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {paginatedOffers.length === 0 && !loading && (
          <div className="text-center py-16">
            <ShoppingBagIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No offers found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Apply filters and click Filter to load offers</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-30 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-30 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
