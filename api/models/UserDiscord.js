import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userDiscordSchema = new Schema({
  userId: {
    type: String
  },
  username: {
    type: String
  },
  discrim: {
    type: Number
  },
  nickname: {
    type: String
  },
  locale: {
    type: String
  },
  onServer: {
    type: Boolean
  },
  mfaEnabled: {
    type: Boolean
  }
}, {
  collection: 'userDiscordInfos'
})

export default mongoose.model('UserDiscordInfo', userDiscordSchema)
