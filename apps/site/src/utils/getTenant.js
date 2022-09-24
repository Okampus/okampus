export const getTenant = () => {
    const IS_DEV = import.meta.env.DEV
    const BASE_TENANT = import.meta.env.VITE_BASE_TENANT ?? 'base-tenant'
    return IS_DEV ? BASE_TENANT : window.location.hostname.split('.').slice(0, -2).join('.') || BASE_TENANT
}
