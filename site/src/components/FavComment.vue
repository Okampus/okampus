<template>
    <div class="m-4 flex bg-1 min-h-32 rounded-md">
        <div class="flex flex-col text-white w-14 justify-center bg-gray-600 rounded-l-md">
            <button><i class="text-center text-4xl -p-x-4 -p-b-2 ri-arrow-up-s-fill" /></button>
            <div class="text-center mx-1">
                {{ post.upvotes }}
            </div>
            <button><i class="text-center text-4xl -p-x-4 -p-t-2 ri-arrow-down-s-fill" /></button>
        </div>
        <div class="border-dashed border-l-2 dark:border-opacity-25 ml-2 " />
        <div class="flex border-dashed border-l-2 dark:border-opacity-25 flex-col  justify-center object-cover ml-2 px-8">
            <i class="ri-chat-4-line text-2 text-4xl text-center hidden md:block" />
        </div>
        <div class="flex w-full">
            <div class="my-2 flex flex-col justify-between ">
                <div>
                    <p class="text-5">
                        Publié par {{ post.author.username }} {{ dateSince(new Date(post.createdAt)) }}
                    </p>
                    <a class="text-0 text-lg mr-4 line-clamp-2 ">{{ JSON.parse(post.body).content[0].content[0].text }}</a>
                </div>
                <div class="flex items-center ri-lg gap-2">
                    <div
                        v-for="(action,i) in actions"
                        :key="i"
                        class="flex items-center text-5 hover:bg-3-light hover:dark:bg-3-dark px-2 py-1.5 rounded"
                        @click="actionsMap[action].action"
                    >
                        <i
                            :class="actionsMap[action].icon"
                            class="ri-md"
                        />
                        <p class="text-2 text-sm tracking-tighter pl-1 hidden md:block">
                            {{ actionsMap[action].name() }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    components: {  },
    props: {
        post: {
            type: Object,
            default: () => {}
        },
        actions: {
            type: Array,
            default: function () {
                return [
                    'viewComments',
                    'favorite',
                    'flag'
                ]
            }
        }
    },
    computed: {
        actionsMap () {
            // TODO: Actions
            return {
                viewComments: { name: () => { return "3 Réponses" }, icon: 'ri-chat-2-line', action: function () { console.log('Commentaire') } },
                favorite: { name: () => { return 'Favori' }, icon: 'ri-star-line', action: function () { console.log('Favori') } },
                flag: { name: () => { return 'Signaler' }, icon: 'ri-flag-line', action: function () { console.log('Signaler') } },
            }
        }
    },
    methods: {
        dateSince: (date) => {
            const formatter = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

            const DIVISIONS = [
                { amount: 60, name: 'seconds' },
                { amount: 60, name: 'minutes' },
                { amount: 24, name: 'hours' },
                { amount: 7, name: 'days' },
                { amount: 4.34524, name: 'weeks' },
                { amount: 12, name: 'months' },
                { amount: Number.POSITIVE_INFINITY, name: 'years' },
            ];
            let duration = (date - new Date()) / 1000;

            for (let i = 0; i <= DIVISIONS.length; i++) {
                const division = DIVISIONS[i];
                if (Math.abs(duration) < division.amount) {
                    return formatter.format(Math.round(duration), division.name);
                }
                duration /= division.amount;
            }
        }
    }

}
</script>
<style >
</style>
