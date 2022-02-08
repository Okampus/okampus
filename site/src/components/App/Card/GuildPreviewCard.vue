<template>
    <div
        class="flex justify-between items-center rounded-lg bg-1 text-1"
        :class="[mini ? 'py-2 px-3' : 'p-5']"
    >
        <div class="flex">
            <a :href="inviteUrl"
                ><img :src="iconUrl" :class="[mini ? 'w-10 h-10 rounded-2xl' : 'w-16 h-16 rounded-3xl']"
            /></a>
            <div class="flex flex-col mx-4">
                <a
                    :href="inviteUrl"
                    class="font-bold hover:underline"
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
                        <div>
                            {{ presence }}
                            <p v-if="!mini">en ligne</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <a
                :href="inviteUrl"
                :class="[mini ? 'py-1 px-2 rounded text-xs' : 'py-3 px-4 rounded-md text-sm']"
                class="text-white bg-green-600"
            >
                <font-awesome-icon icon="plus" />
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            mini: {
                type: Boolean,
                default: true,
            },
            name: {
                type: String,
                required: true,
            },
            iconUrl: {
                type: String,
                required: true,
            },
            presence: {
                type: String,
                required: true,
            },
            inviteUrl: {
                type: String,
                required: true,
            },
            tagLine: {
                type: String,
                default: '',
            },
        },
    }
</script>
