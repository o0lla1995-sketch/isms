import { useState } from 'react';
import Head from 'next/head';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  TableCellsIcon,
  PrinterIcon,
  ChartPieIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { fetchLeads } from '../utils/api';
import { formatCurrency, formatDate, exportToCSV, downloadJSON, getFlagEmoji } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ReportsPage({ darkMode, toggleDarkMode }) {
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!dateStart || !dateEnd) {
      toast.error('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const start = dateStart.replace(/-/g, '');
      const end = dateEnd.replace(/-/g, '');
      const data = await fetchLeads(start, end);

      if (Array.isArray(data) && data.length > 0) {
        const summary = {
          totalLeads: data.length,
          totalPayout: data.reduce((sum, l) => sum + (parseFloat(l.payout) || 0), 0),
          byCountry: {},
          byOffer: {},
          byDevice: {},
          byDate: {},
          byISP: {},
          leads: data,
        };

        data.forEach(lead => {
          const country = lead.country || 'Unknown';
          const offer = lead.offer_name || 'Unknown';
          const device = lead.device || 'Unknown';
          const date = lead.date || (lead.created ? lead.created.split(' ')[0] : 'Unknown');
          const isp = lead.isp || 'Unknown';

          summary.byCountry[country] = (summary.byCountry[country] || 0) + 1;
          summary.byOffer[offer] = (summary.byOffer[offer] || 0) + 1;
          summary.byDevice[device] = (summary.byDevice[device] || 0) + 1;
          summary.byDate[date] = (summary.byDate[date] || 0) + 1;
          summary.byISP[isp] = (summary.byISP[isp] || 0) + 1;
        });

        setReport(summary);
        toast.success(`Report generated: ${data.length} leads`);
      } else {
        toast.error('No data available for selected period');
        setReport(null);
      }
    } catch (error) {
      toast.error('Failed to generate report');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!report) return;
    const headers = ['id', 'country', 'offer_id', 'offer_name', 'referrer', 'isp', 'device', 'traffic_source', 'tracking', 'payout', 'currency', 'date', 'created'];
    exportToCSV(report.leads, headers, `report-${dateStart}-to-${dateEnd}.csv`);
    toast.success('Report exported as CSV');
  };

  const exportJSON = () => {
    if (!report) return;
    downloadJSON(report.leads, `report-${dateStart}-to-${dateEnd}.json`);
    toast.success('Report exported as JSON');
  };

  const StatBox = ({ icon: Icon, label, value, color }) => (
    <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Head>
        <title>Reports | iKangoo</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <DocumentTextIcon className="w-8 h-8 text-warning-600" />
            Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate and export detailed performance reports</p>
        </div>

        {/* Date Range */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />Start Date
              </label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />End Date
              </label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Report Results */}
        {report && (
          <div className="space-y-6 animate-fade-in">
            {/* Export Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-auto">Report Summary</h3>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-success-700 dark:text-success-400 bg-success-50 dark:bg-success-900/20 rounded-xl hover:bg-success-100 transition-colors"
              >
                <TableCellsIcon className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={exportJSON}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 transition-colors"
              >
                <DocumentTextIcon className="w-4 h-4" />
                Export JSON
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBox icon={UsersIcon} label="Total Leads" value={report.totalLeads} color="bg-gradient-to-br from-primary-500 to-primary-600" />
              <StatBox icon={CurrencyDollarIcon} label="Total Payout" value={formatCurrency(report.totalPayout)} color="bg-gradient-to-br from-success-500 to-success-600" />
              <StatBox icon={GlobeAltIcon} label="Countries" value={Object.keys(report.byCountry).length} color="bg-gradient-to-br from-secondary-500 to-secondary-600" />
              <StatBox icon={DevicePhoneMobileIcon} label="Devices" value={Object.keys(report.byDevice).length} color="bg-gradient-to-br from-warning-500 to-warning-600" />
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <GlobeAltIcon className="w-5 h-5 text-primary-600" />
                  By Country
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(report.byCountry)
                    .sort((a, b) => b[1] - a[1])
                    .map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-xl transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFlagEmoji(country)}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{country}</span>
                        </div>
                        <span className="badge-info">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-success-600" />
                  By Device
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(report.byDevice)
                    .sort((a, b) => b[1] - a[1])
                    .map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-xl transition-colors">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{device}</span>
                        <span className="badge-info">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <ChartPieIcon className="w-5 h-5 text-secondary-600" />
                  By Offer
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(report.byOffer)
                    .sort((a, b) => b[1] - a[1])
                    .map(([offer, count]) => (
                      <div key={offer} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-xl transition-colors">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">{offer}</span>
                        <span className="badge-info">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-warning-600" />
                  By Date
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(report.byDate)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, count]) => (
                      <div key={date} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-xl transition-colors">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{date}</span>
                        <span className="badge-info">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
