import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String
  },
  pwHash: {
    type: String
  },
  roles: [
    { type: Schema.Types.ObjectId, ref: 'Role' }
  ],
  vanity: {
    type: Schema.Types.ObjectId,
    ref: 'UserVanity'
  },
  discord: {
    type: Schema.Types.ObjectId,
    ref: 'UserDiscordInfo'
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'UserActivity'
  }
}, {
  collection: 'users'
})

export default mongoose.model('User', userSchema)
