import { users } from './users'

export const categories = [
    {
        name: 'News',
        link: '#',
    },
    {
        name: 'Hobby',
        link: '#',
    },
    {
        name: 'Programmation',
        link: '#',
    },
    {
        name: 'Devlog',
        link: '#',
    },
    {
        name: 'Divers',
        link: '#',
    },
]

export const articles = [
    {
        author: users[0],
        link: '#/blog/0',
        date: '2021-10-18T13:51:36.631Z',
        title: '[FEATURE] Assigner des équipes à des tickets',
        category: categories[3],
        toc: [
            {
                'title': 'Présentation de feature',
                'href': 'feature',
                'subtitles': [
                    {
                        'title': 'Les teams',
                        'href': 'teams',
                    },
                ],
            },
            {
                'title': 'Ce que cela signifie pour le futur de la plateforme',
                'href': 'futur',
                'subtitles': [],
            },
        ],
        abstract:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
        body: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Wow, this editor instance exports its content as JSON."}]}]}',
        tags: ['feature', 'ticket', 'équipe'],
        comments: [
            {
                author: users[0],
                date: '2021-01-02T19:21:11.111Z',
                content: "C'est pas mal !",
                replies: [],
            },
            {
                author: users[1],
                date: '2021-01-02T19:31:11.311Z',
                content: "Trop d'accord !",
                replies: [
                    {
                        author: users[2],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Je ne suis pas d'accord",
                    },
                    {
                        author: users[3],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Je suis d'accord",
                    },
                ],
            },
            {
                author: users[2],
                date: '2021-01-02T19:21:11.111Z',
                content: "C'était mieux avant.",
                replies: [
                    {
                        author: users[2],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Est-ce que tu m'entends hého ?",
                    },
                ],
            },
        ],
    },
    {
        author: users[1],
        link: '#/blog/1',
        date: '2021-12-18T18:53:21.051Z',
        title: "L'escalade : plus qu'une passion !",
        category: categories[1],
        toc: [
            {
                'title': 'Partie I. Les bases',
                'href': 'bases',
                'subtitles': [],
            },
            {
                'title': 'Partie II. Les défis',
                'href': 'defis',
                'subtitles': [
                    {
                        'title': 'Défi 1. Ma maison',
                        'href': 'maison',
                    },
                    {
                        'title': 'Défi 2. Le mont Everest',
                        'href': 'mont-everest',
                    },
                ],
            },
        ],
        abstract:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
        body: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Wow, this editor instance exports its content as JSON."}]}]}',
        tags: ['escalade', 'hobby'],
        comments: [
            {
                author: users[0],
                date: '2021-01-02T19:21:11.111Z',
                content: "C'est pas mal !",
                replies: [],
            },
            {
                author: users[1],
                date: '2021-01-02T19:31:11.311Z',
                content: "Trop d'accord !",
                replies: [
                    {
                        author: users[2],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Je ne suis pas d'accord",
                    },
                    {
                        author: users[3],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Je suis d'accord",
                    },
                ],
            },
            {
                author: users[2],
                date: '2021-01-02T19:21:11.111Z',
                content: "C'était mieux avant.",
                replies: [
                    {
                        author: users[2],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Est-ce que tu m'entends hého ?",
                    },
                ],
            },
        ],
    },
    {
        author: users[2],
        link: '#/blog/2',
        date: '2021-11-12T09:21:23.181Z',
        title: '[GIT] Cheatsheet Git : GUIDE COMPLET !',
        category: categories[2],
        toc: [
            {
                'title': 'Introduction à Git',
                'href': 'introduction',
                'subtitles': [],
            },
            {
                'title': 'Git avancé',
                'href': 'avance',
                'subtitles': [
                    {
                        'title': 'Git rebase',
                        'href': 'rebase',
                    },
                    {
                        'title': 'Git stash',
                        'href': 'stash',
                    },
                ],
            },
        ],
        abstract:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
        body: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Wow, this editor instance exports its content as JSON."}]}]}',
        tags: ['git', 'cheatsheet', 'guide'],
        comments: [
            {
                author: users[0],
                date: '2021-01-02T19:21:11.111Z',
                content: "C'est pas mal !",
                replies: [],
            },
            {
                author: users[1],
                date: '2021-01-02T19:31:11.311Z',
                content: "Trop d'accord !",
                replies: [
                    {
                        author: users[2],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Je ne suis pas d'accord",
                    },
                    {
                        author: users[3],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Je suis d'accord",
                    },
                ],
            },
            {
                author: users[2],
                date: '2021-01-02T19:21:11.111Z',
                content: "C'était mieux avant.",
                replies: [
                    {
                        author: users[2],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Est-ce que tu m'entends hého ?",
                    },
                ],
            },
        ],
    },
    {
        author: users[3],
        link: '#/blog/3',
        date: '2021-12-15T11:27:04.911Z',
        title: 'La Troisième Dose Obligatoire à Partir de Février',
        category: categories[0],
        toc: [
            {
                'title': 'Les nouvelles réglementations gouvernementales',
                'href': 'nouvelles-reglementations',
                'subtitles': [],
            },
            {
                'title': 'Comment se faire vacciner ?',
                'href': 'nouvelles-reglementations',
                'subtitles': [],
            },
        ],
        abstract:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
        body: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Wow, this editor instance exports its content as JSON."}]}]}',
        tags: ['news', 'doses', 'covid'],
        comments: [],
    },
    {
        author: users[3],
        link: '#/blog/4',
        date: '2021-01-02T19:11:11.111Z',
        title: 'Nouvelle campagne de recrutement lancée à Horizon !',
        category: categories[4],
        abstract:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
        body: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Wow, this editor instance exports its content as JSON."}]}]}',
        tags: ['recrutement', 'horizon'],
        comments: [
            {
                author: users[0],
                date: '2021-01-02T19:21:11.111Z',
                content: "C'est pas mal !",
                replies: [],
            },
            {
                author: users[1],
                date: '2021-01-02T19:31:11.311Z',
                content: "Trop d'accord !",
                replies: [
                    {
                        author: users[2],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Je ne suis pas d'accord",
                    },
                    {
                        author: users[3],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Je suis d'accord",
                    },
                ],
            },
            {
                author: users[2],
                date: '2021-01-02T19:21:11.111Z',
                content: "C'était mieux avant.",
                replies: [
                    {
                        author: users[2],
                        date: '2021-01-02T19:31:11.311Z',
                        content: "Est-ce que tu m'entends hého ?",
                    },
                ],
            },
        ],
    },
]

