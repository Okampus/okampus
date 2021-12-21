<template>
  <div>
    <img
      alt="Avatar"
      class="rounded-full h-8 w-8 mr-2 mt-1 bg-white"
      :src="contributor.img"
      :title="contributor.pseudo"
    >
  </div>
</template>

<script lang="js">

export default {
  props: {
    contributor: {
      type: Object,
      default: () => {
        return {
          img: '',
          pseudo: '<Pseudo>'
        }
      }
    }
  }
}
</script>
