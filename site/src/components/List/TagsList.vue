<template>
  <!-- TODO: Refactor component -->
  <div>
    <div
      ref="tagList"
      class="flex flex-wrap h-0 overflow-hidden invisible"
    >
      <div
        v-if="overflowing.length"
        class="text-blue-500 flex-shrink-0"
      >
        + {{ overflowing.length }} tags
      </div>
      <div
        v-if="tags.length === 0 || tags === undefined"
        class="text-1"
      >
        N/A
      </div>
      <template
        v-for="(tag,i) in tags"
        v-else
        :key="i"
      >
        <tag
          :ref="setTagRef"
          :name="tag.name ?? tag"
        />
      </template>
    </div>
    <div v-show="loaded">
      <!-- TODO: V-tooltip describing tags -->
      <div
        v-if="overflowing.length == tags.length"
        class="text-blue-500 flex-shrink-0"
      >
        + {{ overflowing.length }} tags
      </div>
      <div
        v-else
        class="flex flex-wrap h-7 overflow-hidden"
      >
        <template
          v-for="i in [...Array(last+1).keys()]"
          :key="i"
        >
          <tag
            :name="tags[i].name ?? tags[i]"
          />
        </template>
        <div
          v-if="overflowing.length"
          class="text-blue-500 flex-shrink-0"
        >
          + {{ overflowing.length }} tags
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
import debounce from 'lodash/debounce'
import { onBeforeUpdate, reactive, ref } from 'vue'
import Tag from '@/components/ColoredTag.vue'
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
        const loaded = ref(false)
        let tagRefs = reactive([])
        const setTagRef = el => {
            if (el) {
                tagRefs.push(el)
            }
        }
        onBeforeUpdate(() => {
            tagRefs = []
        })
        return { tagRefs, tagList, setTagRef, loaded }
    },
    data () {
        const overflow = debounce(() => {
            this.overflowing = []
            this.last = null
            const getTop = el => el?.getBoundingClientRect()?.top ?? 0
            const getRight = el => el?.getBoundingClientRect()?.right ?? 0
            const startHeight = getTop(this.tagList)
            const startRight = getRight(this.tagList)
            for (var i = 0; i < this.tagRefs.length; i++) {
                if (getTop(this.tagRefs[i].$el) > startHeight || getRight(this.tagRefs[i].$el) > startRight) {
                    this.overflowing.push(this.tagRefs[i].name)
                } else {
                    this.last = i
                }
            }
        }, 5)
        const tagsList$ = new ResizeObserver(overflow)
        return {
            overflowing: [],
            last: null,
            tagsList$,
            overflow,
        }
    },
    mounted () {
        this.tagsList$.observe(this.tagList)
        this.loaded = true
        this.overflow()
    },
    unmounted () {
        this.tagsList$.disconnect()
        delete this.tagsList$
    }
}
</script>
