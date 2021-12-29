<template lang="">
    <div class="w-56 text-center fixed bottom-4 right-0">
        <Menu
            as="div"
            class="relative inline-block text-left"
        >
            <div>
                <MenuButton
                    class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    Options
                </MenuButton>
            </div>

            <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
            >
                <MenuItems
                    class="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                    <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                            <button
                                :class="[
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900',
                                    'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                                ]"
                            >
                                <EditIcon
                                    :active="active"
                                    class="w-5 h-5 mr-2 text-violet-400"
                                    aria-hidden="true"
                                />
                                Edit
                            </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                            <button
                                :class="[
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900',
                                    'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                                ]"
                            >
                                <DuplicateIcon
                                    :active="active"
                                    class="w-5 h-5 mr-2 text-violet-400"
                                    aria-hidden="true"
                                />
                                Duplicate
                            </button>
                        </MenuItem>
                    </div>
                    <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                            <button
                                :class="[
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900',
                                    'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                                ]"
                            >
                                <ArchiveIcon
                                    :active="active"
                                    class="w-5 h-5 mr-2 text-violet-400"
                                    aria-hidden="true"
                                />
                                Archive
                            </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                            <button
                                :class="[
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900',
                                    'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                                ]"
                            >
                                <MoveIcon
                                    :active="active"
                                    class="w-5 h-5 mr-2 text-violet-400"
                                    aria-hidden="true"
                                />
                                Move
                            </button>
                        </MenuItem>
                    </div>

                    <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                            <button
                                :class="[
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900',
                                    'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                                ]"
                            >
                                <DeleteIcon
                                    :active="active"
                                    class="w-5 h-5 mr-2 text-violet-400"
                                    aria-hidden="true"
                                />
                                Delete
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </transition>
        </Menu>
    </div>

    <!-- component -->
    <div class="w-21/24 my-8 mx-auto shadow-md bg-white card">
        <main class="mt-10">
            <div
                class="mb-4 md:mb-0 w-full max-w-screen-md mx-auto relative shadow-xl"
                style="height: 24em;"
            >
                <div
                    class="absolute left-0 bottom-0 w-full h-full z-10 card"
                    style="background-image: linear-gradient(180deg,transparent,rgba(0,0,0,.7));"
                />
                <img
                    src="https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80"
                    class="absolute left-0 top-0 w-full h-full z-0 object-cover"
                >
                <div class="p-4 absolute bottom-0 left-0 z-20">
                    <a
                        href="#"
                        class="px-4 py-1 bg-black text-gray-200 inline-flex items-center justify-center mb-2"
                    >Nutrition</a>
                    <h2 class="text-4xl font-semibold text-gray-100 leading-tight">
                        Pellentesque a consectetur velit, ac molestie ipsum. Donec sodales, massa et auctor.
                    </h2>
                    <div class="flex mt-3">
                        <img
                            src="https://randomuser.me/api/portraits/men/97.jpg"
                            class="h-10 w-10 rounded-full mr-2 object-cover"
                        >
                        <div>
                            <p class="font-semibold text-gray-200 text-sm">
                                Mike Sullivan
                            </p>
                            <p class="font-semibold text-gray-400 text-xs">
                                14 Aug
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- component signature auteur article début -->
            <head>
                <aside>
                    <div
                        class=" flex w-3/4 h-35 mx-auto mt-8 p-3 bg-1 card"
                        style="border-radius: 50px;"
                    >
                        <div class=" relative flex">
                            <img
                                src="https://picsum.photos/id/684/600/400"
                                alt=""
                                class="my-auto h-24 w-24 border-blue-300 rounded-full border-4"
                            >

                            <p class="lg:text-lg my-auto p-3 text-3">
                                Lorem, ipsum dolor sit amet
                                consectetur
                                adipisicing elit.
                                Amet
                                natus
                                recusandae
                                velit?
                                Totam aliqu dolorum modi repudiandae inventore animi ipsum vero eaque deleniti voluptates consectetur,
                            </p>
                            <div class="absolute  bottom-0 right-0  inline-flex">
                                <a
                                    class="mx-2"
                                    href="#"
                                ><i
                                    class="fab fa-github"
                                /></a>
                                <a
                                    class="mx-2"
                                    href="#"
                                ><i class="far fa-envelope" /></a>
                            </div>
                        </div>
                    </div>
                </aside>
                <!--component signature fin-->

                <!--bloc de texte début-->
                <div class="px-4 lg:px-0 mt-12 text-gray-700 max-w-screen-lg mx-auto text-lg leading-relaxed text-5">
                    <p class="pb-6">
                        Advantage old had otherwise sincerity dependent additions. It in adapted natural hastily is
                        justice. Six draw
                        you him full not mean evil. Prepare garrets it expense windows shewing do an. She projection advantages
                        resolution son indulgence. Part sure on no long life am at ever. In songs above he as drawn to. Gay was
                        outlived peculiar rendered led six.
                    </p>

                    <p class="pb-6">
                        Difficulty on insensible reasonable in. From as went he they. Preference themselves me as
                        thoroughly
                        partiality considered on in estimating. Middletons acceptance discovered projecting so is so or. In or
                        attachment inquietude remarkably comparison at an. Is surrounded prosperous stimulated am me discretion
                        expression. But truth being state can she china widow. Occasional preference fat remarkably now projecting
                        uncommonly dissimilar. Sentiments projection particular companions interested do at my delightful. Listening
                        newspaper in advantage frankness to concluded unwilling.
                    </p>

                    <p class="pb-6">
                        Adieus except say barton put feebly favour him. Entreaties unpleasant sufficient few pianoforte
                        discovered
                        uncommonly ask. Morning cousins amongst in mr weather do neither. Warmth object matter course active law
                        spring six. Pursuit showing tedious unknown winding see had man add. And park eyes too more him. Simple excuse
                        active had son wholly coming number add. Though all excuse ladies rather regard assure yet. If feelings so
                        prospect no as raptures quitting.
                    </p>

                    <div class="border-l-4 border-gray-500 pl-4 mb-6 italic rounded">
                        Sportsman do offending supported extremity breakfast by listening. Decisively advantages nor
                        expression
                        unpleasing she led met. Estate was tended ten boy nearer seemed. As so seeing latter he should thirty whence.
                        Steepest speaking up attended it as. Made neat an on be gave show snug tore.
                    </div>

                    <p class="pb-6">
                        Exquisite cordially mr happiness of neglected distrusts. Boisterous impossible unaffected he me
                        everything.
                        Is fine loud deal an rent open give. Find upon and sent spot song son eyes. Do endeavor he differed carriage
                        is learning my graceful. Feel plan know is he like on pure. See burst found sir met think hopes are marry
                        among. Delightful remarkably new assistance saw literature mrs favourable.
                    </p>

                    <h2 class="text-2xl text-gray-800 font-semibold mb-4 mt-4 text-1">
                        Uneasy barton seeing remark happen his has
                    </h2>

                    <p class="pb-6">
                        Guest it he tears aware as. Make my no cold of need. He been past in by my hard. Warmly thrown
                        oh he common
                        future. Otherwise concealed favourite frankness on be at dashwoods defective at. Sympathize interested
                        simplicity at do projecting increasing terminated. As edward settle limits at in.
                    </p>

                    <p class="pb-6">
                        Dashwood contempt on mr unlocked resolved provided of of. Stanhill wondered it it welcomed oh.
                        Hundred no
                        prudent he however smiling at an offence. If earnestly extremity he he propriety something admitting convinced
                        ye. Pleasant in to although as if differed horrible. Mirth his quick its set front enjoy hoped had there. Who
                        connection imprudence middletons too but increasing celebrated principles joy. Herself too improve gay winding
                        ask expense are compact. New all paid few hard pure she.
                    </p>

                    <p class="pb-6">
                        Breakfast agreeable incommode departure it an. By ignorant at on wondered relation. Enough at
                        tastes really
                        so cousin am of. Extensive therefore supported by extremity of contented. Is pursuit compact demesne invited
                        elderly be. View him she roof tell her case has sigh. Moreover is possible he admitted sociable concerns. By
                        in cold no less been sent hard hill.
                    </p>

                    <p class="pb-6">
                        Detract yet delight written farther his general. If in so bred at dare rose lose good. Feel and
                        make two real
                        miss use easy. Celebrated delightful an especially increasing instrument am. Indulgence contrasted sufficient
                        to unpleasant in in insensible favourable. Latter remark hunted enough vulgar say man. Sitting hearted on it
                        without me.
                    </p>
                </div>
            </head>
        </main>
        <!-- bloc de texte ends here -->
        <comment-section
            :char-count="true"
        />
    <!-- component comment section début-->
    </div>
</template>

<script>
import CommentSection from '@/components/CommentSection.vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

export default {
    components: {
        CommentSection,
        Menu,
        MenuButton,
        MenuItems,
        MenuItem
    }
}

</script>
<style lang="">

</style>
