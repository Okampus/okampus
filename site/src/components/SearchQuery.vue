<template>
  <div
    id="search-screen"
    class="
      flex flex-col
      fixed
      w-screen
      top-tbar
      left-0
      h-content
      bg-transparent
    "
  >
    <div
      id="expander-filler"
      class="flex-shrink-0 flex-grow tr-flex"
    />
    <div
      id="expander-content"
      class="h-0 relative flex-shrink lg:after-sidebar flex-grow-0 tr-flex"
    >
      <div
        class="
          text-2
          flex flex-col
          w-full
          h-full
          shadow-lg
          z-50
          rounded-t-lg
          bg-3
        "
      >
        <div class="px-4 py-2 rounded-t-lg w-full">
          <div class="float-left w-1/3">
            Recherche: {{ $data.searchText }}
          </div>
          <div class="float-right w-5/12">
            <i
              class="ri-close-line icon cursor-pointer"
              @click="collapseSearch"
            />
            <i class="ri-star-line icon cursor-pointer" />
            <i class="ri-star-line icon cursor-pointer" />
            <i class="ri-more-2-fill icon cursor-pointer" />
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
            <p class="text-2 uppercase text-xl mb-1">
              {{ category }}
            </p>

            <div class="flex">
              <div
                class="
                  button
                  bc-2
                  mr-2
                  border-2
                  rounded-md
                  flex flex-col
                  justify-center
                  flex-shrink-0
                  h-48
                  w-8
                  opacity-0
                  tr-opacity
                "
                @click="scrollPreview($event, -1)"
              >
                <i class="ri-arrow-left-s-line pt-px" />
              </div>

              <div
                class="previewer p-3 pb-0 pr-0 mb-2 rounded-lg"
                @wheel="scrollHorizontal($event)"
                @scroll="checkScrollersAfterScroll($event.currentTarget)"
              >
                <div
                  v-for="i in 10"
                  :key="i"
                  class="preview"
                />
              </div>

              <div
                class="
                  button
                  bc-2
                  ml-2
                  border-2
                  rounded-md
                  flex flex-col
                  justify-center
                  flex-shrink-0
                  h-48
                  w-8
                  opacity-0
                  tr-opacity
                "
                @click="scrollPreview($event, 1)"
              >
                <i class="ri-arrow-right-s-line pt-px" />
              </div>
            </div>

            <div
              class="
                button
                bc-2
                w-80
                flex
                justify-center
                items-center
                text-center
                border-2
                rounded-md
                mb-2
                text-lg
                py-1
              "
            >
              Tous les résultats
              <i class="ri-arrow-right-s-line pt-px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
function removeZIndex () {
  const searchScreen = document.getElementById('search-screen')
  searchScreen.classList.remove('z-10')
}

export default {
  data () {
    return {
      categories: [
        'Posts', 'Documents'
      ],
      searchText: '',
      searchVisible: false
    }
  },
  methods: {
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
    scrollPreview (e, factor) {
      const previewer = e.currentTarget.parentNode.children[1]
      previewer.scrollLeft += 300 * factor
      this.checkScrollersAfterScroll(previewer)
    },
    checkResize () {
      document.querySelectorAll('.previewer').forEach((el) => {
        this.checkScrollersAfterScroll(el)
      })
    },
    checkScrollersAfterScroll (previewer) {
      const chevronLeft = previewer.parentNode.firstChild
      const chevronRight = previewer.parentNode.lastChild
      if (previewer.scrollLeft > 0 && chevronLeft.classList.contains('opacity-0')) {
        chevronLeft.classList.remove('opacity-0')
        chevronLeft.classList.add('opacity-1')
        chevronLeft.classList.remove('cursor-default')
      } else if (previewer.scrollLeft <= 0 && chevronLeft.classList.contains('opacity-1')) {
        chevronLeft.classList.remove('opacity-1')
        chevronLeft.classList.add('opacity-0')
        chevronLeft.classList.add('cursor-default')
      }

      if (previewer.scrollLeft >= (previewer.scrollWidth - previewer.clientWidth) && chevronRight.classList.contains('opacity-1')) {
        chevronRight.classList.remove('opacity-1')
        chevronRight.classList.add('opacity-0')
        chevronRight.classList.add('cursor-default')
      } else if (previewer.scrollLeft < (previewer.scrollWidth - previewer.clientWidth) && chevronRight.classList.contains('opacity-0')) {
        chevronRight.classList.remove('opacity-0')
        chevronRight.classList.add('opacity-1')
        chevronRight.classList.remove('cursor-default')
      }
    },
    scrollHorizontal (e) {
      e.preventDefault()
      const previewer = e.currentTarget
      previewer.scrollLeft += e.deltaY * 2
      this.checkScrollersAfterScroll(previewer)
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
}
</script>

<style scoped>

.tr-flex {
  transition: color 300ms, background-color 300ms linear, border-color 300ms,
    fill 300ms, stroke 300ms, flex-grow 500ms, flex-shrink 500ms;
}

.tr-opacity {
  transition: color 300ms, background-color 300ms linear, border-color 300ms,
    fill 300ms, stroke 300ms, opacity 400ms;
}

.previewer {
  @apply whitespace-nowrap overflow-x-scroll;
  scroll-behavior: smooth;
}

.previewer > *:last-child {
  @apply mr-3;
}

.preview {
  @apply inline-block h-48 w-36 bg-white rounded-sm;
}

.preview + .preview {
  @apply ml-3;
}

</style>
