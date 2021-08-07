<template>
    <a v-bind:href="authURL" class="button">Login With Discord</a>
    <a v-bind:href="userInfoURL" class="button">Info</a>
    <div class="box2 bg-4-important box">
        <div class="box box3">
            <div class="columns">
                <h2 class="DocTitle">Documents</h2>
                <span class="icon">
                    <font-awesome-icon icon="sort-down" />
                </span>
            </div>
            <div class="columns is-multiline is-mobile">
                <div class="containerCol"  v-for="i of [...Array(parseInt(nbcol)).keys()]" v-bind:key="i">
                    <p class="column text-1">Element</p>
                </div>
            </div>
        </div>
        <div class="box box3">
            <div class="columns">
                <h2 class="DocTitle">Articles</h2>
                <span class="icon">
                    <font-awesome-icon icon="sort-down" />
                </span>
            </div>
            <div class="columns is-multiline is-mobile">
                <div class="containerCol"  v-for="i of [...Array(parseInt(nbcol)).keys()]" v-bind:key="i">
                    <p class="column text-1">Element</p>
                </div>
            </div>
        </div>
        <div class="box box3">
            <div class="columns">
                <h2 class="DocTitle">Pages</h2>
                <span class="icon">
                    <font-awesome-icon icon="sort-down" />
                </span>
            </div>
            <div class="columns is-multiline is-mobile">
                <div class="containerCol"  v-for="i of [...Array(parseInt(nbcol)).keys()]" v-bind:key="i">
                    <p class="column text-1">Element</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { getURL } from '@api/routes.config'

export default defineComponent({
  name: 'SearchQuery',
  props: {

  },
  methods: {
  },

  data () {
    return {
      authURL: getURL('oauth.discord.tokenIssuing', 'full'),
      userInfoURL: getURL('oauth.discord.userInfo', 'full'),
      nbcol: 5
    }
  }
})
</script>

<style scoped>

    .DocTitle{
        margin-bottom: 2%;
    }

    .box{
        box-shadow: none;
    }

    .box2{
        width: 100%;
        border-radius: 0;
    }

    .box3{
        margin-left: 2%;
        margin-right: 2%;
        margin-top: 1%;
        scroll-margin-bottom: 5%;
        border: 1px solid lightgray;
    }

    .column{
        width: 100px;
        max-width: 100px;
        height: 150px;
        max-height: 150px;
        background-color: var(--bg-2);
        border-radius: 10px;
    }

    .containerCol{
        padding: 1%;
        margin-right: auto;
        margin-left: auto;
    }

</style>
