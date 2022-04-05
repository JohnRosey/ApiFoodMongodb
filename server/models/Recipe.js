const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  date: {
    type: Date,
    
  },
  ingredients: {
    type: Array,
    required: 'This field is required.'
  },
  category: {
    type: String,
    enum: ['Burkina_Faso', 'Congo', 'Togo', 'Guinée', 'Sénégal','Côte_dIvoire', ],
    required: 'This field is required.'
  },
  type: {
    type: String,
    enum: ['Plat', 'Jus', 'Apéritif', ],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});
/**
 * La recherche prend en compte les descriptions 
 */
recipeSchema.index({ name: 'text', description: 'text' });
 //WildCard Indexing
recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);