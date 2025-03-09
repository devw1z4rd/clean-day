# Clean Day

Clean Day is a web application for tracking smoking cessation progress. The application helps users visualize their progress, achievements, and health benefits while providing motivation and statistics.

## Features

- **Smoke-Free Timer**: Detailed tracking of days, hours, minutes, and seconds since quitting smoking
- **Progress Visualization**: Charts displaying money saved, cigarettes not smoked, and health improvements
- **Achievement System**: Motivational achievements for various smoking cessation milestones
- **Personalization**: Customizable user name and individual smoking parameters
- **Cross-Device Synchronization**: Ability to sync data between devices using Supabase
- **Dark Mode**: Support for both light and dark themes
- **Responsive Design**: Fully responsive interface for use on any device
- **Health Tracking**: Visualization of health improvements over time
- **Educational Content**: Information about health benefits at different stages of quitting
- **Relapse Handling**: Option to reset progress after a minimum period of 2 hours

## Technology Stack

- **Frontend Framework**: Nuxt 3, Vue 3, TypeScript
- **UI Components**: Nuxt UI, Tailwind CSS
- **State Management**: Pinia
- **Data Visualization**: Chart.js
- **Backend/Synchronization**: Supabase
- **Libraries**:
  - QR Scanner (for QR code scanning)
  - QRCode (for QR code generation)
  - UUID (for unique session identification)

## Installation and Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (for synchronization functionality)

### Setup Steps
1. Clone the repository:
```bash
git clone https://github.com/yourusername/clean-day.git
cd clean-day
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Fill the `.env` file with your Supabase keys:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

5. Run the project in development mode:
```bash
npm run dev
# or
yarn dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

## Supabase Configuration

For the synchronization feature to work properly, you need to set up your Supabase project:

1. **Create a Supabase Project**:
   - Go to [Supabase Dashboard](https://app.supabase.io/) and create a new project
   - Take note of your project URL and anon key for environment variables

2. **Database Table Setup**:
   - Create a table named `sessions` with the following columns:
     - `id` (type: uuid, constraints: primary key)
     - `data` (type: jsonb)
     - `created_at` (type: timestamptz)
     - `updated_at` (type: timestamptz)

## Project Structure

```
clean-day/
├── .github/
│   └── workflows/   # GitHub Actions configuration
├── assets/          # Static assets (CSS, images)
├── components/      # Vue components
├── layouts/         # Layout components
├── pages/           # Page components (Nuxt routing)
├── public/          # Public files
├── stores/          # Pinia stores
├── .env.example     # Environment variables example
├── nuxt.config.ts   # Nuxt configuration
├── package.json     # Dependencies and scripts
└── README.md        # Documentation
```

## Future Development Tasks

- Redesign and improved mobile adaptability
- Code refactoring
- Addition of new chart types and statistics
- Localization to other languages

---

Made by [devw1z4rd](https://github.com/devw1z4rd)