/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark-academia': {
                    charcoal: '#1a1a1a', // Deep background
                    midnight: '#0f172a', // Secondary background
                    gold: '#d4af37', // Accents, borders, text highlight
                    silver: '#c0c0c0', // Secondary accents
                    vellum: 'rgba(255, 255, 255, 0.05)', // Glassy/Paper overlays
                    'vellum-opaque': '#f5f5dc', // For paper texture fallback
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            backgroundImage: {
                // 'academy': "url('/public/assets/img/bg-dark-academia.png')", 
                // 'vellum-texture': "url('/public/assets/img/bg-vellum.png')",
            },
            boxShadow: {
                'gold-glow': '0 0 10px rgba(212, 175, 55, 0.3)',
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
}
