import mongoose from 'mongoose'

const medalSchema = new mongoose.Schema({
  username: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  emoji: {
    type: String
  },
  special: {
    type: String
  },
  value: {
    type: Number
  }
}, {
  collection: 'medals'
})

export default mongoose.model('Medal', medalSchema)
