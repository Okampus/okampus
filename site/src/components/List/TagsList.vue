<template>
  <div>
    <div
      ref="tagList"
      class="flex flex-wrap h-7 overflow-hidden"
    >
      <div
        v-if="tags.length === 0 || tags === undefined"
        class="text-1"
      >
        N/A
      </div>
      <tag
        v-for="(tag,i) in tags"
        v-else
        :ref="setTagRef"
        :key="i"
        :name="tag.name ?? tag"
        :color="'red-500'"
      />
    </div>
    <!-- TODO: Link & tooltip preview -->
    <div
      v-if="overflowing.length"
      class="ml-3 text-blue-500"
    >
      + {{ overflowing.length }} tags
    </div>
  </div>
</template>

<script lang="js">
import debounce from 'lodash/debounce'
import { onBeforeUpdate, reactive, ref } from 'vue'
import Tag from '@/components/Tag.vue'

export default {
  components: {
    Tag
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const tagList = ref(null)
    let tagRefs = reactive([])
    const setTagRef = el => {
      if (el) {
        tagRefs.push(el)
      }
    }

    onBeforeUpdate(() => {
      tagRefs = []
    })

    return { tagRefs, tagList, setTagRef }
  },
  data () {
    const overflow = debounce(() => {
      this.overflowing = []
      const getTop = el => el?.getBoundingClientRect()?.top ?? 0
      const startHeight = getTop(this.tagList)
      for (var i = 0; i < this.tagRefs.length; i++) {
        if (startHeight < getTop(this.tagRefs[i].$el)) {
          this.overflowing.push(this.tagRefs[i].name)
        }
      }
    }, 30)

    const tagsList$ = new ResizeObserver(overflow)

    return {
      overflowing: [],
      tagsList$,
      overflow
    }
  },
  mounted () {
    this.tagsList$.observe(this.tagList)
    this.overflow()
  },
  unmounted () {
    this.tagsList$.disconnect()
  }
}
</script>
