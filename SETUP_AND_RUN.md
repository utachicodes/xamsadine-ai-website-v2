# 🚀 How to Run XamSaDine AI v2.0

## Quick Start (Easiest Way)

### Option 1: Run Everything Together (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see below)
# Create a .env file in the root directory

# 3. Run both frontend and backend together
npm run dev:all
```

This will start:
- ✅ Frontend on `http://localhost:8080`
- ✅ Backend API on `http://localhost:4000`

---

## Step-by-Step Setup

### 1. Prerequisites

Make sure you have installed:
- **Node.js 20.x or higher** - [Download](https://nodejs.org/)
- **npm 9.x or higher** (comes with Node.js)
- **Python 3.8+** (for translation service) - [Download](https://www.python.org/)

Verify installation:
```bash
node --version  # Should be v20.x or higher
npm --version   # Should be 9.x or higher
python --version # Should be 3.8 or higher
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies for translation service
cd backend/services/translation-service
pip install -r requirements.txt
cd ../../..
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory with the following:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Supabase (Required)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Admin Email (for backward compatibility)
VITE_ADMIN_EMAIL=admin@example.com
ADMIN_EMAIL=admin@example.com

# Optional: API URL (defaults shown)
VITE_API_URL=http://localhost:4000
PORT=4000

# Optional: Ollama Configuration (for local LLM)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:1b
```

**Where to get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create a project or use existing one
3. Go to Settings → API
4. Copy the URL and keys

### 4. Run the Application

#### Option A: Run Everything Together (Recommended)
```bash
npm run dev:all
```

#### Option B: Run Separately (Two Terminals)

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend will be at `http://localhost:8080`

**Terminal 2 - Backend:**
```bash
npm run start
```
Backend will be at `http://localhost:4000`

### 5. Access the Application

- **Frontend**: Open [http://localhost:8080](http://localhost:8080) in your browser
- **Backend API**: Available at [http://localhost:4000](http://localhost:4000)
- **Health Check**: [http://localhost:4000/health](http://localhost:4000/health)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server (Vite) |
| `npm run start` | Start backend API server |
| `npm run dev:all` | Start both frontend and backend together |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint to check code quality |

---

## First Time Setup Checklist

- [ ] Node.js 20.x+ installed
- [ ] Python 3.8+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Python dependencies installed (`pip install -r backend/services/translation-service/requirements.txt`)
- [ ] `.env` file created with Supabase credentials
- [ ] Supabase project created and configured
- [ ] Database tables created (see database/ folder)

---

## Database Setup

The application uses Supabase for authentication and data storage. Make sure you have:

1. **Created the profiles table** (see `database/profiles-table.sql`)
2. **Created the ecosystem schema** (see `database/ecosystem_schema.sql`)

You can run these SQL scripts in your Supabase SQL editor.

---

## Troubleshooting

### "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
- Make sure you created a `.env` file in the root directory
- Check that the environment variables are spelled correctly
- Restart the development server after creating/updating `.env`

### "Port 4000 already in use"
```bash
# Windows PowerShell
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Windows CMD
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### "Port 8080 already in use"
```bash
# Change the port in vite.config.ts or use:
npm run dev -- --port 3000
```

### "Translation service failed to start"
- Make sure Python is installed: `python --version`
- Install Python dependencies: `pip install -r backend/services/translation-service/requirements.txt`
- The app will continue to work without translation service, but Wolof features won't be available

### "Cannot connect to Supabase"
- Verify your Supabase URL and keys in `.env`
- Check that your Supabase project is active
- Ensure your IP is allowed in Supabase dashboard (Settings → API → Allowed IPs)

### Frontend shows blank page
- Check browser console for errors
- Verify environment variables are loaded (check Network tab for API calls)
- Make sure backend is running on port 4000

---

## Production Build

To build for production:

```bash
# Build frontend
npm run build

# The built files will be in the `dist/` folder
# You can serve them with:
npm run preview
```

For production deployment with Docker:

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up --build
```

---

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use the health endpoint to verify backend is running: `http://localhost:4000/health`
3. **Logs**: Check the terminal for detailed logs from both services
4. **Environment Variables**: Changes to `.env` require restarting the server

---

## Next Steps

Once the application is running:

1. **Create an account**: Go to `/login` and sign up
2. **Access admin panel**: Use admin email to access `/admin`
3. **Upload documents**: Go to `/documents` to add knowledge base documents
4. **Ask questions**: Use `/circle` or `/fatwa` to interact with the AI

---

## Need Help?

- Check the `README.md` for more details
- Review `REFACTORING_SUMMARY.md` for recent changes
- Check the console/terminal for error messages
- Verify all environment variables are set correctly

---

**You're all set!** 🎉

Run `npm run dev:all` and start building! 🚀

