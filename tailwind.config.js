/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        // Mobile-first breakpoints
        'mobile': '320px',
        'mobile-lg': '425px',
        'tablet': '768px',
        'tablet-lg': '1024px',
        'desktop': '1280px',
        'desktop-lg': '1536px',
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-in',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(20px)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    }
  },
  plugins: [
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        // Enhanced card hover effects
        '.card-hover': {
          '@apply transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]': {},
        },
        '.card-hover-mobile': {
          '@apply transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5': {},
        },
        
        // Enhanced badge styles
        '.badge': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.badge-primary': {
          '@apply badge bg-brand-100 text-brand-800 border border-brand-200': {},
        },
        '.badge-success': {
          '@apply badge bg-green-100 text-green-800 border border-green-200': {},
        },
        '.badge-warning': {
          '@apply badge bg-amber-100 text-amber-800 border border-amber-200': {},
        },
        '.badge-danger': {
          '@apply badge bg-red-100 text-red-800 border border-red-200': {},
        },
        
        // Enhanced button styles
        '.btn-primary': {
          '@apply bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2': {},
        },
        '.btn-secondary': {
          '@apply bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-6 rounded-lg border border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2': {},
        },
        '.btn-mobile': {
          '@apply w-full sm:w-auto px-6 py-3 text-base font-medium min-h-[44px]': {},
        },
        
        // Container utilities
        '.container-responsive': {
          '@apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': {},
        },
        '.container-mobile': {
          '@apply max-w-sm mx-auto px-4 sm:px-6': {},
        },
        '.container-tablet': {
          '@apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8': {},
        },
        
        // Scrollbar utilities
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.custom-scrollbar': {
          'scrollbar-width': 'thin',
          'scrollbar-color': theme('colors.slate.400') + ' transparent',
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': theme('colors.slate.400'),
            'border-radius': '3px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background-color': theme('colors.slate.500')
          }
        },
        
        // Touch-friendly utilities
        '.touch-target': {
          '@apply min-h-[44px] min-w-[44px]': {},
        },
        '.touch-friendly': {
          '@apply p-3 sm:p-4': {},
        },
        
        // Responsive text utilities
        '.text-responsive-xs': {
          '@apply text-xs sm:text-sm': {},
        },
        '.text-responsive-sm': {
          '@apply text-sm sm:text-base': {},
        },
        '.text-responsive-base': {
          '@apply text-base sm:text-lg': {},
        },
        '.text-responsive-lg': {
          '@apply text-lg sm:text-xl': {},
        },
        '.text-responsive-xl': {
          '@apply text-xl sm:text-2xl': {},
        },
        '.text-responsive-2xl': {
          '@apply text-2xl sm:text-3xl lg:text-4xl': {},
        },
        '.text-responsive-3xl': {
          '@apply text-3xl sm:text-4xl lg:text-5xl': {},
        },
        
        // Responsive spacing utilities
        '.space-responsive': {
          '@apply space-y-4 sm:space-y-6 lg:space-y-8': {},
        },
        '.gap-responsive': {
          '@apply gap-4 sm:gap-6 lg:gap-8': {},
        },
        '.p-responsive': {
          '@apply p-4 sm:p-6 lg:p-8': {},
        },
        '.px-responsive': {
          '@apply px-4 sm:px-6 lg:px-8': {},
        },
        '.py-responsive': {
          '@apply py-4 sm:py-6 lg:py-8': {},
        },
        
        // Grid responsive utilities
        '.grid-responsive': {
          '@apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8': {},
        },
        '.grid-responsive-2': {
          '@apply grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6': {},
        },
        '.grid-responsive-4': {
          '@apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6': {},
        },
        
        // Focus utilities
        '.focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2': {},
        },
        
        // Loading utilities
        '.loading-skeleton': {
          '@apply animate-pulse bg-slate-200 rounded': {},
        },
        '.loading-shimmer': {
          'background': 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'background-size': '200% 100%',
          'animation': 'shimmer 1.5s infinite',
        },
      }
      
      addUtilities(newUtilities)
      
      // Add responsive components
      addComponents({
        '.btn-mobile-primary': {
          '@apply btn-primary btn-mobile': {},
        },
        '.btn-mobile-secondary': {
          '@apply btn-secondary btn-mobile': {},
        },
        '.card-mobile': {
          '@apply card rounded-lg shadow-md': {},
        },
        '.card-tablet': {
          '@apply card rounded-xl shadow-lg': {},
        },
        '.card-desktop': {
          '@apply card rounded-2xl shadow-xl': {},
        },
      })
    }
  ]
};

