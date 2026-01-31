/** @type {import('tailwindcss').Config} */
export default {
    content: [
    './src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx}',
    './public/**/*.html'
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['system-ui', 'sans-serif'],
          serif: ['"Lora"', 'Georgia', 'serif'],
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              '--tw-prose-body': theme('colors.neutral[700]'),
              '--tw-prose-headings': theme('colors.neutral[900]'),
              '--tw-prose-links': theme('colors.blue[600]'),
              '--tw-prose-bold': theme('colors.neutral[900]'),
              '--tw-prose-hr': theme('colors.neutral[200]'),
              '--tw-prose-quotes': theme('colors.neutral[600]'),
              '--tw-prose-quote-borders': theme('colors.neutral[300]'),
              '--tw-prose-captions': theme('colors.neutral[500]'),
              '--tw-prose-code': theme('colors.neutral[900]'),
              '--tw-prose-pre-bg': theme('colors.neutral[100]'),
              '--tw-prose-pre-code': theme('colors.neutral[900]'),
              
              // Base styles
              'body, p, ul, ol': {
                fontFamily: theme('fontFamily.serif'),
              },
              'h1, h2, h3, h4, h5, h6': {
                fontFamily: theme('fontFamily.sans'),
              },
              'blockquote': {
                fontStyle: 'normal',
              },
            },
          },
        }),
      },
    },
    plugins: [require('@tailwindcss/typography')]
    };