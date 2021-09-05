const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  path: {
    type: String
  },
  fromPromo: {
    type: Number
  },
  postedDate: {
    type: Date
  },
  schoolYear: {
    type: Number
  },
  description: {
    type: String
  },
  fileType: {
    type: String
  },
  subjectName: {

  },
  subjectCode: {
    type: String
  },
  tags: {
    type: [String]
  }

  /* chemin: string,
  promo: string,
  année scolaire: int,
  type de fichier: string,
  nom: string,
  code de matière: string,
  tags: string[] */

}, {
  collection: 'comments'
})

module.exports = mongoose.model('Comment', commentSchema)
