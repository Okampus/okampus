<template>
    <div class="flex justify-between card-0 my-8 mx-6 py-6">
        <div class="w-full lg:w-8/12">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-bold  md:text-2xl text-0">
                    Articles
                </h1>
                <select-input
                    v-model="rangeFilter"
                    button-name="Filtrer les Articles"
                    :choices="['Les plus récents', 'Cette semaine']"
                />
            </div>
            <div
                v-for="(article, i) in articles"
                :key="i"
                class="mt-6 px-10 py-6 mx-auto rounded-lg shadow-md card-2"
            >
                <div class="flex items-center justify-between">
                    <span class="font-light text-3">
                        {{ timeAgo(article.date, 'long').replace(/./, c => c.toUpperCase()) }}
                    </span>
                    <a
                        :href="article.category.link"
                        class="px-2 py-1 font-bold text-0 bg-4 rounded"
                    > {{ article.category.name }} </a>
                </div>
                <div class="mt-2">
                    <a
                        :href="article.link"
                        class="text-2xl font-bold text-0 hover:underline"
                    > {{ article.title }} </a>
                    <p class="mt-2 text-3">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim
                        reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!
                    </p>
                </div>
                <div class="flex items-center justify-between mt-4">
                    <a
                        :href="article.link"
                        class="text-blue-500 hover:underline"
                    >Lire l'article...</a>
                    <div>
                        <a
                            :href="article.author.link"
                            class="flex items-center"
                        >
                            <img
                                :src="article.author.avatar"
                                alt="avatar"
                                class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                            >
                            <h1 class="font-bold text-1 hover:underline">{{ article.author.username }}</h1>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="hidden w-4/12 -mx-8 lg:block">
            <div class="px-8">
                <h1 class="mb-4 text-xl font-bold text-0">
                    Auteurs
                </h1>
                <div class="max-w-sm px-6 py-4 mx-auto rounded-lg shadow-md card-2">
                    <ul class="-ml-4">
                        <li
                            v-for="(user, i) in users"
                            :key="i"
                            class="flex items-center"
                        >
                            <img
                                :src="user.avatar"
                                :alt="user.username"
                                class="text-xl object-cover w-12 h-12 mx-4 rounded-full"
                            >
                            <div class="flex flex-col 2xl:flex-row 2xl:justify-between w-full">
                                <a
                                    :href="user.link"
                                    class="font-bold text-0 hover:underline"
                                >{{ user.username }}</a>
                                <div class="flex flex-col xl:flex-row xl:items-center -mt-1">
                                    <span
                                        class="text-sm font-light text-3 mr-2 hidden xl:block"
                                    >a créé</span>
                                    <a
                                        :href="user.link"
                                        class="text-sm -mt-1 xl:text-base text-0 hover:underline xl:mt-0"
                                    >{{ user.nPosts }} Articles</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="px-8 mt-10">
                <h1 class="mb-4 text-xl font-bold text-0">
                    Categories
                </h1>
                <div class="flex flex-col max-w-sm px-4 py-6 mx-auto rounded-lg shadow-md card-2">
                    <ul>
                        <li
                            v-for="(category, i) in categories"
                            :key="i"
                        >
                            <a
                                :href="category.link"
                                class="mx-1 font-bold text-0 hover:text-3 hover:underline"
                            >- {{ category.name }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="px-8 mt-10">
                <h1 class="mb-4 text-xl font-bold text-1">
                    Climat
                </h1>
                <weather-widget />
            </div>
        </div>
    </div>
</template>

<script>
import WeatherWidget from '@/components/Widget/WeatherWidget.vue'
import { articles, categories } from '@/fake/blog'
import { users } from '@/fake/users'

import { timeAgo } from '@/utils/timeAgo'
import SelectInput from '@/components/Input/SelectInput.vue'

const nPostsUsers = [23, 63, 12, 41, 0]

export default {
    components: { WeatherWidget, SelectInput },
    data() {
        return {
            rangeFilter: null,
            articles,
            categories,
            users: users.map((x, i) => { return {...x, nPosts: nPostsUsers[i]} })
        }
    },
    methods: {
        timeAgo
    }
}
</script>
