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
        :name="tag.name"
        :color="'red-500'"
      />
    </div>
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
import { defineComponent, onBeforeUpdate, reactive, ref } from 'vue'
import Tag from '@/components/Tag.vue'

export default defineComponent({
  name: 'TagsList',
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
      const startHeight = this.getTop(this.tagList)
      for (var i = 0; i < this.tagRefs.length; i++) {
        if (startHeight < this.getTop(this.tagRefs[i].$el)) {
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
  },
  methods: {
    getTop (el) {
      return el?.getBoundingClientRect()?.top ?? 0
    }
  }
})
</script>

<style>
</style>
