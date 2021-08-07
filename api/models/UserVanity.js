import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userVanitySchema = new Schema({
  avatar: {
    type: String
  },
  signature: {
    type: String
  },
  rank: {
    type: String
  },
  userScore: {
    type: Number
  },
  medals: [
    { type: Schema.Types.ObjectId, ref: 'Medal' }
  ]
}, {
  collection: 'userVanities'
})

export default mongoose.model('UserVanity', userVanitySchema)
