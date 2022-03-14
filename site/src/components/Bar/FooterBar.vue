<template>
    <footer class="flex flex-col gap-6 mt-8 mb-6 xs:mx-20 sm:mx-auto xs-max:mx-10">
        <div class="flex flex-col items-center sm:gap-6 xl:flex-row xl:gap-2">
            <div class="flex flex-col gap-6 sm-max:w-full">
                <!-- Logo Separator -->
                <AppLogo class="ml-5" />

                <div
                    class="flex flex-col-reverse gap-6 mx-10 lg:flex-row lg:gap-14 sm-max:flex-row sm-max:gap-12"
                >
                    <!-- Contact Us -->
                    <div class="flex gap-4 mt-1 text-0">
                        <div
                            class="flex flex-row justify-between sm:gap-2.5 sm:items-center sm:mr-14 sm:ml-6 sm:w-full lg:flex-col lg:mx-0 lg:w-fit sm-max:flex-col sm-max:mb-10 sm-max:ml-2"
                        >
                            <a
                                v-for="(link, i) in contacts"
                                :key="i"
                                class="flex text-3xl lg:h-5 lg:text-xl flex-start"
                                :href="link.href"
                            >
                                <i :class="link.icon" class="hover-icon" />
                            </a>
                        </div>
                        <div class="hidden flex-col gap-2.5 lg:flex">
                            <a
                                v-for="(link, i) in contacts"
                                :key="i"
                                :href="link.href"
                                target="_blank"
                                class="h-5 text-base link"
                                >{{ link.label }}</a
                            >
                        </div>
                    </div>

                    <!-- Sections -->
                    <div
                        class="flex flex-wrap items-center sm:flex-row sm:gap-10 sm:items-start sm-max:w-full"
                    >
                        <div
                            v-for="(section, i) in footerSections"
                            :key="i"
                            class="sm-max:mb-10 sm-max:w-1/2 text-1"
                        >
                            <h5 class="mb-2 text-base tracking-wider uppercase header text-0">
                                {{ section.name }}
                            </h5>
                            <div class="flex flex-col gap-1">
                                <div v-for="(link, j) in section.links" :key="j">
                                    <AppLink :link="link" class="text-base link" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Discord Invite Previews -->
            <div class="flex flex-col gap-2 w-full lg:flex-row lg:w-fit xl:flex-col">
                <GuildPreviewCard
                    v-for="(server, i) in servers"
                    :key="i"
                    class="hidden lg:flex"
                    :name="server.name"
                    :icon-url="server.iconUrl"
                    :invite-url="server.inviteUrl"
                    :description="server.description"
                    :presence="server.presence"
                />
                <GuildPreviewCard
                    v-for="(server, i) in servers"
                    :key="i"
                    class="hidden lg-max:flex"
                    :mini="false"
                    :name="server.name"
                    :icon-url="server.iconUrl"
                    :invite-url="server.inviteUrl"
                    :description="server.description"
                    :presence="server.presence"
                />
            </div>
        </div>

        <!-- Copyright -->
        <div class="flex justify-center items-center text-0">
            <div class="flex flex-col gap-2 items-center xs:flex-row">
                <p>Made with</p>
                <i class="hover:text-red-500 transition-transform hover:scale-125 fas fa-heart" />
                <p>by Horizon</p>
                <div class="flex gap-1 items-center">
                    <i class="text-sm far fa-copyright" />
                    <p>{{ new Date().getFullYear() }}</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
    import AppLink from '../App/AppLink.vue'
    import AppLogo from '../App/AppLogo.vue'
    import GuildPreviewCard from '../App/Card/GuildPreviewCard.vue'

    import servers from '@/shared/navigation/discord-servers.enum'
    import contacts from '@/shared/navigation/footer-contacts.enum'
    import footerSections from '@/shared/navigation/footer-sections.enum'
</script>

<style lang="scss">
    .hover-icon {
        background: transparent;
        transition: transform 0.2s ease-in-out;

        &:hover {
            transform: scale(1.2);

            .dark & {
                text-shadow: 0 0 15px #fff;
            }
        }
    }
</style>
