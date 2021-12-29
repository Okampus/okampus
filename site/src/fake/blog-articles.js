import { users } from './users'

export const categories = [
    {
        name: 'News',
        link: '#'
    },
    {
        name: 'Hobby',
        link: '#'
    },
    {
        name: 'Programmation',
        link: '#'
    },
    {
        name: 'Devlog',
        link: '#'
    },
    {
        name: 'Divers',
        link: '#'
    }
]

export const articles = [
    {
        author: users[0], link: '#/blog/show/1', date: '2021-10-18T13:51:36.631Z',
        title: '[FEATURE] Assigner des équipes à des tickets', category: categories[3],
        abstract: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!"},
    {
        author: users[1], link: '#/blog/show/1', date: '2021-12-18T18:53:21.051Z',
        title: "L'escalade : plus qu'une passion !", category: categories[1],
        abstract: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!"},
    {
        author: users[2], link: '#/blog/show/1', date: '2021-11-12T09:21:23.181Z',
        title: '[GIT] Cheatsheet Git : GUIDE COMPLET !', category: categories[2],
        abstract: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!"},
    {
        author: users[3], link: '#/blog/show/1', date: '2021-12-15T11:27:04.911Z',
        title: 'La Troisième Dose Obligatoire à Partir de Février', category: categories[0],
        abstract: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!"},
    {
        author: users[3], link: '#/blog/show/1', date: '2021-01-02T19:11:11.111Z',
        title: 'Nouvelle campagne de recrutement lancée à Horizon !', category: categories[4],
        abstract: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!"}
]
