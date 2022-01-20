<template>
    <div class="mt-16">
        <div class="card py-2 mx-auto">
            <div class="flex justify-between">
                <div class="flex gap-2">
                    <img
                        src="https://cdn.discordapp.com/attachments/849667496184381480/933296458487173190/logo_crous.png"
                        alt="logo Crous"
                        class="h-12 w-12 my-auto"
                    >
                    <div class="my-auto font-bold text-lg whitespace-nowrap">
                        Aujourd'hui :
                    </div>
                    <div class=" my-auto">
                        {{ joinedPlats() }}
                    </div>
                </div>
                <router-link
                    class="text-blue-500 my-auto"
                    to="/crous"
                >
                    <p class="my-auto">
                        En savoir plus
                    </p>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            menu: {
                plats: ["Poulet au curry","Chilli con carne","Riz", "Légumes"]
            }
        }
    },
    methods: {
        joinedPlats: function joinedPlats () {
            return this.menu.plats.join(", ")
        }
    },
}
</script>
<style >

</style>
