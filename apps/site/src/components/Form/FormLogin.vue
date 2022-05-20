<template>
    <!-- TODO: Solve repeated ESC popover -->
    <AppModal :show="showLogin" @close="emit('update:show-login', false)">
        <Transition name="fade">
            <AppLogin @logged-in="emit('update:show-login', false)">
                <h2 class="text-3xl font-semibold text-center text-1">Connexion</h2>
            </AppLogin>
        </Transition>
    </AppModal>
</template>

<script setup>
    import AppModal from '@/components/App/AppModal.vue'
    import AppLogin from '../App/AppLogin.vue'

    defineProps({
        showLogin: {
            type: Boolean,
            required: true,
        },
    })

    const emit = defineEmits(['update:show-login'])
</script>
