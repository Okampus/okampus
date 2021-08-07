import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String
  },
  roleCreation: {
    type: Date
  }
}, {
  collection: 'roles'
})

export default mongoose.model('Role', roleSchema)
