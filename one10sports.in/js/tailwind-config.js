tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    black: '#0E1013',
                    dark: '#14171D',
                    grey: '#1C2028',
                    card: '#181B22',
                    cardHover: '#202530',
                    border: '#2A303C',
                    // Official Logo Reference Accents:
                    gold: '#D4AF37',
                    goldMuted: '#C5A059',
                    goldHover: '#E5C04A',
                    goldDark: '#9E8028',
                    lime: '#C7F000',
                    limeVolt: '#D6E838',
                    limeHover: '#E0F53D',
                    white: '#FFFFFF',
                    muted: '#9EA3AE'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Montserrat', 'Inter', 'sans-serif'],
                athletic: ['Oswald', 'Montserrat', 'sans-serif']
            },
            boxShadow: {
                'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
                'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
                'lime-glow': '0 0 20px rgba(214, 232, 56, 0.25)',
                'badge-3d': '0 12px 30px -5px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.2)'
            }
        }
    }
};
