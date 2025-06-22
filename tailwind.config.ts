import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: colors.green,
        success: colors.green,
        warning: colors.amber,
        danger: colors.red,
        info: colors.blue,
      },
      fontFamily: {
        sans: [
          'Inter', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Helvetica Neue', 
          'Arial', 
          'sans-serif'
        ],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      },
      lineHeight: {
        'relaxed-custom': '1.6',
      }
    },
  },
  plugins: [],
} satisfies Config