<template>
    <div class="card-0 my-8 mx-6 flex justify-between py-6">
        <div class="w-full lg:w-8/12">
            <div class="flex items-center justify-between">
                <h1 class="text-0 text-xl font-bold md:text-2xl">Articles</h1>
                <SelectInput
                    v-model="rangeFilter"
                    button-name="Filtrer les Articles"
                    :choices="['Les plus récents', 'Cette semaine']"
                />
            </div>
            <div
                v-for="(article, i) in articles"
                :key="i"
                class="card-2 mx-auto mt-6 rounded-lg py-6 px-10 shadow-md"
            >
                <div class="flex items-center justify-between">
                    <span class="text-3 font-light">
                        {{ timeAgo(article.date, 'long').replace(/./, (c) => c.toUpperCase()) }}
                    </span>
                    <a :href="article.category.link" class="text-0 bg-4 rounded py-1 px-2 font-bold">
                        {{ article.category.name }}
                    </a>
                </div>
                <div class="mt-2">
                    <a :href="article.link" class="text-0 text-2xl font-bold hover:underline">
                        {{ article.title }}
                    </a>
                    <p class="text-3 mt-2">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam
                        aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus
                        delectus nihil quis facere in modi ratione libero!
                    </p>
                </div>
                <div class="mt-4 flex items-center justify-between">
                    <a :href="article.link" class="text-blue-500 hover:underline">Lire l'article...</a>
                    <div>
                        <a :href="article.author.link" class="flex items-center">
                            <img
                                :src="article.author.avatar"
                                alt="avatar"
                                class="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
                            />
                            <h1 class="text-1 font-bold hover:underline">{{ article.author.fullname }}</h1>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="-mx-8 hidden w-4/12 lg:block">
            <div class="px-8">
                <h1 class="text-0 mb-4 text-xl font-bold">Auteurs</h1>
                <div class="card-2 mx-auto max-w-sm rounded-lg py-4 px-6 shadow-md">
                    <ul class="-ml-5">
                        <li v-for="(user, i) in users" :key="i" class="flex items-center">
                            <img
                                :src="user.avatar"
                                :alt="user.fullname"
                                class="mx-4 h-12 w-12 rounded-full object-cover text-xl"
                            />
                            <div class="flex w-full flex-col 2xl:flex-row 2xl:justify-between">
                                <a :href="user.link" class="text-0 font-bold hover:underline">{{
                                    user.fullname
                                }}</a>
                                <div class="-mt-1 flex flex-col xl:flex-row xl:items-center">
                                    <span class="text-3 mr-2 hidden text-sm font-light xl:block">a créé</span>
                                    <a
                                        :href="user.link"
                                        class="text-0 -mt-1 text-sm hover:underline xl:mt-0 xl:text-base"
                                        >{{ user.nPosts }} Articles</a
                                    >
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="mt-10 px-8">
                <h1 class="text-0 mb-4 text-xl font-bold">Categories</h1>
                <div class="card-2 mx-auto flex max-w-sm flex-col rounded-lg py-6 px-4 shadow-md">
                    <ul>
                        <li v-for="(category, i) in categories" :key="i">
                            <a
                                :href="category.link"
                                class="text-0 hover:text-3 mx-1 font-bold hover:underline"
                                >- {{ category.name }}</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
            <div class="mt-10 px-8">
                <h1 class="text-1 mb-4 text-xl font-bold">Climat</h1>
                <WeatherWidget />
            </div>
        </div>
    </div>
</template>

<script>
    import { articles, categories } from '@/fake/blog'
    import { users } from '@/fake/blog'

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
