<template>
  <div class="flex text-1">
    <div class="w-1/12 bg-1 border-2 border-red-500">
      <ToolbarAdmin />
    </div>
    <div class="w-3/12 bg-1 border-2 border-red-500">
      <div class="w-full max-w-screen-xl mx-auto px-6">
        <div class="flex justify-center p-4 px-3 py-10">
          <div class="w-full max-w-md">
            <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
              <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
                Filtres
              </div>
              <div class="flex items-center bg-gray-200 rounded-md">
                <div class="pl-2">
                  <svg
                    class="fill-current text-gray-500 w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      class="heroicon-ui"
                      d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  class="
                    w-full
                    rounded-md
                    bg-gray-200
                    text-gray-700
                    leading-tight
                    focus:outline-none
                    py-2
                    px-2
                  "
                  type="text"
                  placeholder="Search teams or members"
                >
              </div>
              <div class="py-3 text-sm">
                <div
                  class="
                    flex
                    justify-start
                    cursor-pointer
                    text-gray-700
                    hover:text-blue-400 hover:bg-blue-100
                    rounded-md
                    px-2
                    py-2
                    my-2
                  "
                >
                  <span class="bg-gray-400 h-2 w-2 m-2 rounded-full" />
                  <div class="flex-grow font-medium px-2">
                    Tous les messages
                  </div>
                </div>
                <div
                  class="
                    flex
                    justify-start
                    cursor-pointer
                    text-gray-700
                    hover:text-blue-400 hover:bg-blue-100
                    rounded-md
                    px-2
                    py-2
                    my-2
                  "
                >
                  <span class="bg-gray-400 h-2 w-2 m-2 rounded-full" />
                  <div class="flex-grow font-medium px-2">
                    Assignés à moi
                  </div>
                </div>
                <div
                  class="
                    flex
                    justify-start
                    cursor-pointer
                    text-gray-700
                    hover:text-blue-400 hover:bg-blue-100
                    rounded-md
                    px-2
                    py-2
                    my-2
                  "
                >
                  <span class="bg-gray-400 h-2 w-2 m-2 rounded-full" />
                  <div class="flex-grow font-medium px-2">
                    Mon département
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-9/12 bg-1 border-2 border-red-500">
      <body class="antialiased font-sans bg-gray-200">
        <div class="container mx-auto px-4 sm:px-8">
          <div class="py-8">
            <div>
              <h2 class="text-2xl font-semibold leading-tight">
                Tickets
              </h2>
            </div>
            <div class="my-2 flex sm:flex-row flex-col">
              <div class="flex flex-row mb-1 sm:mb-0">
                <div class="relative">
                  <select
                    class="
                      appearance-none
                      h-full
                      rounded-l
                      border
                      block
                      appearance-none
                      w-full
                      bg-white
                      border-gray-400
                      text-gray-700
                      py-2
                      px-4
                      pr-8
                      leading-tight
                      focus:outline-none focus:bg-white focus:border-gray-500
                    "
                  >
                    <option>5</option>
                    <option>10</option>
                    <option>20</option>
                  </select>
                  <div
                    class="
                      pointer-events-none
                      absolute
                      inset-y-0
                      right-0
                      flex
                      items-center
                      px-2
                      text-gray-700
                    "
                  >
                    <svg
                      class="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="relative">
                  <select
                    class="
                      appearance-none
                      h-full
                      rounded-r
                      border-t
                      sm:rounded-r-none sm:border-r-0
                      border-r border-b
                      block
                      appearance-none
                      w-full
                      bg-white
                      border-gray-400
                      text-gray-700
                      py-2
                      px-4
                      pr-8
                      leading-tight
                      focus:outline-none
                      focus:border-l
                      focus:border-r
                      focus:bg-white
                      focus:border-gray-500
                    "
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <div
                    class="
                      pointer-events-none
                      absolute
                      inset-y-0
                      right-0
                      flex
                      items-center
                      px-2
                      text-gray-700
                    "
                  >
                    <svg
                      class="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="relative">
                  <select
                    class="
                      appearance-none
                      h-full
                      rounded-l
                      border
                      block
                      appearance-none
                      w-full
                      bg-white
                      border-gray-400
                      text-gray-700
                      py-2
                      px-4
                      pr-8
                      leading-tight
                      focus:outline-none focus:bg-white focus:border-gray-500
                    "
                  >
                    <option>Depuis toujours</option>
                    <option>Aujourd'hui</option>
                    <option>Cette semaine</option>
                    <option>Ce mois</option>
                  </select>
                  <div
                    class="
                      pointer-events-none
                      absolute
                      inset-y-0
                      right-0
                      flex
                      items-center
                      px-2
                      text-gray-700
                    "
                  >
                    <svg
                      class="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="block relative">
                <span
                  class="
                    h-full
                    absolute
                    inset-y-0
                    left-0
                    flex
                    items-center
                    pl-2
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-4 w-4 fill-current text-gray-500"
                  >
                    <path
                      d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                    />
                  </svg>
                </span>
                <input
                  placeholder="Search"
                  class="
                    appearance-none
                    rounded-r rounded-l
                    sm:rounded-l-none
                    border border-gray-400 border-b
                    block
                    pl-8
                    pr-6
                    py-2
                    w-full
                    bg-white
                    text-sm
                    placeholder-gray-400
                    text-gray-700
                    focus:bg-white
                    focus:placeholder-gray-600
                    focus:text-gray-700
                    focus:outline-none
                  "
                >
              </div>
            </div>
            <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div
                class="
                  inline-block
                  min-w-full
                  shadow
                  rounded-lg
                  overflow-hidden
                "
              >
                <table class="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th class="tab-title">
                        React
                      </th>
                      <th
                        v-for="col in columns"
                        :key="col"
                        class="tab-title"
                        @click="sortTable(col)"
                      >
                        {{ col }}
                        <div
                          v-if="col == sortColumn"
                          class="float-right"
                        >
                          <div v-if="ascending">
                            <i class="ri-arrow-up-s-line" />
                          </div>
                          <div v-else>
                            <i class="ri-arrow-down-s-line" />
                          </div>
                        </div>
                      </th>
                      <th class="tab-title">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    v-for="row of rows"
                    :key="row"
                    class="max-h-16"
                  >
                    <tr>
                      <td class="tab-item">
                        <div class="flex flex-col items-center">
                          <i class="ri-bookmark-line my-auto" />
                          <i class="ri-flag-line my-auto" />
                        </div>
                      </td>
                      <td class="tab-item">
                        <div
                          class="h-8 w-8 mx-auto rounded-full bg-green-500"
                        />
                      </td>
                      <td class="tab-item">
                        <div @hover="showHover($event)">
                          <div class="text-center mx-auto">
                            <img
                              class="w-8 h-8 mx-auto rounded-full m-1"
                              src="https://ichef.bbci.co.uk/news/976/cpsprodpb/7727/production/_103330503_musk3.jpg"
                              alt="img_user"
                              :title="row.Auth"
                            >
                          </div>
                          <div class="text-center">
                            L2
                          </div>
                        </div>
                      </td>
                      <td class="tab-item">
                        <div class="truncate font-bold h-6 max-w-xs">
                          {{ row.Titre }}
                        </div>
                        <div class="mt-1 texte-xs whitespace-nowrap">
                          XXX 👀 •XXX ⏫ •XXX 💌 •L1
                        </div>
                      </td>

                      <td class="tab-item">
                        <i class="ri-error-warning-line mx-auto text-red-500 text-center" />
                        <div class="text-gray-900 text-center">
                          {{ row.Creation.toISOString().split("T")[0] }}
                        </div>
                      </td>
                      <td class="tab-item">
                        <div
                          class="
                            max-h-16 max-w-md
                            overflow-hidden overflow-ellipsis
                            text-gray-900
                          "
                        >
                          {{ row.Last }}
                        </div>
                      </td>
                      <td class="tab-item">
                        <div
                          class="
                            max-h-16 max-w-sm
                            overflow-hidden overflow-ellipsis
                            text-gray-900
                          "
                        >
                          {{ row.Notes }}
                        </div>
                      </td>
                      <td class="tab-item">
                        <div class="flex">
                          <button
                            class="
                              border-2 border-sky-200
                              p-1
                              hover:border-sky-500
                            "
                          >
                            Montrer
                          </button>
                          <select
                            class="
                              border-2 border-sky-200
                              p-1
                              hover:border-sky-500
                              flex
                              mx-1
                            "
                          >
                            <i class="ri-arrow-down-s-line ml-1" />
                            <option>Actions</option>
                            <option>Actions</option>
                            <option>Actions</option>
                            <option>Actions</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  class="
                    px-5
                    py-5
                    bg-white
                    border-t
                    flex flex-col
                    xs:flex-row
                    items-center
                    xs:justify-between
                  "
                >
                  <span class="text-xs xs:text-sm text-gray-900">
                    Showing 1 to 4 of 50 Entries
                  </span>
                  <div class="inline-flex mt-2 xs:mt-0">
                    <button
                      class="
                        text-sm
                        bg-gray-300
                        hover:bg-gray-400
                        text-gray-800
                        font-semibold
                        py-2
                        px-4
                        rounded-l
                      "
                    >
                      Prev
                    </button>
                    <button
                      class="
                        text-sm
                        bg-gray-300
                        hover:bg-gray-400
                        text-gray-800
                        font-semibold
                        py-2
                        px-4
                        rounded-r
                      "
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import ToolbarAdmin from '@/components/ToolbarAdmin.vue'
export default defineComponent({
  name: 'AdminSide',
  components: {
    ToolbarAdmin
  },
  props: {
    threads: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      ascending: false,
      sortColumn: '',
      rows: [
        { etat: 4, Auth: 'A', Titre: 'A Lorem ipsum dolor sit amet consectetur adipisicing', Creation: new Date(2020, 8, 22), Last: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore unde, animi reiciendis sapiente quis nam, iure, similique sint.necessitatibus!', Notes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore unde, animi reiciendis sapiente quis nam, iure, similique sint.necessitatibus!' },
        { etat: 2, Auth: 'B', Titre: 'B Lorem ipsum dolor sit amet consectetur adipisicing', Creation: new Date(2020, 8, 22), Last: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore unde, animi reiciendis sapiente quis nam, iure, similique sint.necessitatibus!', Notes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore unde, animi reiciendis sapiente quis nam, iure, similique sint.necessitatibus!' },
        { etat: 3, Auth: 'C', Titre: 'C Lorem ipsum dolor sit amet consectetur adipisicing', Creation: new Date(2020, 8, 22), Last: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore unde, animi reiciendis sapiente quis nam, iure, similique sint.necessitatibus!', Notes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore unde, animi reiciendis sapiente quis nam, iure, similique sint.necessitatibus!' },
        { etat: 1, Auth: 'D', Titre: 'D Lorem ipsum dolor sit amet consectetur adipisicing', Creation: new Date(2020, 8, 22), Last: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore unde, animi reiciendis sapiente quis nam, iure, similique sint.necessitatibus!', Notes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore unde, animi reiciendis sapiente quis nam, iure, similique sint.necessitatibus!' }
      ]
    }
  },
  computed: {
    columns: function columns () {
      if (this.rows.length === 0) {
        return []
      }
      return Object.keys(this.rows[0])
    }
  },
  methods: {
    sortTable: function sortTable (col) {
      if (this.sortColumn === col) {
        this.ascending = !this.ascending
      } else {
        this.ascending = true
        this.sortColumn = col
      }

      var ascending = this.ascending

      this.rows.sort(function (a, b) {
        if (a[col] > b[col]) {
          return ascending ? 1 : -1
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1
        }
        return 0
      })
    }
  }
})
</script>

<style scoped>
.tab-title {
  @apply px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider;
}
.tab-item {
  @apply border-b border-gray-200 bg-white text-sm max-h-16 overflow-hidden;
}
</style>
