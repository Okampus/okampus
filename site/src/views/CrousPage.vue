<template>
    <div class="m-0 absolute py-12 hero h-52 w-full top-0 left-0">
        <h3
            class="text-4xl font-bold mb-8 text-0"
            style="padding-left: 5%; padding-right: 5%"
        >
            Crous
        </h3>
    </div>
    <div
        class="
        height
        relative
        mt-32
        mb-10
        text-0
        p-0
        w-full
        md:w-11/12
        mx-auto
      "
    >
        <div class="card mx-auto w-9/12">
            <div class="flex">
                <img
                    class="h-16 w-16 my-auto"
                    src="https://cdn.discordapp.com/attachments/849667496184381480/933296458487173190/logo_crous.png"
                >
                <h3 class="text-xl font-bold my-auto ml-4">
                    Menu du Crous Aujourd'hui :
                </h3>
            </div>
            <div class="flex mt-6 justify-between">
                <div class="w-1/3 px-8">
                    <fieldset class="border-2 border-dashed p-4 h-full">
                        <legend class="text-lg border-2 px-1">
                            Entrées
                        </legend>
                        <ul class="ml-4 list-disc">
                            <li>Camenbert</li>
                            <li>Paté de campagne</li>
                            <li>Macédoine</li>
                        </ul>
                    </fieldset>
                </div>
                <div class="w-1/3 px-8">
                    <fieldset class="border-2 border-dashed p-4 h-full">
                        <legend class="text-lg border-2 px-1">
                            Plats
                        </legend>
                        <ul class="ml-4 list-disc">
                            <li>Poulet</li>
                            <li>Riz</li>
                            <li>Légumes</li>
                            <li>Poisson</li>
                        </ul>
                    </fieldset>
                </div>
                <div class="w-1/3 px-8">
                    <fieldset class="border-2 border-dashed p-4 h-full">
                        <legend class="text-lg border-2 px-1">
                            Desserts
                        </legend>
                        <ul class="ml-4 list-disc">
                            <li>Danette Chocolat</li>
                            <li>Compote</li>
                            <li>Yahourt Nature</li>
                        </ul>
                    </fieldset>
                </div>
            </div>
        </div>
        <BanniereCrous class="w-9/12 mx-auto" />
    </div>
</template>
<script>
import BanniereCrous from '@/components/BanniereCrous.vue'
export default {
    components: { BanniereCrous },
    data() {
        return {
            menu: {
                plats: ["Poulet au curry", "Chilli con carne", "Riz", "Légumes"]
            }
        };
    },
    methods: {
        joinedPlats: function joinedPlats() {
            return this.menu.plats.join(", ");
        }
    }
}
</script>
<style>

</style>
