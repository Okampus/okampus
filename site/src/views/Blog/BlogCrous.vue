<template>
    <div class="absolute top-0 left-0 py-12 m-0 w-full h-52 hero">
        <h3 class="mb-8 text-4xl font-bold text-0" style="padding-left: 5%; padding-right: 5%">Crous</h3>
    </div>
    <div class="relative p-0 mx-auto mt-32 mb-10 w-full md:w-11/12 height text-0">
        <div class="mx-auto w-9/12 card">
            <div class="flex">
                <img
                    class="my-auto w-16 h-16"
                    src="https://cdn.discordapp.com/attachments/849667496184381480/933296458487173190/logo_crous.png"
                />
                <h3 class="my-auto ml-4 text-xl font-bold">Menu du Crous Aujourd'hui :</h3>
            </div>
            <div class="flex justify-between mt-6">
                <div class="px-8 w-1/3">
                    <fieldset class="p-4 h-full border-2 border-dashed">
                        <legend class="px-1 text-lg border-2">Entrées</legend>
                        <ul class="ml-4 list-disc">
                            <li>Camenbert</li>
                            <li>Paté de campagne</li>
                            <li>Macédoine</li>
                        </ul>
                    </fieldset>
                </div>
                <div class="px-8 w-1/3">
                    <fieldset class="p-4 h-full border-2 border-dashed">
                        <legend class="px-1 text-lg border-2">Plats</legend>
                        <ul class="ml-4 list-disc">
                            <li>Poulet</li>
                            <li>Riz</li>
                            <li>Légumes</li>
                            <li>Poisson</li>
                        </ul>
                    </fieldset>
                </div>
                <div class="px-8 w-1/3">
                    <fieldset class="p-4 h-full border-2 border-dashed">
                        <legend class="px-1 text-lg border-2">Desserts</legend>
                        <ul class="ml-4 list-disc">
                            <li>Danette Chocolat</li>
                            <li>Compote</li>
                            <li>Yahourt Nature</li>
                        </ul>
                    </fieldset>
                </div>
            </div>
        </div>

        <CrousWidget class="mx-auto w-9/12" />
    </div>
</template>

<script>
import CrousWidget from '@/components/App/Widget/WidgetCrous.vue'
export default {
    components: { CrousWidget },
    data() {
        return { menu: { plats: ['Poulet au curry', 'Chili con carne', 'Riz', 'Légumes'] } }
    },
    methods: {
        joinedPlats: function joinedPlats() {
            return this.menu.plats.join(', ')
        },
    },
}
</script>
