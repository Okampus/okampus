export default {
    server: {
        apiKey: import.meta.env.VITE_TYPESENSE_API_KEY,
        nodes: [
            {
                host: import.meta.env.VITE_TYPESENSE_HOST,
                port: import.meta.env.VITE_TYPESENSE_PORT,
                protocol: import.meta.env.VITE_TYPESENSE_SCHEME,
            },
        ],
        cacheSearchResultsForSeconds: 2 * 60,
    },
}
