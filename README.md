# Shobit Mahajan - Professional Portfolio

A complete MERN stack portfolio website built for Shobit Mahajan, showcasing professional skills in telecalling, customer support, Canva design, and no-code website development.

## Features

- **Modern React Frontend** with Tailwind CSS and Framer Motion animations
- **Express.js Backend** with MongoDB database
- **Contact Form** with email notifications via Nodemailer
- **Responsive Design** - works on all devices
- **Scroll Animations** using Intersection Observer
- **Animated Skill Bars** with progress indicators
- **Timeline Experience** section
- **Services Showcase** with feature lists
- **Education Cards** with status badges
- **Language Proficiency** indicators
- **Stats Counter** with animated numbers
- **SEO Optimized** with meta tags and Open Graph

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Email | Nodemailer |
| Security | Helmet, Express Rate Limit, CORS |

## Project Structure

```
shobit-portfolio/
├── client/                 # React Frontend
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── data/          # Portfolio data
│       ├── App.js         # Main router
│       └── index.js       # Entry point
├── server/                 # Express Backend
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── index.js           # Server entry
│   └── .env               # Environment variables
└── package.json           # Root workspace config
```

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd shobit-portfolio

# Install all dependencies
npm run install-all

# Configure environment variables
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and email credentials

# Start development server (runs both frontend and backend)
cd ..
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/shobit_portfolio
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=mahajanshobit24@gmail.com
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### Production Build

```bash
# Build the React app
npm run build

# Start production server
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact/stats` | Get form statistics |
| GET | `/api/messages` | Get all messages |
| PUT | `/api/messages/:id` | Update message status |
| DELETE | `/api/messages/:id` | Delete message |
| GET | `/api/health` | Health check |

## Deployment

### Option 1: Vercel + Render + MongoDB Atlas
1. Deploy frontend to Vercel/Netlify
2. Deploy backend to Render/Railway
3. Use MongoDB Atlas for database

### Option 2: Heroku (Full Stack)
```bash
# Install Heroku CLI and login
heroku create shobit-portfolio
git push heroku main
```

### Option 3: VPS (DigitalOcean, AWS, etc.)
```bash
# Build and deploy with PM2
npm run build
pm2 start server/index.js --name "portfolio"
```

## Customization

All portfolio data is stored in `client/src/data/portfolioData.js`. Update this file to change:
- Personal information
- Skills and proficiency levels
- Work experience
- Education history
- Services offered
- Statistics
- Languages

## License

MIT License - feel free to use this template for your own portfolio.

## Author

**Shobit Mahajan**
- Phone: +91 84278 23803
- Email: mahajanshobit24@gmail.com
- Location: Gurdaspur, Punjab, India
