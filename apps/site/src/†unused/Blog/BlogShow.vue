<template>
    <div v-if="article === null" class="card my-5 mx-auto w-full max-w-screen-md">
        Cet article n'existe pas !
    </div>
    <div v-else class="my-5 mx-auto flex w-full max-w-screen-md flex-col gap-6">
        <!-- ARTICLE -->
        <div class="card flex flex-col gap-8 pb-8">
            <!-- HEADER -->
            <div class="flex flex-col gap-4">
                <!-- THUMBNAIL -->
                <img :src="thumbnail" class="z-0 rounded-lg object-cover" />
                <div class="mx-4 flex flex-col gap-1">
                    <!-- TITLE -->
                    <div class="text-0 text-justify text-4xl font-bold">
                        {{ article.title }}
                    </div>

                    <span class="text-0 flex items-center text-base">
                        <div class="flex items-end gap-2">
                            <div class="text-2 text-base">par</div>
                            <a class="link mr-12 text-xl" href="#author">{{ article.author.fullname }}</a>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-1 flex items-center gap-2">
                                <i class="fas fa-comment" />
                                <a class="hover:underline" href="#comments"> 3 comments</a>
                            </div>
                            <div class="text-1 flex items-center gap-2 text-base">
                                <i class="fas fa-hourglass" />
                                <TipRelativeDate :date="article.date" />
                            </div>
                            <div class="text-2 flex items-center gap-2">
                                <i class="fas fa-stopwatch" />
                                <p>Lecture en {{ readingTime }} min</p>
                            </div>
                        </div>
                    </span>
                </div>

                <!-- TAGS -->
                <div v-if="article.tags.length > 0" class="flex items-center text-base">
                    <div class="text-0 mr-4 flex items-center gap-2 text-lg">
                        <i class="fas fa-tags" />
                        <p class="text-base">{{ article.tags.length }} Tags</p>
                    </div>

                    <div class="flex gap-1">
                        <span v-for="tag in article.tags" :key="tag.id" class="text-2 text-base">
                            <LabelTag :tag-name="tag" />
                        </span>
                    </div>
                </div>
            </div>

            <!-- SHARE -->
            <div class="text-0 mx-auto flex items-center gap-3">
                <p class="text-xl underline">Partage cet article</p>
                <a class="raised flex items-center gap-2 rounded-md bg-orange-600 py-1 px-3 text-white">
                    <i class="fab fa-reddit" />
                    <p>Reddit</p>
                </a>
                <a class="raised flex items-center gap-2 rounded-md bg-slate-800 py-1 px-3 text-white">
                    <i class="fab fa-discord" />
                    <p>Discord</p>
                </a>
                <a class="raised flex items-center gap-2 rounded-md bg-blue-900 py-1 px-3 text-white">
                    <i class="fab fa-facebook" />
                    <p>Facebook</p>
                </a>
                <a
                    class="bg-2 raised flex items-center gap-2 rounded-md py-1 px-3 text-white"
                    style="background-color: #0e76a8"
                >
                    <i class="fab fa-linkedin" />
                    <p>LinkedIn</p>
                </a>
            </div>

            <!-- TABLE OF CONTENTS -->
            <div class="text-5 bg-3 mx-8 rounded py-4 px-8">
                <div class="text-3 text-2xl font-bold">Table des Matières</div>
                <ul
                    v-for="(title, i) in article.toc"
                    :key="i"
                    class="ml-3 list-inside list-[square] text-3xl"
                >
                    <li class="text-1 mt-1 text-lg font-bold">
                        <a :href="`#${title.href}`">{{ title.title }}</a>
                        <ul v-if="title.subtitles?.length" class="list-inside list-disc font-normal">
                            <li v-for="(subtitle, j) in title.subtitles" :key="j" class="ml-10 text-base">
                                <a :href="`#${subtitle.href}`" class="link text-2">{{ subtitle.title }}</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <!-- CONTENT -->
            <div class="mx-3 flex flex-col gap-6 text-justify">
                <MdRenderer ref="renderer" :content="article.body" />
                <!-- <p>
                    In many situations, you’ll need to find the number of items stored in a data structure.
                    justice. Six draw
                    you him full not mean evil. Prepare garrets it expense windows shewing do an. She projection advantages
                    resolution son indulgence. Part sure on no long life am at ever. In songs above he as drawn to. Gay was
                    outlived peculiar rendered led six.
                </p>
                <p>
                    Difficulty on insensible reasonable in. From as went he they. Preference themselves me as
                    thoroughly
                    partiality considered on in estimating. Middletons acceptance discovered projecting so is so or. In or
                    attachment inquietude remarkably comparison at an. Is surrounded prosperous stimulated am me discretion
                    expression. But truth being state can she china widow. Occasional preference fat remarkably now projecting
                    uncommonly dissimilar. Sentiments projection particular companions interested do at my delightful. Listening
                    newspaper in advantage frankness to concluded unwilling.
                </p>
                <div class="border-l-4 border-gray-500 pl-4 italic rounded">
                    Sportsman do offending supported extremity breakfast by listening. Decisively advantages nor
                    expression
                    unpleasing she led met. Estate was tended ten boy nearer seemed. As so seeing latter he should thirty whence.
                    Steepest speaking up attended it as. Made neat an on be gave show snug tore.
                </div>
                <h2 class="text-2xl font-semibold mt-4 text-0">
                    Uneasy barton seeing remark happen his has
                </h2>
                <p>
                    Guest it he tears aware as. Make my no cold of need. He been past in by my hard. Warmly thrown
                    oh he common
                    future. Otherwise concealed favourite frankness on be at dashwoods defective at. Sympathize interested
                    simplicity at do projecting increasing terminated. As edward settle limits at in.
                </p>
                <p>
                    Dashwood contempt on mr unlocked resolved provided of of. Stanhill wondered it it welcomed oh.
                    Hundred no
                    prudent he however smiling at an offence. If earnestly extremity he he propriety something admitting convinced
                    ye. Pleasant in to although as if differed horrible. Mirth his quick its set front enjoy hoped had there. Who
                    connection imprudence middletons too but increasing celebrated principles joy. Herself too improve gay winding
                    ask expense are compact. New all paid few hard pure she.
                </p> -->
            </div>
        </div>

        <!-- AUTHOR ABSTRACT -->
        <div class="card pt-2">
            <span class="border-b-1 flex items-center gap-10 space-x-3 p-2">
                <div class="-mt-8">
                    <img class="h-20 w-20 rounded-full border-2 object-cover" :src="article.author.avatar" />
                </div>
                <div class="text-1 text-2xl">
                    <p class="">
                        À propos de
                        <a href="#" class="font-bold hover:underline">
                            {{ article.author.fullname }}
                        </a>
                    </p>
                </div>
            </span>
            <div>
                <p class="text-5 mt-2">
                    {{ profile.about }}
                </p>
                <div class="mt-4 flex justify-end">
                    <a :href="article.author.link" class="text-0 text-sm font-bold hover:underline"
                        >Voir le profil de {{ article.author.fullname }}</a
                    >
                </div>
            </div>
        </div>

        <!-- COMMENT SECTION -->
        <div class="card">
            <div>
                <h1 class="text-1 mb-4 text-lg font-semibold uppercase text-gray-900">
                    {{ article.comments.length }} Commentaires
                </h1>

                <div v-for="(comment, i) in article.comments" :key="i" class="mt-4 flex gap-2">
                    <img class="h-10 w-10 rounded-full border-2 object-cover" :src="comment.author.avatar" />
                    <div class="flex w-full flex-col rounded-lg px-2">
                        <div class="flex items-center gap-3">
                            <p class="text-1 font-semibold">
                                {{ comment.author.fullname }}
                            </p>
                            <span class="text-4 text-xs">
                                {{ timeAgo(comment.date) }}
                            </span>
                        </div>
                        <p class="text-2 text-sm">
                            {{ comment.content }}
                        </p>
                        <div v-if="comment.replies.length > 0">
                            <!-- TODO: add Disclosure button -->
                            <!-- <div class="flex gap-1 items-center mt-3 text-sm font-bold text-3">
                                        <p class="uppercase">
                                            {{ comment.replies.length }}
                                            {{ comment.replies.length > 1 ? 'réponses' : 'réponse' }}
                                        </p>
                                        <i class="fas" :class="open ? 'fa-chevron-up' : 'fa-chevron-down'" />
                                    </div> -->

                            <div class="mt-2 flex flex-col gap-2">
                                <div v-for="(reply, j) in comment.replies" :key="j" class="flex gap-2">
                                    <img
                                        class="h-10 w-10 rounded-full border-2 object-cover"
                                        :src="reply.author.avatar"
                                    />
                                    <div class="bg-2 w-full rounded py-1 px-3">
                                        <div class="flex items-center gap-3">
                                            <p class="text-1 font-semibold">
                                                {{ reply.author.fullname }}
                                            </p>
                                            <span class="text-4 text-xs">
                                                {{ timeAgo(reply.date) }}
                                            </span>
                                        </div>
                                        <p class="text-1 text-sm">
                                            {{ reply.content }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // TODO: router
    //

    // {
    //     path: '/articles',
    //     component: () => import('@/views/Blog/BlogList.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/articles/new',
    //     component: () => import('@/views/Blog/BlogNew.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/articles/:id',
    //     component: () => import('@/views/Blog/BlogShow.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/articles/admin',
    //     component: () => import('@/views/Blog/BlogAdmin.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    import { blogProfiles, articles } from '@/fake/blog'
    import { readingTime } from '@/utils/readingTime'
    import { timeAgo } from '@/utils/timeAgo'

    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'
    import MdRenderer from '@/components/Input/Editor/MdRenderer.vue'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'

    export default {
        components: {
            TipRelativeDate,
            MdRenderer,
            LabelTag,
        },
        props: {
            thumbnail: {
                type: String,
                default: 'https://picsum.photos/768/432',
            },
        },
        data() {
            return {
                article: undefined,
                profile: undefined,
                readingTime: undefined,
                tableContents: undefined,
                openComments: undefined,
            }
        },
        watch: { '$route': 'fetchArticle' },
        created() {
            this.fetchArticle()
        },
        methods: {
            timeAgo,
            fetchArticle() {
                const articleId = this.$route.params.id
                const article = articles[articleId] ?? null
                this.article = article
                this.profile = article === null ? null : blogProfiles[article.author.id]
                this.readingTime = article === null ? null : parseInt(readingTime(article.body) / 60)
            },
        },
    }
</script>
