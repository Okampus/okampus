<template>
    <!-- TODO: Solve repeated ESC popover -->
    <ModalPopup :show="showLogin" @close="emit('update:show-login', false)">
        <Transition name="fade">
            <AppLogin @logged-in="emit('update:show-login', false)">
                <h2 class="text-1 text-center text-3xl font-semibold">Connexion</h2>
            </AppLogin>
        </Transition>
    </ModalPopup>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import AppLogin from '@/components/App/AppLogin.vue'

    defineProps({
        showLogin: {
            type: Boolean,
            required: true,
        },
    })

    const emit = defineEmits(['update:show-login'])
</script>
