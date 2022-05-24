<template>
    <div class="flex justify-center items-center h-full">
        <AppLogin v-if="!auth.loggedIn" class="absolute z-10 w-[80vw] opacity-90 md:w-[60vw] lg:w-[40vw]">
            <div class="flex flex-col items-center -mt-12 w-full">
                <div class="flex justify-center py-3 w-10/12 bg-indigo-700 rounded-xl opacity-100">
                    <div class="w-[12rem] h-[4rem] logo" />
                </div>
                <div class="mt-8 text-2xl text-center">Connectez-vous pour accéder aux espaces 🔒</div>
            </div>
        </AppLogin>
        <div v-else class="flex z-10 flex-col gap-4 p-4 min-w-[20rem] rounded-xl text-0 bg-opacity/80 bg-2">
            <div class="text-3xl">
                {{ new Date().getHours() > 19 ? 'Bonsoir' : 'Bonjour' }}
                {{ auth.user.firstname.split(' ')[0] }} !
            </div>
            <router-link
                class="text-2xl text-blue-600 dark:text-blue-400 hover-arrow-right"
                to="/search/clubs"
                >Voir les associations<i class="ml-2 fa fa-arrow-right"
            /></router-link>
        </div>
    </div>
    <Particles
        id="tsparticles"
        class="absolute top-0 w-full h-content"
        :options="{
            background: {
                color: '#000',
            },
            particles: {
                number: {
                    value: 150,
                },
                move: {
                    direction: 'none',
                    enable: true,
                    outModes: {
                        default: 'out',
                        /* out */
                    },
                    random: true,
                    speed: 0.1,
                    straight: false,
                },
                opacity: {
                    animation: {
                        enable: true,
                        speed: 1,
                        sync: false,
                    },
                    value: {
                        min: 0,
                        max: 1,
                    },
                },
                size: {
                    value: {
                        min: 1,
                        max: 3,
                    },
                },
            },
        }"
    />
</template>

<script setup>
    import AppLogin from '@/components/App/AppLogin.vue'
    import { useAuthStore } from '@/store/auth.store'

    const auth = useAuthStore()
</script>

<style lang="scss">
    .hover-arrow-right {
        transition: color 0.3s ease-in-out;

        & i {
            transition: transform 0.3s ease-in-out;
        }

        &:hover {
            @apply text-blue-600;

            .dark & {
                color: #0af;
            }

            & i {
                transform: translateX(6px);
            }
        }
    }
</style>
