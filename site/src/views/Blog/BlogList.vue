<template>
    <div class="flex justify-between py-6 my-8 mx-6 card-0">
        <div class="w-full lg:w-8/12">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold md:text-2xl text-0">Articles</h1>
                <SelectInput
                    v-model="rangeFilter"
                    button-name="Filtrer les Articles"
                    :choices="['Les plus récents', 'Cette semaine']"
                />
            </div>
            <div
                v-for="(article, i) in articles"
                :key="i"
                class="py-6 px-10 mx-auto mt-6 rounded-lg shadow-md card-2"
            >
                <div class="flex justify-between items-center">
                    <span class="font-light text-3">
                        {{ timeAgo(article.date, 'long').replace(/./, (c) => c.toUpperCase()) }}
                    </span>
                    <a :href="article.category.link" class="py-1 px-2 font-bold rounded text-0 bg-4">
                        {{ article.category.name }}
                    </a>
                </div>
                <div class="mt-2">
                    <a :href="article.link" class="text-2xl font-bold hover:underline text-0">
                        {{ article.title }}
                    </a>
                    <p class="mt-2 text-3">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam
                        aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus
                        delectus nihil quis facere in modi ratione libero!
                    </p>
                </div>
                <div class="flex justify-between items-center mt-4">
                    <a :href="article.link" class="text-blue-500 hover:underline">Lire l'article...</a>
                    <div>
                        <a :href="article.author.link" class="flex items-center">
                            <img
                                :src="article.author.avatar"
                                alt="avatar"
                                class="hidden object-cover mx-4 w-10 h-10 rounded-full sm:block"
                            />
                            <h1 class="font-bold hover:underline text-1">{{ article.author.username }}</h1>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="hidden -mx-8 w-4/12 lg:block">
            <div class="px-8">
                <h1 class="mb-4 text-xl font-bold text-0">Auteurs</h1>
                <div class="py-4 px-6 mx-auto max-w-sm rounded-lg shadow-md card-2">
                    <ul class="-ml-4">
                        <li v-for="(user, i) in users" :key="i" class="flex items-center">
                            <img
                                :src="user.avatar"
                                :alt="user.username"
                                class="object-cover mx-4 w-12 h-12 text-xl rounded-full"
                            />
                            <div class="flex flex-col w-full 2xl:flex-row 2xl:justify-between">
                                <a :href="user.link" class="font-bold hover:underline text-0">{{
                                    user.username
                                }}</a>
                                <div class="flex flex-col -mt-1 xl:flex-row xl:items-center">
                                    <span class="hidden mr-2 text-sm font-light xl:block text-3">a créé</span>
                                    <a
                                        :href="user.link"
                                        class="-mt-1 text-sm hover:underline xl:mt-0 xl:text-base text-0"
                                        >{{ user.nPosts }} Articles</a
                                    >
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="px-8 mt-10">
                <h1 class="mb-4 text-xl font-bold text-0">Categories</h1>
                <div class="flex flex-col py-6 px-4 mx-auto max-w-sm rounded-lg shadow-md card-2">
                    <ul>
                        <li v-for="(category, i) in categories" :key="i">
                            <a
                                :href="category.link"
                                class="mx-1 font-bold hover:underline text-0 hover:text-3"
                                >- {{ category.name }}</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
            <div class="px-8 mt-10">
                <h1 class="mb-4 text-xl font-bold text-1">Climat</h1>
                <WeatherWidget />
            </div>
        </div>
    </div>
</template>

<script>
import {
    articles, categories, 
} from '@/fake/blog'
import { users } from '@/fake/users'

import { timeAgo } from '@/utils/timeAgo'

import SelectInput from '@/components/Input/SelectInput.vue'
import WeatherWidget from '@/components/App/Widget/WidgetWeather.vue'

const nPostsUsers = [23, 63, 12, 41, 0]

export default {
    components: {
        WeatherWidget,
        SelectInput,
    },
    data() {
        return {
            rangeFilter: null,
            articles,
            categories,
            users: users.map((x, i) => ({
                ...x,
                nPosts: nPostsUsers[i],
            })),
        }
    },
    methods: { timeAgo },
}
</script>
