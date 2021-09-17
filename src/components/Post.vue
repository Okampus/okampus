<template>
  <div class="text-1 border-1 bg-1 rounded-md">
    <div class="px-4 pt-4 text-3xl font-bold text-center">
      #192 - {{ title }}
    </div>
    <div class="flex pb-4 pr-4 mt-1">
      <div class="flex flex-col w-1/12 items-center">
        <ChevronUpIcon class="h-10 w-10 mt-4" />
        <div class="text-center">
          150
        </div>
        <ChevronDownIcon class="h-10 w-10" />
        <StarIcon class="h-7 w-7 mt-4" />
        <BellIcon class="h-7 w-7 mt-4" />
        <FlagIcon class="h-7 w-7 mt-4" />
        <!-- <PencilAltIcon class="h-7 w-7 mt-4" />
        <ArchiveIcon class="h-7 w-7 mt-4" /> -->
      </div>
      <div class="w-11/12">
        <PencilAltIcon class="ml-3 inline-block h-7 w-7" />
        <ArchiveIcon class="ml-3 inline-block h-7 w-7" />
        <div class="p-1 mt-2 text-2 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nihil
          reprehenderit esse aperiam odit dignissimos, praesentium quia
          blanditiis autem atque molestias officiis deleniti magnam libero a?
          Optio recusandae totam soluta! Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Impedit optio, praesentium obcaecati facere quasi
          sapiente omnis fugiat reprehenderit ut quis earum fugit repudiandae
          cum dignissimos, ex quaerat iusto voluptatibus animi? Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Aut nihil reprehenderit
          esse aperiam odit dignissimos, praesentium quia blanditiis autem atque
          molestias officiis deleniti magnam libero a? Optio recusandae totam
          soluta! Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Impedit optio, praesentium obcaecati facere quasi sapiente omnis
          fugiat reprehenderit ut quis earum fugit repudiandae cum dignissimos,
          ex quaerat iusto voluptatibus animi? Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Aut nihil reprehenderit esse aperiam
          odit dignissimos, praesentium quia blanditiis autem atque molestias
          officiis deleniti magnam libero a? Optio recusandae totam soluta!
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit
          optio, praesentium obcaecati facere quasi sapiente omnis fugiat
          reprehenderit ut quis earum fugit repudiandae cum dignissimos, ex
          quaerat iusto voluptatibus animi? Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Aut nihil reprehenderit esse aperiam
          odit dignissimos, praesentium quia blanditiis autem atque molestias
          officiis deleniti magnam libero a? Optio recusandae totam soluta!
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit
          optio, praesentium obcaecati facere quasi sapiente omnis fugiat
          reprehenderit ut quis earum fugit repudiandae cum dignissimos, ex
          quaerat iusto voluptatibus animi?
        </div>
      </div>
    </div>
    <div class="flex bg-2 border-t rounded-b-md">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
        alt="Profile Picture"
        class="bg-white w-24 h-24"
      />
      <div class="relative ml-3">
        <div>
          <div class="inline-block text-lg font-medium">
            Pseudo
          </div>
          <div class="inline-block ml-3 text-sm">
            Rôle
          </div>
        </div>
        <div>dfs</div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { ChevronDownIcon, ChevronUpIcon, BellIcon, StarIcon, FlagIcon, PencilAltIcon, ArchiveIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'Message',
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
    BellIcon,
    StarIcon,
    FlagIcon,
    PencilAltIcon,
    ArchiveIcon
  },
  props: {
    title: {
      type: String
    }
  }
})
</script>

<style scoped>
</style>
