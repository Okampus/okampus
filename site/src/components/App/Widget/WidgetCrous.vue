<template>
    <div class="mt-16">
        <div class="py-2 mx-auto card">
            <div class="flex justify-between">
                <div class="flex gap-2">
                    <img
                        src="https://cdn.discordapp.com/attachments/849667496184381480/933296458487173190/logo_crous.png"
                        alt="logo Crous"
                        class="my-auto w-12 h-12"
                    />
                    <div class="my-auto text-lg font-bold whitespace-nowrap">Aujourd'hui :</div>
                    <div class="my-auto">
                        {{ joinedPlats() }}
                    </div>
                </div>
                <router-link class="my-auto text-blue-500" to="/crous">
                    <p class="my-auto">En savoir plus</p>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return { menu: { plats: ['Poulet au curry', 'Chilli con carne', 'Riz', 'Légumes'] } }
    },
    methods: {
        joinedPlats: function joinedPlats() {
            return this.menu.plats.join(', ')
        },
    },
}
</script>
<style></style>
