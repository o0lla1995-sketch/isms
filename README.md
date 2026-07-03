# iKangoo API Dashboard

![iKangoo Dashboard](https://img.shields.io/badge/Next.js-14-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)
![License](https://img.shields.io/badge/license-MIT-green)

Professional dashboard for managing iKangoo API services - SMS lookup, leads tracking, and offers management.

## Features

- **SMS Data Lookup** - Search SMS messages by phone number and source filter
- **Leads Management** - View, filter, and analyze leads with date range selection
- **Offers Catalog** - Browse offers with advanced filtering (flow, country, category, operator)
- **Analytics** - Visual charts and statistics for leads performance
- **Reports** - Generate and export detailed reports (JSON/CSV)
- **Dark/Light Mode** - Full theme support with system preference detection
- **Responsive Design** - Works perfectly on all screen sizes
- **Secure Authentication** - JWT-based login system
- **Export Data** - Download results as JSON or CSV
- **Search History** - Local storage for SMS search history

## Screenshots

| Dashboard | SMS Lookup | Leads | Offers |
|-----------|-----------|-------|--------|
| Overview stats | Phone search | Date filtering | Grid/List view |

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ikangoo-dashboard.git
cd ikangoo-dashboard

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Default Login
- **Username:** `admin`
- **Password:** `admin123`

> **Important:** Change the default credentials in production!

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# iKangoo API Configuration
NEXT_PUBLIC_IKANGOO_API_KEY=your_api_key
NEXT_PUBLIC_IKANGOO_USERNAME=your_username
NEXT_PUBLIC_IKANGOO_API_KEY_PRODUCTS=your_products_key

# App Security
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### API Setup

1. Go to **Settings** page in the dashboard
2. Enter your iKangoo API credentials:
   - **SMS API Key** - From `premium.ikangoo.com`
   - **Username** - Your iKangoo username
   - **Products API Key** - From `products.ikangoo.com`
3. Click **Save Settings**

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Manual Build

```bash
npm run build
npm start
```

## API Endpoints Used

| Endpoint | Description | Docs |
|----------|-------------|------|
| `premium.ikangoo.com/api/access-data-psms.php` | SMS Data Lookup | [API Docs](https://ikangoo.com) |
| `products.ikangoo.com/api/helper/get-leads` | Leads Data | [API Docs](https://ikangoo.com) |
| `products.ikangoo.com/api/helper/get-offers` | Offers Catalog | [API Docs](https://ikangoo.com) |

## Project Structure

```
ikangoo-dashboard/
├── components/
│   └── Layout.js          # Main layout with sidebar
├── pages/
│   ├── _app.js            # App wrapper
│   ├── _document.js       # HTML document
│   ├── index.js           # Redirect to dashboard
│   ├── login.js           # Authentication page
│   ├── dashboard.js       # Main dashboard
│   ├── sms.js             # SMS lookup page
│   ├── leads.js           # Leads management
│   ├── offers.js          # Offers catalog
│   ├── analytics.js       # Analytics & charts
│   ├── reports.js         # Reports generation
│   └── settings.js        # Configuration page
├── styles/
│   └── globals.css        # Global styles
├── utils/
│   ├── api.js             # API functions
│   ├── auth.js            # Authentication
│   └── helpers.js         # Utility functions
├── public/
│   └── images/
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Heroicons](https://heroicons.com/) - SVG icons
- [date-fns](https://date-fns.org/) - Date formatting
- [react-hot-toast](https://react-hot-toast.com/) - Notifications
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT tokens

## Security Notes

- Credentials are stored in `localStorage` (client-side only)
- All API calls go directly to iKangoo servers
- JWT tokens expire after 7 days
- Change default admin credentials immediately

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For API support: [affiliates@ikangoo.com](mailto:affiliates@ikangoo.com)

For dashboard issues: Open an issue on GitHub

---

Made with for iKangoo affiliates
