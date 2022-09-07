export const DISCORD = 'Discord'
export const INSTAGRAM = 'Instagram'
export const TIKTOK = 'TikTok'
export const YOUTUBE = 'YouTube'
export const TWITCH = 'Twitch'
export const LINKEDIN = 'LinkedIn'

export const SOCIAL_TYPES = {
    [DISCORD]: {
        name: 'Discord',
        icon: 'fab fa-discord',
        style: { color: 'rgb(114,137,218)' },
    },
    [INSTAGRAM]: {
        name: 'Instagram',
        icon: 'fab fa-instagram',
        style: {
            background:
                'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
            'background-clip': 'text',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            color: 'transparent',
        },
    },
    [TIKTOK]: {
        name: 'TikTok',
        icon: 'fab fa-tiktok',
        style: {
            filter: 'drop-shadow(2px 0px 0px #FD3E3E) drop-shadow(-2px -2px 0px #4DE8F4)',
            color: 'white',
            'background-color': 'black',
            'border-radius': '10px',
            padding: '0.5rem',
        },
    },
    [YOUTUBE]: {
        name: 'YouTube',
        icon: 'fab fa-youtube',
        style: {
            color: 'rgb(230,33,23)',
        },
    },
    [TWITCH]: {
        name: 'Twitch',
        icon: 'fab fa-twitch',
        style: {
            color: 'rgb(100,65,165)',
        },
    },
    [LINKEDIN]: {
        name: 'LinkedIn',
        icon: 'fab fa-linkedin',
        style: {
            color: 'rgb(0,119,181)',
        },
    },
}
