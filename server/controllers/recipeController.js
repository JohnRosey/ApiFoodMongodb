require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
    try {
        
            const limitNumber = 5;
            const categories = await Category.find({}).limit(limitNumber);
            const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
            const Togo = await Recipe.find({ 'category': 'Togo' }).limit(limitNumber);
            const Congo = await Recipe.find({ 'category': 'Congo' }).limit(limitNumber);
            const Guinée  = await Recipe.find({ 'category': 'Guinée' }).limit(limitNumber);
             
            const food = {latest, Togo, Congo, Guinée };
               
    
    res.render('index', {title: ' Gombo-Food', categories,food });
} catch (error) {
        res.satus(500).send({message: error.message || "Error Occured" });
    }
}

// async function insertDymmyCategoryData(){
//     try {
//       await Category.insertMany([
//         {
//           "name": "Burkina_Faso",
//           "image": "Burkina-food.jpg"
//         },
//         {
//           "name": "Congo",
//           "image": "Congo-food.jpg"
//         }, 
//         {
//           "name": "Togo",
//           "image": "Togo-food.jpg"
//         },
//         {
//           "name": "Guinée",
//           "image": "Guinée-food.jpg"
//         }, 
//         {
//           "name": "Sénégal",
//           "image": "Sénégal-food.jpg"
//         },
//         {
//           "name": "Côte_d'Ivoire",
//           "image": "Ivoire-food.jpg"
//         }
//       ]);
//     } catch (error) {
//       console.log('err', + error)
//     }
//   }
//   insertDymmyCategoryData();
  //try {
//     const limitNumber = 5;
//     const categories = await Category.find({}).limit(limitNumber);
//     const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
//     const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
//     const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
//     const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

//     const food = { latest, thai, american, chinese };



// /**
//  * GET /categories
//  * Categories 
// */
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: ' Gombo-Food', categories } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


// /**
//  * GET /categories/:id
//  * Categories By Id
// */
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
 
// /**
//  * GET /recipe/:id
//  * Recipe 
// */
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


// /**
//  * POST /search
//  * Search 
// */
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
  
 }

// /**
//  * GET /explore-latest
//  * Explplore Latest 
// */
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 



// /**
//  * GET /explore-random
//  * Explore Random as JSON
// */
// exports.exploreRandom = async(req, res) => {
//   try {
//     let count = await Recipe.find().countDocuments();
//     let random = Math.floor(Math.random() * count);
//     let recipe = await Recipe.findOne().skip(random).exec();
//     res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
//   } catch (error) {
//     res.satus(500).send({message: error.message || "Error Occured" });
//   }
// } 


// /**
//  * GET /submit-recipe
//  * Submit Recipe
// */
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe',infoErrorsObj , infoSubmitObj  } );
}

// /**
//  * POST /submit-recipe
//  * Submit Recipe
// */
//TODO : MODIFIER AVEC AMAZON S3 POUR ENVOYER VERS UN BUKET LES IMAGES ET STOCKER L'URL DANS MONGDB 
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      ingredients: req.body.ingredients,
      category: req.body.category,
      type: req.body.type,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
     res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  } }





// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example 
*/


// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       {"name": "BENGA",
//         "description": `Recipe Description Goes Here`,
//         "date": "",
//        "ingredients": [
//            "1 level teaspoon baking powder",
//            "1 level teaspoon cayenne pepper",
//            "1 level teaspoon hot smoked paprika",
//          ],
//          "category": "Congo", 
//          "type": "Plat",
//        "image": "Congo.png"},
//        {"name": "Riz Gras",
//         "description": `Recipe Description Goes Here`,
//         "date": "",
//        "ingredients": [
//            "1 level teaspoon baking powder",
//            "1 level teaspoon cayenne pepper",
//            "1 level teaspoon hot smoked paprika",
//          ],
//          "category": "Burkina_Faso", 
//          "type": "Plat",
//        "image": "bf_rizgras.jpg"},
//        {"name": "Recipe Name Goes Here",
//         "description": `For the Chicken
//         Add oil to a large pot and heat over medium. Add the chicken and season with salt and pepper.
//         Cook, until the chicken is cooked all the way through, about 10 minutes, flipping once in between.
//         Remove the chicken onto a paper towel-covered plate to drain of excess oil. Set aside.
//         For the Rice
//         Add the vegetable oil to the same pot and heat over medium. Add the onions and cook until translucent, about 5 minutes.
//         Add the garlic, habanero peppers and tomatoes. Cook another 3 minutes, stirring occasionally.
//         Add the tomato paste and stir the mixture to combine.
//         Add the rice and stir the mixture to combine.
//         Add the chicken stock, cinnamon stick and salt and pepper (to taste). Stir well and bring to a boil on high heat.
//         Once boiling, cover the pot and decrease the heat to "low." Cook, stirring occasionally, until the rice is cooked and liquids are absorbed, about 12 minutes.`,
//         "date": "",
//        "ingredients": [
//            "¼ cup Vegetable Oil",
//            "1 lb. Chicken Thighs*",
//            "Salt and Pepper, to taste",
//            "½ cup Vegetable Oil",
//            "2 Yellow Onions chopped",
//            "5 cloves Garlic minced",
//            "2 Habanero Peppers finely chopped",
//            "3 Roma Tomatoes seeded and chopped",
//            "2¼ cups Long-Grain White Rice",
//            "5 cups Chicken Stock",
//            "Cinnamon Stick",
//          ],
//          "category": "Togo", 
//          "type": "Plat",
//        "image": "togo.png"},
//        {"name": "mAFEES",
//         "description": `Recipe Description Goes Here`,
//         "date": "",
//        "ingredients": [
//            "1 level teaspoon baking powder",
//            "1 level teaspoon cayenne pepper",
//            "1 level teaspoon hot smoked paprika",
//          ],
//          "category": "Sénégal", 
//          "type": "Plat",
//        "image": "jollof-rice.jpg"},
//        {"name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "date": "",
//        "ingredients": [
//            "1 level teaspoon baking powder",
//            "1 level teaspoon cayenne pepper",
//            "1 level teaspoon hot smoked paprika",
//          ],
//          "category": "Côte_dIvoire", 
//          "type": "Plat",
//        "image": "luanda.jpg"},
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
