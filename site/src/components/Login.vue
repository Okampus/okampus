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

        <div class="space-y-3 mt-4">
          <div>
            <label
              for="email"
              class="block tracking-wider text-sm font-semibold text-gray-600 uppercase"
            >E-mail</label>
            <input-with-icon
              v-model="user.username"
              name="email"
              :icon="userIcon"
            />
          </div>
          <div>
            <label
              for="password"
              class="block tracking-wider mt-2 text-sm font-semibold text-gray-600 uppercase"
            >Password</label>
            <input-with-icon
              v-model="user.password"
              name="password"
              :icon="passwordIcon"
              type="password"
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

        <div class="mt-5 text-0">
          <div class="md:flex-none flex flex-col flex-wrap space-y-3 sm:mb-2 text-sm text-center">
            <a
              href="forgot-password"
              class="flex-2 underline text-xs"
            >
              Mot de passe oublié ?
            </a>

            <a
              href="register"
              class="flex-2 underline text-xs"
            >
              Création d'un compte
            </a>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import InputWithIcon from '@/components/Input/InputWithIcon.vue'
import User from '@/models/user'
// import { useForm, useField } from 'vee-validate'

export default defineComponent({
  name: 'Login',
  components: {
    InputWithIcon
  },
  setup () {
    // Define a validation schema
    // const loginSchema = {
    //   email (value) {
    //     if (email) {
    //       return 'OK'
    //     } else {
    //       return 'Error.'
    //     }
    //   },
    //   password (value) {
    //     if (password) {
    //       return 'OK'
    //     } else {
    //       return 'Error.'
    //     }
    //   }
    // }

    // // Create a form context with the validation schema
    // useForm({
    //   validationSchema: loginSchema
    // })

    // // No need to define rules for fields
    // const { value: email, errorMessage: emailError } = useField('field')
    // const { value: password, errorMessage: passwordError } = useField('field')

    // return {
    //   email,
    //   emailError,
    //   password,
    //   passwordError
    // }
  },
  data () {
    return {
      userIcon: "<i class='ri-shield-user-fill ri-xl'></i>",
      passwordIcon: "<i class='ri-key-2-fill ri-xl'></i>",
      user: new User('', '', '')
    }
  },
  methods: {
    handleLogin () {
      this.loading = true

      //   this.$validator.validateAll().then(isValid => {
      //     if (!isValid) {
      //       this.loading = false
      //       return
      //     }

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
})
</script>

<style lang="scss">
@import "~@/assets/scss/components/card.scss";

.centered-fixed {
  position: fixed;
  top: 0;
  left: 0;
  transform: translate(calc(50vw - 50%), calc(50vh - 50%));
}

</style>
