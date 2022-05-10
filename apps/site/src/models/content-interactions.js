export default class ContentInteractions {
    constructor() {
        this.favorited = false
        this.reported = false
        this.voted = 0
        this.reactions = []
    }

    addInteraction(type, interaction) {
        if (type === 'favorites') {
            this.favorited = true
        } else if (type === 'reports') {
            this.reported = true
        } else if (type === 'votes') {
            this.voted = interaction.value
        } else if (type === 'reactions') {
            this.reactions.push(interaction.reaction)
        }
    }

    removeInteraction(type, interaction) {
        if (type === 'favorites') {
            this.favorited = false
        } else if (type === 'reports') {
            this.reported = false
        } else if (type === 'votes') {
            this.voted = 0
        } else if (type === 'reactions') {
            this.reactions = this.reactions.filter(
                (reaction) => reaction.reactionId !== interaction.reaction.reactionid,
            )
        }
    }
}
