<template>
    <div
        v-if="article === null"
        class="w-full max-w-screen-md mx-auto my-5 card"
    >
        Cet article n'existe pas !
    </div>
    <div
        v-else
        class="flex flex-col gap-6 w-full max-w-screen-md mx-auto my-5"
    >
        <!-- ARTICLE -->
        <div class="card pb-8 flex flex-col gap-8">
            <!-- HEADER -->
            <div class="flex flex-col gap-4">
                <!-- THUMBNAIL -->
                <img
                    :src="thumbnail"
                    class="z-0 object-cover rounded-lg"
                >
                <div class="flex flex-col gap-1 mx-4">
                    <!-- TITLE -->
                    <div class="font-bold text-4xl text-0 text-justify">
                        {{ article.title }}
                    </div>

                    <span class="text-0 items-center flex text-base">
                        <div class="flex gap-2 items-end">
                            <div class="text-base text-2">par</div>
                            <a
                                class="text-xl link mr-12"
                                href="#author"
                            >{{ article.author.username }}</a>
                        </div>
                        <div class="flex gap-4 items-center">
                            <div class="items-center flex gap-1 text-1">
                                <i class="ri-chat-1-line ri-lg" />
                                <a
                                    class="hover:underline"
                                    href="#comments"
                                >
                                    3 comments</a>
                            </div>
                            <div class="items-center flex gap-1 text-base text-1">
                                <i class="ri-history-line ri-lg" />
                                <DatePreview :date-string="article.date" />
                            </div>
                            <div class="items-center flex gap-1 text-2">
                                <i class="ri-timer-flash-line ri-lg" />
                                <p>Lecture en {{ readingTime }} min</p>
                            </div>
                        </div>
                    </span>
                </div>

                <!-- TAGS -->
                <div
                    v-if="article.tags.length > 0"
                    class="items-center flex text-base"
                >
                    <div class="items-center flex gap-2 text-0 mr-4 text-lg">
                        <i class="ri-price-tag-3-line" />
                        <p class="text-base">
                            {{ article.tags.length }} Tags
                        </p>
                    </div>

                    <div class="flex space-x-1">
                        <span
                            v-for="tag in article.tags"
                            :key="tag.id"
                            class="text-base text-2"
                        >
                            <ColoredTag :tag-name="tag" />
                        </span>
                    </div>
                </div>
            </div>

            <!-- SHARE -->
            <div class="flex items-center mx-auto gap-3 text-0">
                <p class="underline text-xl">
                    Partage cet article
                </p>
                <i class="ri-share-forward-line ri-2xl" />
                <a class="flex items-center space-x-2 text-white bg-orange-600 rounded-md px-3 py-1 raised">
                    <i class="ri-reddit-fill ri-lg" />
                    <p>Reddit</p>
                </a>
                <a class="flex items-center space-x-2 text-white bg-slate-800 rounded-md px-3 py-1 raised">
                    <i class="ri-discord-fill ri-lg" />
                    <p>Discord</p>
                </a>
                <a class="flex items-center space-x-2 text-white bg-blue-900 rounded-md px-3 py-1 raised">
                    <i class="ri-facebook-box-fill ri-lg" />
                    <p>Facebook</p>
                </a>
                <a
                    class="flex items-center space-x-2 text-white bg-2 rounded-md px-3 py-1 raised"
                    style="background-color: #0E76A8;"
                >
                    <i class="ri-linkedin-box-fill ri-xl" />
                    <p>LinkedIn</p>
                </a>
            </div>

            <!-- TABLE OF CONTENTS -->
            <div class="px-8 py-4 text-5 bg-3 rounded mx-8">
                <div class="text-2xl text-3 font-bold">
                    Table des Matières
                </div>
                <ul
                    v-for="(title, i) in article.toc"
                    :key="i"
                    class="ml-3 text-3xl list-[square] list-inside"
                >
                    <li class="text-lg mt-1 text-1 font-bold">
                        <a :href="`#${title.href}`">{{ title.title }}</a>
                        <ul
                            v-if="title.subtitles?.length"
                            class="list-disc list-inside font-normal"
                        >
                            <li
                                v-for="(subtitle, j) in title.subtitles"
                                :key="j"
                                class="text-base ml-10"
                            >
                                <a
                                    :href="`#${subtitle.href}`"
                                    class="link text-2"
                                >{{ subtitle.title }}</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <!-- CONTENT -->
            <div class="flex flex-col gap-6 text-justify mx-3">
                <TipTapRenderer
                    ref="renderer"
                    :content="article.body"
                />
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
        <div
            class="card pt-2"
        >
            <span class="space-x-3 items-center flex border-b-1 p-2 gap-10">
                <div class="-mt-8">
                    <img
                        class="w-20 h-20 object-cover rounded-full border-2"
                        :src="article.author.avatar"
                    >
                </div>
                <div class="text-2xl text-1">
                    <p class="">
                        À propos de <a
                            href="#"
                            class="hover:underline font-bold"
                        >
                            {{ article.author.username }}
                        </a>
                    </p>
                </div>
            </span>
            <div>
                <p class="mt-2 text-5">
                    {{ profile.about }}
                </p>
                <div class="flex justify-end mt-4">
                    <a
                        :href="article.author.link"
                        class="text-sm text-0 font-bold hover:underline"
                    >Voir le profil de {{ article.author.username }}</a>
                </div>
            </div>
        </div>

        <!-- COMMENT SECTION -->
        <div
            class="card"
        >
            <div>
                <h1 class="mb-4 text-lg font-semibold text-gray-900 uppercase text-1">
                    {{ article.comments.length }} Commentaires
                </h1>

                <div
                    v-for="(comment, i) in article.comments"
                    :key="i"
                    class="flex mt-4 gap-2"
                >
                    <img
                        class="w-10 h-10 object-cover rounded-full border-2"
                        :src="comment.author.avatar"
                    >
                    <div class="flex flex-col  rounded-lg px-2 w-full">
                        <div class="flex items-center gap-3">
                            <p class="font-semibold text-1">
                                {{ comment.author.username }}
                            </p>
                            <span class="text-xs text-4">
                                {{ timeAgo(comment.date) }}
                            </span>
                        </div>
                        <p class="text-2 text-sm">
                            {{ comment.content }}
                        </p>
                        <div v-if="comment.replies.length > 0">
                            <Disclosure v-slot="{ open }">
                                <DisclosureButton>
                                    <div class="mt-3 flex items-center gap-1 font-bold text-sm text-3">
                                        <p class="uppercase">
                                            {{ comment.replies.length }} {{ comment.replies.length > 1 ? 'réponses' : 'réponse' }}
                                        </p>
                                        <i :class="open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line' " />
                                    </div>
                                </DisclosureButton>
                                <DisclosurePanel>
                                    <div class="mt-2 flex flex-col gap-2">
                                        <div
                                            v-for="(reply, j) in comment.replies"
                                            :key="j"
                                            class="flex gap-2"
                                        >
                                            <img
                                                class="w-10 h-10 object-cover rounded-full border-2"
                                                :src="reply.author.avatar"
                                            >
                                            <div class="px-3 py-1 w-full bg-2 rounded">
                                                <div class="flex items-center gap-3">
                                                    <p class="font-semibold text-1">
                                                        {{ reply.author.username }}
                                                    </p>
                                                    <span class="text-xs text-4">
                                                        {{ timeAgo(reply.date) }}
                                                    </span>
                                                </div>
                                                <p class="text-1 text-sm">
                                                    {{ reply.content }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </DisclosurePanel>
                            </Disclosure>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { blogProfiles, articles } from '@/fake/blog'
import DatePreview from '@/components/Dashboard/DatePreview.vue'
import { readingTimeMinutes } from '@/utils/readingTimeMinutes'
import TipTapRenderer from '@/components/TipTap/TipTapRenderer.vue'
import ColoredTag from '@/components/ColoredTag.vue'
import { timeAgo } from '@/utils/timeAgo'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { extractTextFromJSONBody } from '@/utils/extractTextFromHTML'

export default {
    components: {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
        DatePreview,
        TipTapRenderer,
        ColoredTag
    },
    props: {
        thumbnail: {
            type: String,
            default: "https://picsum.photos/768/432"
        }
    },
    data() {
        return {
            article: undefined,
            profile: undefined,
            readingTime: undefined,
            tableContents: undefined,
            openComments: undefined
        }
    },
    watch: {
        '$route': 'fetchArticle'
    },
    created () {
        this.fetchArticle()
    },
    methods: {
        timeAgo,
        fetchArticle() {
            const articleId = this.$route.params.id
            const article = articles[articleId] ?? null
            this.article = article
            this.profile = article === null ? null : blogProfiles[article.author.id]
            this.readingTime = article === null ? null : readingTimeMinutes(extractTextFromJSONBody(JSON.parse(article.body)))
        }
    }
}

</script>
