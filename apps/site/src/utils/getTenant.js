export const getTenant = () =>
    window.location.hostname.split('.').slice(0, -2).join('.') || import.meta.env.VITE_BASE_TENANT
