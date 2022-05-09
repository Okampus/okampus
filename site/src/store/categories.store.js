// import $axios from '@/shared/config/axios.config'
import { defineStore } from 'pinia'
// import { onItems } from '@/utils/store'

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [
            'Alimentation',
            'Impôts et taxes',
            'Logistique',
            'Assurance',
            'Restaurant et bars',
            'Équipement et matériel',
            'Salaire',
            'Transports',
            'Marketing',
            'IT & Electronique',
            'Autres dépenses',
        ],
    }),
    actions: {
        replaceCategories(categories, pageInfo) {
            if (categories.length) {
                this.categories = categories.map((categorie) => {
                    categorie.post.author.fullname =
                        categorie.post.author.firstname + ' ' + categorie.post.author.lastname
                    return categorie
                })
            }
            return { items: categories, pageInfo }
        },
        async getCategories() {
            return { items: [1, 2, 3, 4], pageInfo: { totalItemCount: 4, totalPages: 1 } }
        },
    },
})
