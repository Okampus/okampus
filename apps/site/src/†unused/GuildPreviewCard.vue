<template>
    <div class="bg-1 text-1 rounded-lg">
        <AppLoader v-if="name === undefined || name === null" :size="2" />
        <div v-else class="flex w-full items-center justify-between" :class="[mini ? 'py-2 px-3' : 'p-5']">
            <div class="flex">
                <a :href="inviteUrl" target="_blank"
                    ><img :src="iconUrl" :class="[mini ? 'w-10 h-10 rounded-2xl' : 'w-16 h-16 rounded-3xl']"
                /></a>
                <div class="mx-4 flex flex-col">
                    <a
                        :href="inviteUrl"
                        class="font-bold hover:underline"
                        target="_blank"
                        :class="[mini ? 'text-sm' : 'text-lg']"
                        >{{ name }}</a
                    >
                    <div class="flex" :class="[mini ? '-mt-0.5 flex-row items-center gap-2.5' : 'flex-col']">
                        <div v-if="description !== ''" :class="[mini ? 'text-xs tracking-tight' : 'text-sm']">
                            {{ description }}
                        </div>
                        <div class="flex items-center gap-1" :class="[mini ? 'text-xs' : 'mt-1.5 text-sm']">
                            <span class="relative flex h-2 w-2">
                                <span
                                    class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
                                ></span>
                                <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </span>
                            <div class="flex">
                                <div v-if="mini">{{ presence }}</div>
                                <p v-else>{{ presence }} membres en ligne</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <a
                    :href="inviteUrl"
                    target="_blank"
                    :class="[mini ? 'py-1 px-2 rounded text-xs' : 'py-3 px-4 rounded-md text-sm']"
                    class="flex bg-green-600 text-white"
                >
                    <i v-if="mini" class="fas fa-plus" />
                    <p v-else>Rejoindre</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
    import AppLoader from '../AppLoader.vue'

    defineProps({
        name: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: '',
        },
        iconUrl: {
            type: String,
            default: '',
        },
        inviteUrl: {
            type: String,
            default: '',
        },
        presence: {
            type: String,
            default: '0',
        },
        mini: {
            type: Boolean,
            default: true,
        },
    })
</script>
