<template>
    <div class="rounded-lg bg-1 text-1">
        <AppLoader v-if="name === undefined || name === null" :size="2" />
        <div v-else class="flex justify-between items-center w-full" :class="[mini ? 'py-2 px-3' : 'p-5']">
            <div class="flex">
                <a :href="inviteUrl" target="_blank"
                    ><img :src="iconUrl" :class="[mini ? 'w-10 h-10 rounded-2xl' : 'w-16 h-16 rounded-3xl']"
                /></a>
                <div class="flex flex-col mx-4">
                    <a
                        :href="inviteUrl"
                        class="font-bold hover:underline"
                        target="_blank"
                        :class="[mini ? 'text-sm' : 'text-lg']"
                        >{{ name }}</a
                    >
                    <div class="flex" :class="[mini ? '-mt-0.5 flex-row items-center gap-2.5' : 'flex-col']">
                        <div v-if="tagLine !== ''" :class="[mini ? 'text-xs tracking-tight' : 'text-sm']">
                            {{ tagLine }}
                        </div>
                        <div class="flex gap-1 items-center" :class="[mini ? 'text-xs' : 'mt-1.5 text-sm']">
                            <span class="flex relative w-2 h-2">
                                <span
                                    class="inline-flex absolute w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"
                                ></span>
                                <span class="inline-flex relative w-2 h-2 bg-green-500 rounded-full"></span>
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
                    class="flex text-white bg-green-600"
                >
                    <font-awesome-icon v-if="mini" icon="plus" />
                    <p v-else>Rejoindre</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import AppLoader from '../AppLoader.vue'
    export default {
        components: { AppLoader },
        props: {
            mini: {
                type: Boolean,
                default: true,
            },
            name: {
                type: String,
                default: null,
            },
            iconUrl: {
                type: String,
                default: null,
            },
            presence: {
                type: Number,
                default: null,
            },
            inviteUrl: {
                type: String,
                default: null,
            },
            tagLine: {
                type: String,
                default: '',
            },
        },
    }
</script>
