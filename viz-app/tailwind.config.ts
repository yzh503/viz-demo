import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontWeight: {
      normal: '200'
    },
    extend: {
      gridTemplateColumns: {
        'sidebar': '16rem auto',
      },
      gridTemplateRows: {
        'header': '4rem auto',
      }
    },
  },
  plugins: [],
}
export default config
