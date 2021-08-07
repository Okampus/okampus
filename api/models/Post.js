import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  nickname: {
    type: String
  },
  email: {
    type: String
  },
  onServer: {
    type: Boolean
  },
  locale: {
    type: String
  },
  mfa_enabled: {
    type: Boolean
  },
  avatar: {
    type: String
  }
}, {
  collection: 'users'
})

export default mongoose.model('User', userSchema)
