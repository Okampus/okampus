<template>
  <teleport to="#global-modal">
    <div
      class="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12
        px-10 pt-12 pb-10 sm:px-10 sm:pt-6 sm:pb-4 mx-auto card
        centered-fixed z-50 bg-2"
      @click.stop="() => { }"
    >
      <div class="flex flex-col">
        <h2 class="text-center font-semibold text-3xl text-1">
          Connexion
        </h2>
        <form action="javascript:void(0);">
          <div class="space-y-3 mt-4">
            <div>
              <label
                for="username"
                class="block tracking-wider text-sm font-semibold text-gray-600 uppercase"
              >Identifiant</label>
              <input-with-icon
                v-model="user.username"
                name="username"
                icon="ri-shield-user-fill ri-xl"
                placeholder="Entrez votre identifiant..."
                :required="true"
              />
            </div>
            <div>
              <label
                for="password"
                class="block tracking-wider mt-2 text-sm font-semibold text-gray-600 uppercase"
              >Mot de passe</label>
              <input-with-icon
                v-model="user.password"
                name="password"
                icon="ri-key-2-fill ri-xl"
                type="password"
                placeholder="Entrez votre mot de passe..."
                :required="true"
              />
            </div>
          </div>
          <div class="flex flex-col mt-10 space-y-2 items-center justify-center">
            <button
              type="submit"
              class="w-full py-3 bg-gray-500 rounded-sm text-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-400 hover:shadow-none"
              @click="handleLogin"
            >
              CONNEXION HORIZON
            </button>
          </div>
        </form>

        <div class="mt-5 md:flex-none flex flex-col flex-wrap space-y-3 sm:mb-2 text-center text-0 underline text-xs">
          <!-- TODO: register & forgot-password (?) -->
          <a
            href="forgot-password"
          >
            Mot de passe oublié ?
          </a>

          <a
            href="register"
          >
            Création d'un compte
          </a>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="js">
import InputWithIcon from '@/components/Input/InputWithIcon.vue'
import User from '@/models/user'

export default {
  components: {
    InputWithIcon
  },
  data () {
    return {
      user: new User('', '', '')
    }
  },
  methods: {
    handleLogin () {
      this.loading = true

      if (this.user.username && this.user.password) {
        this.$store.dispatch('auth/login', this.user).then(
          (data) => {
            this.message = data.toString()
            this.emitter.emit('login')
          },
          error => {
            this.loading = false
            this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString()
          }
        )
      }
    }
  }
}
</script>

<style lang="scss">

.centered-fixed {
    position: fixed;
    top: 0;
    left: 0;
    transform: translate(calc(50vw - 50%), calc(50vh - 50%));
}

</style>
