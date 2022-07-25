export default [
    {
        condition: new RegExp('^image/(.)+'),
        color: 'bg-orange-500',
    },
    {
        condition: new RegExp('^audio/(.)+'),
        color: 'bg-sky-500',
    },
    {
        condition: new RegExp('^text/(.)+'),
        color: 'bg-blue-500',
    },
    {
        condition: new RegExp('^video/(.)+'),
        color: 'bg-green-500',
    },
    {
        condition: new RegExp('^application/(.)+'),
        color: 'bg-pink-500',
    },
]

export const DEFAULT_TYPE = 'bg-gray-500'
