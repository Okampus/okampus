<script>
    import router from '@/router'
    export default {
        created() {
            this.$store.dispatch('auth/me').then(() => router.push('/'))
        },
    }
</script>