export const blogProfiles = {
    [users[0].id]: {
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu tempus augue. Maecenas molestie euismod metus, et placerat ligula mattis quis. Curabitur feugiat interdum justo id molestie. Ut eget magna at sapien facilisis accumsan nec at massa. Sed facilisis tempor dictum. Integer hendrerit ante diam. Sed ultricies laoreet tincidunt. Ut vitae luctus erat, non ullamcorper quam. Cras aliquam, eros a posuere gravida, leo magna finibus velit, vel posuere mauris enim eu ex. Fusce eleifend, dolor a vehicula iaculis, lacus arcu feugiat eros, eget hendrerit mi nunc a purus. Aliquam nec nunc tellus. Donec ac consectetur nisl. Etiam in orci pretium, consequat lectus sit amet, euismod arcu. Aenean venenatis commodo elementum. Donec blandit suscipit sapien, ac dignissim ligula bibendum at. Praesent aliquet maximus suscipit.',
    },
    [users[1].id]: {
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu tempus augue. Maecenas molestie euismod metus, et placerat ligula mattis quis. Curabitur feugiat interdum justo id molestie. Ut eget magna at sapien facilisis accumsan nec at massa. Sed facilisis tempor dictum. Integer hendrerit ante diam. Sed ultricies laoreet tincidunt. Ut vitae luctus erat, non ullamcorper quam. Cras aliquam, eros a posuere gravida, leo magna finibus velit, vel posuere mauris enim eu ex. Fusce eleifend, dolor a vehicula iaculis, lacus arcu feugiat eros, eget hendrerit mi nunc a purus. Aliquam nec nunc tellus. Donec ac consectetur nisl. Etiam in orci pretium, consequat lectus sit amet, euismod arcu. Aenean venenatis commodo elementum. Donec blandit suscipit sapien, ac dignissim ligula bibendum at. Praesent aliquet maximus suscipit.',
    },
    [users[2].id]: {
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu tempus augue. Maecenas molestie euismod metus, et placerat ligula mattis quis. Curabitur feugiat interdum justo id molestie. Ut eget magna at sapien facilisis accumsan nec at massa. Sed facilisis tempor dictum. Integer hendrerit ante diam. Sed ultricies laoreet tincidunt. Ut vitae luctus erat, non ullamcorper quam. Cras aliquam, eros a posuere gravida, leo magna finibus velit, vel posuere mauris enim eu ex. Fusce eleifend, dolor a vehicula iaculis, lacus arcu feugiat eros, eget hendrerit mi nunc a purus. Aliquam nec nunc tellus. Donec ac consectetur nisl. Etiam in orci pretium, consequat lectus sit amet, euismod arcu. Aenean venenatis commodo elementum. Donec blandit suscipit sapien, ac dignissim ligula bibendum at. Praesent aliquet maximus suscipit.',
    },
    [users[3].id]: {
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu tempus augue. Maecenas molestie euismod metus, et placerat ligula mattis quis. Curabitur feugiat interdum justo id molestie. Ut eget magna at sapien facilisis accumsan nec at massa. Sed facilisis tempor dictum. Integer hendrerit ante diam. Sed ultricies laoreet tincidunt. Ut vitae luctus erat, non ullamcorper quam. Cras aliquam, eros a posuere gravida, leo magna finibus velit, vel posuere mauris enim eu ex. Fusce eleifend, dolor a vehicula iaculis, lacus arcu feugiat eros, eget hendrerit mi nunc a purus. Aliquam nec nunc tellus. Donec ac consectetur nisl. Etiam in orci pretium, consequat lectus sit amet, euismod arcu. Aenean venenatis commodo elementum. Donec blandit suscipit sapien, ac dignissim ligula bibendum at. Praesent aliquet maximus suscipit.',
    },
}
