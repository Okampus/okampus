import axios from 'axios'

const $axios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

const DEV = import.meta.env.DEV
$axios.interceptors.response.use(
    (res) => {
        if (DEV) {
            console.info('✉️ ', res)
        }
        return res
    },
    (error) => {
        if (DEV) {
            // TODO: deal with axios errors
            console.error('✉️ ', error.toString())
        }
        throw error
    },
)

export default $axios
