import { getURL } from '@/utils/routeUtils'
import urljoin from 'url-join'
import { POST, contentTypeDemonstrative } from '../types/content-kinds.enum'

import { useAuthStore } from '@/store/auth.store'
import { useThreadsStore } from '@/store/threads.store'

import { emitter } from '@/shared/modules/emitter'
import { capitalize } from 'lodash'

import router from '@/router'
import { i18n } from '@/shared/modules/i18n'

const auth = useAuthStore()
const threads = useThreadsStore()

export const report = (content, hoverBackground = false) => ({
    name: content.interactions.reported ? 'Signalé' : 'Signaler',
    condition: true,
    icon: content.interactions.reported ? 'flag' : ['far', 'flag'],
    class:
        (hoverBackground ? 'hover:bg-red-500 hover:text-white' : 'group-hover:text-red-600') +
        (content.interactions.reported ? ' text-red-500' : ''),
    action: () => {
        content.interactions.reported
            ? emitter.emit('show-toast', {
                  message: `Tu as déjà signalé ${
                      contentTypeDemonstrative[content.kind][i18n.global.locale]
                  }.`,
                  type: 'warning',
              })
            : emitter.emit('report', content)
    },
})

export const getLinkContent = (content, hoverBackground = false) => ({
    name: 'Lien',
    condition: true,
    icon: 'link',
    class: hoverBackground ? 'hover:bg-blue-500 hover:text-white' : 'group-hover:text-blue-600',
    action: () => {
        try {
            console.log(router.currentRoute.value.path, `#content-${content.contentId}`, router)
            navigator.clipboard.writeText(
                getURL(urljoin(router.currentRoute.value.path, `#content-${content.contentId}`)),
            )
            emitter.emit('show-toast', {
                message: `Le lien de ${
                    contentTypeDemonstrative[content.kind][i18n.global.locale]
                } a été copié dans le presse-papier.`,
                type: 'info',
            })
        } catch (err) {
            emitter.emit('show-toast', {
                message: `Une erreur est survenue lors de la copie du lien de ${
                    contentTypeDemonstrative[content.kind][i18n.global.locale]
                }.`,
                type: 'error',
            })
        }
    },
})

export const removeContent = (content, hoverBackground = false) => ({
    name: 'Supprimer',
    condition:
        (content.author == auth.user?.userId || auth.user?.roles?.includes('admin')) && !content.hidden,
    icon: 'trash-alt',
    class: hoverBackground ? 'hover:bg-red-500 hover:text-white' : 'group-hover:text-red-600',
    action: () => {
        threads
            .deleteContent(content.contentId)
            .then(() => {
                if (content.kind === POST) {
                    router.push('/threads')
                }
                emitter.emit('show-toast', {
                    message: `${capitalize(
                        contentTypeDemonstrative[content.kind][i18n.global.locale],
                    )} a bien été supprimé${
                        i18n.global.locale == 'fr' && contentTypeDemonstrative[content.kind].frFeminine
                            ? 'e'
                            : ''
                    }.`,
                    type: 'success',
                })
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: `La suppression de ${
                        contentTypeDemonstrative[content.kind][i18n.global.locale]
                    } a échoué (${err}).`,
                    type: 'error',
                })
            })
    },
})

export const edit = (content, hoverBackground = false) => ({
    name: 'Éditer',
    condition: content.author == auth.user?.userId || auth.user?.roles?.includes('admin'),
    icon: 'pen',
    class: hoverBackground ? 'hover:bg-green-500 hover:text-white' : 'group-hover:text-green-600',
    action: () => {
        content.editing = true
    },
})

export const favorite = (content, hoverBackground = false) => ({
    name: 'Favori',
    condition: true,
    icon: content.interactions.favorited ? 'star' : ['far', 'star'],
    class:
        (hoverBackground ? 'hover:bg-yellow-500 hover:text-white' : 'group-hover:text-yellow-600') +
        (content.interactions.favorited ? ' text-yellow-400' : ''),
    action: () => {
        content.interactions.favorited
            ? threads.removeFavorite(content.contentId)
            : threads.addFavorite(content.contentId)
    },
})
