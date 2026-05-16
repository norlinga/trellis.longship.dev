module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{md,html}",
    "./docs/**/*.md"
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f2f5f2',
          100: '#e3ebe4',
          200: '#c7d6c9',
          300: '#a3bca6',
          400: '#7a9e80',
          500: '#5a8161',
          600: '#426049',
          700: '#344d3b',
          800: '#253a2c',
          900: '#17271d',
          950: '#111c15',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        body:    ['"Lora"', 'Georgia', '"Times New Roman"', 'serif'],
        sans:    ['"Lora"', 'Georgia', '"Times New Roman"', 'serif'],
        serif:   ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        mono:    ['"SF Mono"', '"Fira Code"', '"Fira Mono"', '"Roboto Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(17, 28, 21, 0.06)',
        'card-hover': '0 8px 28px rgba(17, 28, 21, 0.13)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: '#17271d',
            fontFamily: '"Lora", Georgia, serif',
            lineHeight: '1.85',
            fontSize: '1.0625rem',
            p: {
              marginTop: '1.35em',
              marginBottom: '1.35em',
            },
            h1: {
              color: '#111c15',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: '700',
              lineHeight: '1.1',
            },
            h2: {
              color: '#111c15',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: '600',
              lineHeight: '1.2',
              marginTop: '2.5em',
            },
            h3: {
              color: '#17271d',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: '600',
              lineHeight: '1.3',
            },
            h4: {
              color: '#17271d',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: '600',
            },
            a: {
              color: '#059669',
              textDecoration: 'none',
              fontWeight: '500',
            },
            'a:hover': {
              color: '#047857',
              textDecoration: 'underline',
            },
            strong: {
              color: '#111c15',
              fontWeight: '600',
            },
            code: {
              color: '#111c15',
              backgroundColor: '#e3ebe4',
              borderRadius: '0.25rem',
              paddingLeft:   '0.3rem',
              paddingRight:  '0.3rem',
              paddingTop:    '0.1rem',
              paddingBottom: '0.1rem',
              fontFamily: '"SF Mono", "Fira Code", "Roboto Mono", monospace',
              fontSize: '0.85em',
              fontWeight: '400',
            },
            'code::before': { content: 'none' },
            'code::after':  { content: 'none' },
            pre: {
              backgroundColor: '#111c15',
              color: '#e3ebe4',
              borderRadius: '0.5rem',
              padding: '1.5rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              color: 'inherit',
              fontFamily: '"SF Mono", "Fira Code", "Roboto Mono", monospace',
              fontSize: '0.875em',
            },
            blockquote: {
              color: '#344d3b',
              borderLeftColor: '#c7d6c9',
              borderLeftWidth: '3px',
              fontStyle: 'italic',
              paddingLeft: '1.5em',
            },
            hr: {
              borderColor: '#c7d6c9',
              marginTop: '3em',
              marginBottom: '3em',
            },
            'ul > li': {
              paddingLeft: '1.5em',
            },
            'ul > li::marker': {
              color: '#7a9e80',
            },
            'ol > li::marker': {
              color: '#7a9e80',
              fontWeight: '500',
            },
            table: {
              fontSize: '0.9em',
            },
            thead: {
              borderBottomColor: '#c7d6c9',
            },
            th: {
              color: '#111c15',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: '600',
              paddingBottom: '0.75em',
            },
            td: {
              paddingTop: '0.75em',
              paddingBottom: '0.75em',
              borderBottomColor: '#e3ebe4',
            },
            'tbody tr': {
              borderBottomColor: '#e3ebe4',
            },
          }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        trellis: {
          primary:          '#059669',
          secondary:        '#426049',
          accent:           '#7a9e80',
          neutral:          '#111c15',
          'base-100':       '#f2f5f2',
          'base-200':       '#e3ebe4',
          'base-300':       '#c7d6c9',
          'base-content':   '#17271d',
          info:             '#0891b2',
          success:          '#059669',
          warning:          '#d97706',
          error:            '#dc2626',
        }
      }
    ]
  }
};
