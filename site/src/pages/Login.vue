<template>
  <form
    method="post"
    action="#"
  >
    <div class="w-2/6 border-1 bg-2 m-auto rounded-md text-1 p-2">
      <div class="text-2xl w-10/12 mx-auto">
        Se connecter
      </div>
      <div class="w-10/12 mx-auto flex mt-8 border-1">
        <UserIcon class="h-8 w-8 rounded-l-lg bg-purple-600" />
        <input
          id="pseudo"
          class="w-full bg-1 pl-1 rounded-r-lg"
          type="text"
          name="title"
          placeholder="Username"
        />
      </div>
      <div class="w-10/12 mx-auto flex mt-2 border-1">
        <KeyIcon class="h-8 w-8 bg-purple-600 rounded-l-lg" />
        <input
          id="password"
          class="w-full bg-1 pl-1 rounded-r-lg"
          type="password"
          name="title"
          placeholder="Password"
        />
      </div>
      <div class="w-10/12 m-auto flex mt-2">
        <input
          id="remember-me"
          class="my-auto"
          type="checkbox"
        />
        <div class="ml-2">
          Remember-me
        </div>
      </div>
      <div class="w-8/12 m-auto mt-2">
        <input
          class="
            bg-purple-600
            border-1
            rounded-md
            px-1
            text-xl
            mt-4
            w-full
            text-1
          "
          type="submit"
          value="Login"
        />
      </div>
      <div class="text-center">
        Vous n'avez pas de compte ?
        <a
          class="text-blue-500 underline"
          href="#"
        >Inscrivez-vous</a>
      </div>
      <div class="text-center">
        <a
          href="#"
          class="text-blue-500 underline"
        >Mot de passe oublié ?</a>
      </div>
      <!-- Forgot Password -->
      <!-- SignUp -->
    </div>
  </form>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { UserIcon, KeyIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'Login',
  components: {
    UserIcon, KeyIcon
  },
  props: {
  },
  methods: {
  }
})
</script>

<style scoped>
</style>
