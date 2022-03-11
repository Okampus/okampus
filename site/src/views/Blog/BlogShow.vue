<template>
    <div v-if="article === null" class="my-5 mx-auto w-full max-w-screen-md card">
        Cet article n'existe pas !
    </div>
    <div v-else class="flex flex-col gap-6 my-5 mx-auto w-full max-w-screen-md">
        <!-- ARTICLE -->
        <div class="flex flex-col gap-8 pb-8 card">
            <!-- HEADER -->
            <div class="flex flex-col gap-4">
                <!-- THUMBNAIL -->
                <img :src="thumbnail" class="object-cover z-0 rounded-lg" />
                <div class="flex flex-col gap-1 mx-4">
                    <!-- TITLE -->
                    <div class="text-4xl font-bold text-justify text-0">
                        {{ article.title }}
                    </div>

                    <span class="flex items-center text-base text-0">
                        <div class="flex gap-2 items-end">
                            <div class="text-base text-2">par</div>
                            <a class="mr-12 text-xl link" href="#author">{{ article.author.fullname }}</a>
                        </div>
                        <div class="flex gap-4 items-center">
                            <div class="flex gap-2 items-center text-1">
                                <i class="fas fa-comment" />
                                <a class="hover:underline" href="#comments"> 3 comments</a>
                            </div>
                            <div class="flex gap-2 items-center text-base text-1">
                                <i class="fas fa-hourglass" />
                                <DatePreview :date="article.date" />
                            </div>
                            <div class="flex gap-2 items-center text-2">
                                <i class="fas fa-stopwatch" />
                                <p>Lecture en {{ readingTime }} min</p>
                            </div>
                        </div>
                    </span>
                </div>

                <!-- TAGS -->
                <div v-if="article.tags.length > 0" class="flex items-center text-base">
                    <div class="flex gap-2 items-center mr-4 text-lg text-0">
                        <i class="fas fa-tags" />
                        <p class="text-base">{{ article.tags.length }} Tags</p>
                    </div>

                    <div class="flex gap-1">
                        <span v-for="tag in article.tags" :key="tag.id" class="text-base text-2">
                            <AppTag :tag-name="tag" />
                        </span>
                    </div>
                </div>
            </div>

            <!-- SHARE -->
            <div class="flex gap-3 items-center mx-auto text-0">
                <p class="text-xl underline">Partage cet article</p>
                <a class="flex gap-2 items-center py-1 px-3 text-white bg-orange-600 rounded-md raised">
                    <i class="fab fa-reddit" />
                    <p>Reddit</p>
                </a>
                <a class="flex gap-2 items-center py-1 px-3 text-white bg-slate-800 rounded-md raised">
                    <i class="fab fa-discord" />
                    <p>Discord</p>
                </a>
                <a class="flex gap-2 items-center py-1 px-3 text-white bg-blue-900 rounded-md raised">
                    <i class="fab fa-facebook" />
                    <p>Facebook</p>
                </a>
                <a
                    class="flex gap-2 items-center py-1 px-3 text-white rounded-md bg-2 raised"
                    style="background-color: #0e76a8"
                >
                    <i class="fab fa-linkedin" />
                    <p>LinkedIn</p>
                </a>
            </div>

            <!-- TABLE OF CONTENTS -->
            <div class="py-4 px-8 mx-8 rounded text-5 bg-3">
                <div class="text-2xl font-bold text-3">Table des Matières</div>
                <ul
                    v-for="(title, i) in article.toc"
                    :key="i"
                    class="ml-3 text-3xl list-[square] list-inside"
                >
                    <li class="mt-1 text-lg font-bold text-1">
                        <a :href="`#${title.href}`">{{ title.title }}</a>
                        <ul v-if="title.subtitles?.length" class="font-normal list-disc list-inside">
                            <li v-for="(subtitle, j) in title.subtitles" :key="j" class="ml-10 text-base">
                                <a :href="`#${subtitle.href}`" class="link text-2">{{ subtitle.title }}</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <!-- CONTENT -->
            <div class="flex flex-col gap-6 mx-3 text-justify">
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
        <div class="pt-2 card">
            <span class="flex gap-10 items-center p-2 space-x-3 border-b-1">
                <div class="-mt-8">
                    <img class="object-cover w-20 h-20 rounded-full border-2" :src="article.author.avatar" />
                </div>
                <div class="text-2xl text-1">
                    <p class="">
                        À propos de
                        <a href="#" class="font-bold hover:underline">
                            {{ article.author.fullname }}
                        </a>
                    </p>
                </div>
            </span>
            <div>
                <p class="mt-2 text-5">
                    {{ profile.about }}
                </p>
                <div class="flex justify-end mt-4">
                    <a :href="article.author.link" class="text-sm font-bold hover:underline text-0"
                        >Voir le profil de {{ article.author.fullname }}</a
                    >
                </div>
            </div>
        </div>

        <!-- COMMENT SECTION -->
        <div class="card">
            <div>
                <h1 class="mb-4 text-lg font-semibold text-gray-900 uppercase text-1">
                    {{ article.comments.length }} Commentaires
                </h1>

                <div v-for="(comment, i) in article.comments" :key="i" class="flex gap-2 mt-4">
                    <img class="object-cover w-10 h-10 rounded-full border-2" :src="comment.author.avatar" />
                    <div class="flex flex-col px-2 w-full rounded-lg">
                        <div class="flex gap-3 items-center">
                            <p class="font-semibold text-1">
                                {{ comment.author.fullname }}
                            </p>
                            <span class="text-xs text-4">
                                {{ timeAgo(comment.date) }}
                            </span>
                        </div>
                        <p class="text-sm text-2">
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

                            <div class="flex flex-col gap-2 mt-2">
                                <div v-for="(reply, j) in comment.replies" :key="j" class="flex gap-2">
                                    <img
                                        class="object-cover w-10 h-10 rounded-full border-2"
                                        :src="reply.author.avatar"
                                    />
                                    <div class="py-1 px-3 w-full rounded bg-2">
                                        <div class="flex gap-3 items-center">
                                            <p class="font-semibold text-1">
                                                {{ reply.author.fullname }}
                                            </p>
                                            <span class="text-xs text-4">
                                                {{ timeAgo(reply.date) }}
                                            </span>
                                        </div>
                                        <p class="text-sm text-1">
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
    import { blogProfiles, articles } from '@/fake/blog'
    import { readingTime } from '@/utils/readingTime'
    import { timeAgo } from '@/utils/timeAgo'

    import DatePreview from '@/components/App/Preview/DatePreview.vue'
    import MdRenderer from '@/components/App/Editor/MdRenderer.vue'
    import AppTag from '@/components/App/AppTag.vue'

    export default {
        components: {
            DatePreview,
            MdRenderer,
            AppTag,
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
