<template>
    <div class="p-8">
        <div class="mt-2">
            <div class="flex justify-between">
                <i class="ri-award-line ri-xl" />
                <i class="ri-medal-line ri-xl" />
            </div>
            <div class="relative mt-2">
                <div class="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <div
                        style="width: 30%"
                        class="
        shadow-none
        flex flex-col
        text-center
        whitespace-nowrap
        text-white
        justify-center
        bg-blue-500
      "
                    />
                </div>
                <div class="">
                    Points PAVE
                </div>
            </div>
        </div>
        <div class="mt-2">
            <div class="flex justify-between">
                <i class="ri-award-line ri-xl" />
                <i class="ri-medal-line ri-xl" />
            </div>
            <div class="relative mt-2">
                <div class="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <div
                        style="width: 60%"
                        class="
        shadow-none
        flex flex-col
        text-center
        whitespace-nowrap
        text-white
        justify-center
        bg-blue-500
      "
                    />
                </div>
                <div class="">
                    Questions
                </div>
            </div>
        </div>
        <div class="mt-2">
            <div class="flex justify-between">
                <i class="ri-award-line ri-xl" />
                <i class="ri-medal-line ri-xl" />
            </div>
            <div class="relative mt-2">
                <div class="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <div
                        style="width: 20%"
                        class="
        shadow-none
        flex flex-col
        text-center
        whitespace-nowrap
        text-white
        justify-center
        bg-blue-500
      "
                    />
                </div>
                <div class="">
                    Évènement
                </div>
            </div>
        </div>
        <div class="mt-2">
            <div class="flex justify-between">
                <i class="ri-award-line ri-xl" />
                <i class="ri-medal-line ri-xl" />
            </div>
            <div class="relative mt-2">
                <div class="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <div
                        style="width: 80%"
                        class="
        shadow-none
        flex flex-col
        text-center
        whitespace-nowrap
        text-white
        justify-center
        bg-blue-500
      "
                    />
                </div>
                <div class="">
                    Nombre d'assos
                </div>
            </div>
        </div>
        <div class="flex mt-4">
            <div class="w-1/2 mr-2 border rounded">
                <div class="text-center m-1">
                    Affiché sur votre profil
                </div>
                <div
                    class="flex p-3 min-h-20"
                    @drop="drop($event, 1)"
                    @dragover.prevent
                    @dragenter.prevent
                >
                    <i
                        v-for="badge in getList(1)"
                        :key="badge.index"
                        class="ri-award-line ri-xl fill-current"
                        draggable="true"
                        :class="badge.style"
                        @dragstart="drag($event, badge)"
                    />
                </div>
            </div>
            <div class="w-1/2 ml-2 border rounded">
                <div class="text-center m-1">
                    Tous vos badges
                </div>
                <div
                    class="flex p-3"
                    @drop="drop($event, 2)"
                    @dragover.prevent
                    @dragenter.prevent
                >
                    <i
                        v-for="badge in getList(2)"
                        :key="badge.index"
                        class="ri-award-line ri-xl fill-current"
                        draggable="true"
                        :class="badge.style"
                        @dragstart="drag($event, badge)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            badges: [{ id: 1, list: 1, style: 'text-red-500' },
                { id: 2, list: 1, style: 'text-yellow-500' },
                { id: 3, list: 2, style: 'text-blue-500' },
                { id: 4, list: 2, style: 'text-indigo-500' },
                { id: 5, list: 1, style: 'text-pink-500' },
                { id: 6, list: 1, style: 'text-blue-200' },
                { id: 7, list: 2, style: 'text-red-200' },
                { id: 8, list: 2, style: 'text-black-500' },
                { id: 9, list: 1, style: 'text-gray-500' }]

        }
    },
    methods: {
        getList (list) {
            const res = []
            for (const i of this.badges) {
                if (i.list === list) {
                    res.push(i)
                }
            }
            return res
        },
        drag (event, badge) {
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('id', badge.id)
        },
        drop (event, list) {
            const id = event.dataTransfer.getData('id')
            for (const i of this.badges) {
                if (i.id === parseInt(id)) {
                    i.list = list
                }
            }
        }
    }
}
</script>
