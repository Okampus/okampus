import mongoose from 'mongoose'

const permSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  createdOn: {
    type: Date
  }
}, {
  collection: 'permissions'
})

export default mongoose.model('Permission', permSchema)
