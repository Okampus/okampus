<template>
  <div
    id="search-screen"
    class="flex flex-col fixed w-screen top-tbar left-0 h-content bg-transparent"
  >
    <div
      id="expander-filler"
      class="flex-shrink-0 flex-grow transition-all duration-500"
    />
    <div
      id="expander-content"
      class="h-0 relative flex-shrink lg:l-sbar flex-grow-0 transition-all duration-500"
    >
      <div class="text-2 flex flex-col w-full h-full shadow-lg z-50 rounded-t-lg bg-3">
        <div class="px-4 py-2 rounded-t-lg w-full">
          <div class="float-left w-1/3">
            Recherche: {{ $data.searchText }}
          </div>
          <div class="float-right w-5/12">
            <XIcon
              class="icon cursor-pointer"
              @click="collapseSearch"
            />
            <StarIcon class="icon cursor-pointer" />
            <DotsHorizontalIcon class="icon cursor-pointer" />
          </div>
          <div class="mx-auto text-center w-2/12">
            100 résultats !
          </div>
          <div class="clear-both" />
        </div>

        <div class="p-5 bg-1 mx-2 flex-grow mb-2 overflow-y-scroll h-full">
          <div
            v-for="category of categories"
            :key="category"
            class=""
          >
            <p class="text-3 uppercase text-xl mb-1">
              {{ category }}
            </p>

            <div class="flex">
              <div class="mr-2 border-2 rounded-md flex flex-col justify-center flex-shrink-0 h-48 w-8">
                <ChevronLeftIcon class="h-7 pt-px" />
              </div>

              <div
                class="previewer"
                @scroll="scrollHorizontal"
              >
                <div
                  v-for="i in 10"
                  :key="i"
                  class="preview"
                />
              </div>

              <div class="ml-2 border-2 rounded-md flex flex-col justify-center flex-shrink-0 h-48 w-8">
                <ChevronRightIcon class="h-7 pt-px" />
              </div>
            </div>

            <div class="w-80 flex justify-center items-center text-center border rounded-md mb-2 text-lg py-1">
              Tous les résultats
              <ChevronRightIcon class="inline-block h-7 pt-px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { getURL } from '@api/api.config'
import { XIcon, StarIcon, DotsHorizontalIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

function removeZIndex () {
  const searchScreen = document.getElementById('search-screen')
  searchScreen.classList.remove('z-10')
}

export default defineComponent({
  name: 'SearchQuery',
  components: {
    XIcon,
    StarIcon,
    DotsHorizontalIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  },
  props: {

  },
  data () {
    return {
      categories: [
        'Documents', 'Tickets', 'Pages, FAQ & Blog'
      ],
      searchText: '',
      searchVisible: false
    }
  },
  mounted () {
    const previewers = document.getElementsByClassName('previewer')
    for (const previewer of previewers) {
      previewer.addEventListener('wheel', function (e) {
        e.preventDefault()
        // console.log(e.deltaY)
        console.log(e.target)
        e.target.scrollLeft += e.deltaY
      })
    }
  },
  methods: {
    testKey (e) {
      console.log(e)
    },
    userInfo: () => fetch(getURL('oauth.discord.userInfo', 'full'), {
      method: 'GET',
      credentials: 'include'
    }).then(async res => console.log(await res.json())),
    collapseSearch () {
      this.$data.searchVisible = false
      const searchScreen = document.getElementById('search-screen')
      const content = document.getElementById('expander-content')
      const filler = document.getElementById('expander-filler')
      searchScreen.addEventListener('transitionend', removeZIndex, { once: true })
      content.classList.add('flex-shrink', 'flex-grow-0')
      content.classList.remove('flex-shrink-0', 'flex-grow')
      filler.classList.add('flex-grow', 'flex-shrink-0')
      filler.classList.remove('flex-shrink', 'flex-grow-0')
    },
    scrollHorizontal (e) {
      e.preventDefault()
      console.log(e)
    },
    updateQuery (e) {
      const searchScreen = document.getElementById('search-screen')
      const content = document.getElementById('expander-content')
      const filler = document.getElementById('expander-filler')
      this.$data.searchText = e

      if (e && !this.$data.searchVisible) {
        this.$data.searchVisible = true
        searchScreen.removeEventListener('transitionend', removeZIndex, { once: true })
        searchScreen.classList.add('z-10')
        filler.classList.add('flex-shrink', 'flex-grow-0')
        filler.classList.remove('flex-shrink-0', 'flex-grow')
        content.classList.add('flex-grow', 'flex-shrink-0')
        content.classList.remove('flex-shrink', 'flex-grow-0')
      } else if (!e && this.$data.searchVisible) {
        this.collapseSearch(searchScreen, content, filler)
      }
    },
    launchSearch (e) {
      if (this.$data.searchVisible) {
        // Redirect to search
      } else {
        this.updateQuery(e)
      }
    }
  }
})
</script>

<style scoped>
  .previewer {
    @apply whitespace-nowrap overflow-x-scroll;
  }

  .preview {
    @apply inline-block h-48 w-36 bg-white rounded-sm;
  }

  .preview + .preview {
    @apply ml-3;
  }
</style>
