import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Cog6ToothIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { saveCredentials, getSavedCredentials, clearCredentials } from '../utils/api';
import toast from 'react-hot-toast';

export default function SettingsPage({ darkMode, toggleDarkMode }) {
  const [credentials, setCredentials] = useState({
    apiKey: '',
    username: '',
    productsKey: '',
  });
  const [showKeys, setShowKeys] = useState({
    apiKey: false,
    productsKey: false,
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('api');

  useEffect(() => {
    setCredentials(getSavedCredentials());
  }, []);

  const handleSave = () => {
    setSaving(true);
    saveCredentials(credentials);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 500);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all saved credentials?')) {
      clearCredentials();
      setCredentials({ apiKey: '', username: '', productsKey: '' });
      toast.success('Credentials cleared');
    }
  };

  const tabs = [
    { id: 'api', name: 'API Credentials', icon: KeyIcon },
    { id: 'appearance', name: 'Appearance', icon: darkMode ? MoonIcon : SunIcon },
    { id: 'about', name: 'About', icon: InformationCircleIcon },
  ];

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Head>
        <title>Settings | iKangoo</title>
      </Head>

      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Cog6ToothIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your dashboard preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-dark-900 p-1.5 rounded-xl border border-gray-100 dark:border-dark-800 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* API Credentials Tab */}
        {activeTab === 'api' && (
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <KeyIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">API Credentials</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your iKangoo API configuration</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* SMS API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMS API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.apiKey ? 'text' : 'password'}
                    value={credentials.apiKey}
                    onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                    placeholder="Enter your SMS API key (e.g. BDFKJBDJB2123)"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 pr-12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys({ ...showKeys, apiKey: !showKeys.apiKey })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showKeys.apiKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Used for accessing SMS data from <code className="bg-gray-100 dark:bg-dark-800 px-1.5 py-0.5 rounded text-primary-600">premium.ikangoo.com</code>
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter your iKangoo username"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>

              {/* Products API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Products API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.productsKey ? 'text' : 'password'}
                    value={credentials.productsKey}
                    onChange={(e) => setCredentials({ ...credentials, productsKey: e.target.value })}
                    placeholder="Enter your products API key"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 pr-12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys({ ...showKeys, productsKey: !showKeys.productsKey })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showKeys.productsKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Used for accessing leads and offers from <code className="bg-gray-100 dark:bg-dark-800 px-1.5 py-0.5 rounded text-primary-600">products.ikangoo.com</code>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-dark-800">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 text-danger-600 dark:text-danger-400 font-medium rounded-xl hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors flex items-center gap-2"
              >
                <TrashIcon className="w-5 h-5" />
                Clear All
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-800/30">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary-800 dark:text-primary-300">API Information</p>
                  <p className="text-xs text-primary-700 dark:text-primary-400 mt-1">
                    Your credentials are stored locally in your browser. They are never sent to any server except the official iKangoo API endpoints.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-secondary-500/20">
                {darkMode ? <MoonIcon className="w-6 h-6 text-white" /> : <SunIcon className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Appearance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customize your dashboard look</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <MoonIcon className="w-6 h-6 text-secondary-600" />
                  ) : (
                    <SunIcon className="w-6 h-6 text-warning-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${darkMode ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      darkMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-800 p-6 animate-fade-in">
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center shadow-2xl shadow-primary-500/20 mx-auto mb-4">
                <span className="text-white font-bold text-3xl">iK</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">iKangoo Dashboard</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Version 1.0.0</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">3</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">API Endpoints</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-2xl font-bold text-success-600 dark:text-success-400">7</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pages</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">∞</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Possibilities</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 dark:bg-dark-800 rounded-xl max-w-lg mx-auto">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built with <span className="text-primary-600 font-medium">Next.js</span>,{' '}
                  <span className="text-secondary-600 font-medium">Tailwind CSS</span>, and{' '}
                  <span className="text-warning-600 font-medium">React</span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  © 2026 iKangoo Dashboard. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
