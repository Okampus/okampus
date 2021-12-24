<template>
  <!-- component -->
  <div class="overflow-x-hidden bg-2">
    <div class="px-6 py-8 bg-2">
      <div class="container flex justify-between mx-auto card">
        <div class="w-full lg:w-8/12">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-700 md:text-2xl text-1">
              Post
            </h1>
            <div>
              <select class=" text-3 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-2">
                <option>Latest</option>
                <option>Last Week</option>
              </select>
            </div>
          </div>
          <!--List-Post component-->
          <div class="mt-6">
            <div class="max-w-4xl px-10 py-6 mx-auto bg-2 rounded-lg shadow-md card">
              <div class="flex items-center justify-between">
                <span class="font-light text-5">Jun 1,
                  2020</span><a
                  href="#"
                  class="px-2 py-1 font-bold text-5 bg-5 rounded hover:bg-gray-500"
                >Laravel</a>
              </div>
              <div class="mt-2">
                <a
                  href="#"
                  class="text-2xl font-bold text-5 hover:underline"
                >Build
                  Your New Idea with Laravel Freamwork.</a>
                <p class="mt-2 text-6">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim
                  reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!
                </p>
              </div>
              <div class="flex items-center justify-between mt-4">
                <a
                  href="#"
                  class="text-blue-500 hover:underline"
                >Read more</a>
                <div>
                  <a
                    href="#"
                    class="flex items-center"
                  ><img
                     src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=731&amp;q=80"
                     alt="avatar"
                     class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                   >
                    <h1 class="font-bold text-3 hover:underline">Alex John</h1>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <div class="max-w-4xl px-10 py-6 mx-auto bg-2 rounded-lg shadow-md card">
              <div class="flex items-center justify-between">
                <span class="font-light text-5">mar 4,
                  2019</span><a
                  href="#"
                  class="px-2 py-1 font-bold text-5 bg-5 rounded hover:bg-gray-500"
                >Design</a>
              </div>
              <div class="mt-2">
                <a
                  href="#"
                  class="text-2xl font-bold text-5 hover:underline"
                >Accessibility tools for
                  designers and developers</a>
                <p class="mt-2 text-6">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim
                  reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!
                </p>
              </div>
              <div class="flex items-center justify-between mt-4">
                <a
                  href="#"
                  class="text-blue-500 hover:underline"
                >Read more</a>
                <div>
                  <a
                    href="#"
                    class="flex items-center"
                  ><img
                     src="https://images.unsplash.com/photo-1464863979621-258859e62245?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=333&amp;q=80"
                     alt="avatar"
                     class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                   >
                    <h1 class="font-bold text-3 hover:underline">Jane Doe</h1>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <div class="max-w-4xl px-10 py-6 mx-auto bg-2 rounded-lg shadow-md card">
              <div class="flex items-center justify-between">
                <span class="font-light text-5">Feb 14,
                  2019</span><a
                  href="#"
                  class="px-2 py-1 font-bold text-5 bg-5 rounded hover:bg-gray-500"
                >PHP</a>
              </div>
              <div class="mt-2">
                <a
                  href="#"
                  class="text-2xl font-bold text-5 hover:underline"
                >PHP:
                  Array to Map</a>
                <p class="mt-2 text-6">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim
                  reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!
                </p>
              </div>
              <div class="flex items-center justify-between mt-4">
                <a
                  href="#"
                  class="text-blue-500 hover:underline"
                >Read more</a>
                <div>
                  <a
                    href="#"
                    class="flex items-center"
                  ><img
                     src="https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=281&amp;q=80"
                     alt="avatar"
                     class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                   >
                    <h1 class="font-bold text-3 hover:underline">Lisa Way</h1>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <div class="max-w-4xl px-10 py-6 mx-auto bg-2 rounded-lg shadow-md card">
              <div class="flex items-center justify-between">
                <span class="font-light text-5">Dec 23,
                  2018</span><a
                  href="#"
                  class="px-2 py-1 font-bold text-5 bg-5 rounded hover:bg-gray-500"
                >Django</a>
              </div>
              <div class="mt-2">
                <a
                  href="#"
                  class="text-2xl font-bold text-5 hover:underline"
                >Django
                  Dashboard - Learn by Coding</a>
                <p class="mt-2 text-6">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim
                  reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!
                </p>
              </div>
              <div class="flex items-center justify-between mt-4">
                <a
                  href="#"
                  class="text-blue-500 hover:underline"
                >Read more</a>
                <div>
                  <a
                    href="#"
                    class="flex items-center"
                  ><img
                     src="https://images.unsplash.com/photo-1500757810556-5d600d9b737d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=735&amp;q=80"
                     alt="avatar"
                     class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                   >
                    <h1 class="font-bold text-3 hover:underline">Steve Matt</h1>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <div class="max-w-4xl px-10 py-6 mx-auto bg-2 rounded-lg shadow-md card">
              <div class="flex items-center justify-between">
                <span class="font-light text-5">Mar 10,
                  2018</span><a
                  href="#"
                  class="px-2 py-1 font-bold text-gray-100 bg-5 rounded hover:bg-gray-500"
                >Testing</a>
              </div>
              <div class="mt-2">
                <a
                  href="#"
                  class="text-2xl font-bold text-5 hover:underline"
                >TDD
                  Frist</a>
                <p class="mt-2 text-6">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim
                  reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!
                </p>
              </div>
              <div class="flex items-center justify-between mt-4">
                <a
                  href="#"
                  class="text-blue-500 hover:underline"
                >Read more</a>
                <div>
                  <a
                    href="#"
                    class="flex items-center"
                  ><img
                     src="https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=373&amp;q=80"
                     alt="avatar"
                     class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                   >
                    <h1 class="font-bold text-3 hover:underline">Khatab Wedaa</h1>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8">
            <div class="flex">
              <a
                href="#"
                class="px-3 py-2 mx-1 font-medium text-3 bg-3 rounded-md cursor-not-allowed"
              >
                previous
              </a>

              <a
                href="#"
                class="px-3 py-2 mx-1 font-medium text-3 bg-3 rounded-md hover:bg-blue-500 hover:text-white"
              >
                1
              </a>

              <a
                href="#"
                class="px-3 py-2 mx-1 font-medium text-3 bg-3 rounded-md hover:bg-blue-500 hover:text-white"
              >
                2
              </a>

              <a
                href="#"
                class="px-3 py-2 mx-1 font-medium text-3 bg-3 rounded-md hover:bg-blue-500 hover:text-white"
              >
                3
              </a>

              <a
                href="#"
                class="px-3 py-2 mx-1 font-medium text-3 bg-3 rounded-md hover:bg-blue-500 hover:text-white"
              >
                Next
              </a>
            </div>
          </div>
        </div>
        <div class="hidden w-4/12 -mx-8 lg:block">
          <div class="px-8">
            <h1 class="mb-4 text-xl font-bold text-1">
              Authors
            </h1>
            <div class="flex flex-col max-w-sm px-6 py-4 mx-auto rounded-lg shadow-md card">
              <ul class="-mx-4">
                <li class="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=731&amp;q=80"
                    alt="avatar"
                    class="object-cover w-10 h-10 mx-4 rounded-full"
                  >
                  <p>
                    <a
                      href="#"
                      class="mx-1 font-bold text-3 hover:underline"
                    >Alex John</a><span
                      class="text-sm font-light text-5"
                    >Created 23 Posts</span>
                  </p>
                </li>
                <li class="flex items-center mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1464863979621-258859e62245?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=333&amp;q=80"
                    alt="avatar"
                    class="object-cover w-10 h-10 mx-4 rounded-full"
                  >
                  <p>
                    <a
                      href="#"
                      class="mx-1 font-bold text-3 hover:underline"
                    >Jane Doe</a><span
                      class="text-sm font-light text-5"
                    >Created 52 Posts</span>
                  </p>
                </li>
                <li class="flex items-center mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=281&amp;q=80"
                    alt="avatar"
                    class="object-cover w-10 h-10 mx-4 rounded-full"
                  >
                  <p>
                    <a
                      href="#"
                      class="mx-1 font-bold text-3 hover:underline"
                    >Lisa Way</a><span
                      class="text-sm font-light text-5"
                    >Created 73 Posts</span>
                  </p>
                </li>
                <li class="flex items-center mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1500757810556-5d600d9b737d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=735&amp;q=80"
                    alt="avatar"
                    class="object-cover w-10 h-10 mx-4 rounded-full"
                  >
                  <p>
                    <a
                      href="#"
                      class="mx-1 font-bold text-3 hover:underline"
                    >Steve Matt</a><span
                      class="text-sm font-light text-5"
                    >Created 245 Posts</span>
                  </p>
                </li>
                <li class="flex items-center mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=373&amp;q=80"
                    alt="avatar"
                    class="object-cover w-10 h-10 mx-4 rounded-full"
                  >
                  <p>
                    <a
                      href="#"
                      class="mx-1 font-bold text-3 hover:underline"
                    >Khatab
                      Wedaa</a><span class="text-sm font-light text-5">Created 332 Posts</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="px-8 mt-10">
            <h1 class="mb-4 text-xl font-bold text-1">
              Categories
            </h1>
            <div class="flex flex-col max-w-sm px-4 py-6 mx-auto rounded-lg shadow-md card">
              <ul>
                <li>
                  <a
                    href="#"
                    class="mx-1 font-bold text-3 hover:text-3 hover:underline"
                  >-
                    AWS</a>
                </li>
                <li class="mt-2">
                  <a
                    href="#"
                    class="mx-1 font-bold text-3 hover:text-3 hover:underline"
                  >-
                    Laravel</a>
                </li>
                <li class="mt-2">
                  <a
                    href="#"
                    class="mx-1 font-bold text-3 hover:text-3 hover:underline"
                  >- Vue</a>
                </li>
                <li class="mt-2">
                  <a
                    href="#"
                    class="mx-1 font-bold text-3 hover:text-3 hover:underline"
                  >-
                    Design</a>
                </li>
                <li class="flex items-center mt-2">
                  <a
                    href="#"
                    class="mx-1 font-bold text-3 hover:text-3 hover:underline"
                  >-
                    Django</a>
                </li>
                <li class="flex items-center mt-2">
                  <a
                    href="#"
                    class="mx-1 font-bold text-3 hover:text-3 hover:underline"
                  >- PHP</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Weather Widget component start -->
          <weather-widget
            :char-count="true"
            :buttons="editorButtons"
          />
          <!--End weather widget -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import WeatherWidget from '@/components/WeatherWidget.vue'
export default {
    name: 'BlogList',
    components: { WeatherWidget }
}
</script>
<style lang="">

</style>
