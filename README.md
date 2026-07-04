# AfterPay — AI Expense Tracker

A full-stack expense tracking application with real data storage, authentication, and beautiful analytics.

## 📁 Project Structure

```
expense-ai/ 
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Root component
│   ├── App.css                  # Global styles
│   ├── index.css                # Base CSS
│   ├── pages/
│   │   ├── Landing.jsx          # Home/auth page
│   │   ├── Landing.css
│   │   ├── Dashboard.jsx        # Main app container
│   │   └── Dashboard.css
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Sidebar.css
│   │   ├── DashboardView.jsx    # Stats & charts
│   │   ├── DashboardView.css
│   │   ├── AddExpenseForm.jsx   # Manual entry form
│   │   ├── AddExpenseForm.css
│   │   ├── ExpenseHistory.jsx   # Transaction list
│   │   └── ExpenseHistory.css
│   └── lib/
│       └── supabase.js          # Supabase client setup
├── .env.example                 # Environment variables template
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## ⚙️ Setup Instructions

### 1. **Clone or Create Your Project**

```bash
cd "C:\Users\shrus\expense tracker\expense-ai"
```

### 2. **Copy All Files**

Copy each file from this list into the matching path in your project:

- `main.jsx` → `src/main.jsx`
- `App.jsx` → `src/App.jsx`
- `App.css` → `src/App.css`
- `index.css` → `src/index.css`
- `pages/Landing.jsx` → `src/pages/Landing.jsx`
- `pages/Landing.css` → `src/pages/Landing.css`
- `pages/Dashboard.jsx` → `src/pages/Dashboard.jsx`
- `pages/Dashboard.css` → `src/pages/Dashboard.css`
- `components/Sidebar.jsx` → `src/components/Sidebar.jsx`
- `components/Sidebar.css` → `src/components/Sidebar.css`
- `components/DashboardView.jsx` → `src/components/DashboardView.jsx`
- `components/DashboardView.css` → `src/components/DashboardView.css`
- `components/AddExpenseForm.jsx` → `src/components/AddExpenseForm.jsx`
- `components/AddExpenseForm.css` → `src/components/AddExpenseForm.css`
- `components/ExpenseHistory.jsx` → `src/components/ExpenseHistory.jsx`
- `components/ExpenseHistory.css` → `src/components/ExpenseHistory.css`
- `lib/supabase.js` → `src/lib/supabase.js`
- `.env.example` → `.env.local`

### 3. **Set Up Supabase** (for real data storage)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. In the SQL editor, run this to create the expenses table:

```sql
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('debit', 'credit')),
  date DATE NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own expenses"
  ON expenses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

4. Get your **Project URL** and **Anon Key** from Settings → API
5. Copy them to `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. **Install & Run**

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 🎯 Features

✅ **Authentication** — Sign up, login with email/password
✅ **Real Data Storage** — Supabase PostgreSQL with Row-Level Security
✅ **Add Expenses** — Manual entry, categorized, with dates
✅ **Dashboard** — Live stats (balance, income, spent, count)
✅ **Charts** — Monthly spending trends, category breakdown
✅ **History** — Searchable transaction list with filters
✅ **Responsive** — Works on mobile, tablet, desktop

## 🔐 Security

- **RLS (Row Level Security)** — Users only see their own data
- **bcrypt Passwords** — Handled by Supabase
- **JWT Auth** — Secure session tokens
- **HTTPS/TLS** — Encrypted data in transit

## 📲 Local Storage (No Server)

If you want to use local storage instead of Supabase (data stays on device):

1. Skip the Supabase setup
2. In `src/App.jsx`, replace supabase calls with localStorage
3. Data will persist in browser but won't sync across devices

## 🚀 Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git" → select your repo
4. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## 📝 Usage

### Add an Expense

1. Click "Add Expense" in sidebar
2. Select type (Debit/Credit)
3. Enter amount and category
4. Add description and date
5. Click "Add Transaction"

### View History

1. Click "History" in sidebar
2. Search or filter by type/category
3. Delete transactions with the Delete button

### Dashboard

- See real-time stats (balance, income, spent)
- View monthly spending trends
- See category breakdown
- View recent transactions

## 🐛 Troubleshooting

**"Supabase URL not found"**
- Make sure you created `.env.local` with correct URL and key
- Restart dev server after creating .env file

**"Can't sign up"**
- Check Supabase project is active
- Verify database table was created
- Check Network tab in browser DevTools

**"Data not saving"**
- Open browser DevTools → Network tab
- Try adding an expense, check for errors
- Make sure RLS policy was created

## 📧 Support

For Supabase help: [docs.supabase.com](https://docs.supabase.com)
For Vite help: [vitejs.dev](https://vitejs.dev)

---

**Made with ❤️ by AfterPay**
# EXPENSE-TRACKER-
