# CardValue - TCG Collection Visualizer

A beautiful dashboard for tracking and visualizing your Trading Card Game collection values across Pokemon, Magic: The Gathering, and Yu-Gi-Oh.

![Dashboard Screenshot](https://raw.githubusercontent.com/JordanLmb/CardValue/main/.github/dashboard.png)

## Features

- **📊 Collection Analytics** - Track total value, card counts, and value history over time
- **🎮 Multi-TCG Support** - Pokemon, Magic: The Gathering, Yu-Gi-Oh, and more
- **📥 CSV Import** - Bulk upload your collection with automatic duplicate merging
- **✏️ Inline Editing** - Edit card details directly in the table
- **🔍 Search & Filter** - Find cards by name, TCG, or condition
- **📈 Beautiful Charts** - Animated donut chart and value line chart
- **☁️ Cloud Sync** - Supabase integration for data persistence

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **Charts**: Recharts, Custom DonutChart
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## CSV Format

Upload cards using this format:

```csv
name,set,condition,tcg,estimatedValue,quantity
Charizard,Base Set,NM,Pokemon,400,1
Black Lotus,Alpha,LP,Magic,50000,1
```

**Conditions**: NM, LP, MP, HP, DMG  
**TCGs**: Pokemon, Magic, YuGiOh, Other

## License

MIT
