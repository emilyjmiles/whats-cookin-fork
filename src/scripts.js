import '../dist/bundle.js';
import './styles.css';
import getData from './apiCalls';
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import Ingredient from './classes/Ingredient'
import RecipeRepository from './classes/RecipeRepository'
import Recipe from './classes/Recipe'
import User from './classes/User';


// Query Selectors for buttons:
const viewHomeButton = document.querySelector('.view-home-button');
const viewAllRecipesButton = document.querySelector('.view-all-recipes');
const viewFavoritesButton = document.querySelector('.view-favorites');
const searchButton = document.querySelector('.search-submit-button');
const searchInput = document.querySelector('.search-input');
const breakfastButton = document.querySelector('.breakfast-button');
const dipsButton = document.querySelector('.dips-button');
const appetizersButton = document.querySelector('.appetizers-button');
const saucesButton = document.querySelector('.sauces-button');
const saladsButton = document.querySelector('.salads-button');
const mainCoursesButton = document.querySelector('.main-course-button');
const sideDishesButton = document.querySelector('.side-dishes-button');
const otherRecipesButton = document.querySelector('.other-recipes-button');
const cookRecipeButton = document.getElementById('cookRecipeButton')
const addIngredientsButton = document.getElementById('addToFavoritesButton')
// const recipeCardButton = document.querySelector('.recipe-card-image')

// Query Selectors for views:
const homeView = document.querySelector('.home-view-section');
const allRecipesView = document.querySelector('.all-recipes-view-section');
const favoritesView = document.querySelector('.favorites-view-section');
const searchResultsView = document.querySelector('.search-results-view-section');
const noResultsView = document.getElementById('noResultsFound');
const singleRecipeView = document.querySelector('.single-recipe-view-section');
const breakfastRecipesView = document.querySelector('.breakfast-recipes-view-section');
const dipRecipesView = document.querySelector('.dips-recipes-view-section');
const appetizerRecipesView = document.querySelector('.appetizers-recipes-view-section');
const sauceRecipesView = document.querySelector('.sauces-recipes-view-section');
const saladRecipesView = document.querySelector('.salads-recipes-view-section');
const mainCourseRecipesView = document.querySelector('.main-course-recipes-view-section');
const sideDishRecipesView = document.querySelector('.side-dishes-recipes-view-section');
const otherRecipesView = document.querySelector('.other-recipes-view-section');
const allSections = document.querySelectorAll('section > section');
// Query Selector for updating page content
const allRecipesContent = document.querySelector('.all-recipes-view-content');
const favoritesContent = document.querySelector('.favorites-view-content');
const searchResultsContent = document.querySelector('.search-results-content');
const singleRecipeTitle = document.querySelector('.single-recipe-title');
const singleRecipeContent = document.querySelector('.single-recipe-content');
const breakfastRecipesContent = document.querySelector('.breakfast-recipes-content');
const dipRecipesContent = document.querySelector('.dips-recipes-content');
const appetizerRecipesContent = document.querySelector('.appetizers-recipes-content');
const sauceRecipesContent = document.querySelector('.sauces-recipes-content');
const saladRecipesContent = document.querySelector('.salads-recipes-content');
const mainCourseRecipesContent = document.querySelector('.main-course-recipes-content');
const sideDishRecipesContent = document.querySelector('.side-dishes-recipes-content');
const otherRecipesContent = document.querySelector('.other-recipes-content');
const recipeName = document.getElementById('recipeName');
const recipeIngredients = document.getElementById('recipeIngredients');
const recipeInstructions = document.getElementById('recipeInstructions');
const recipeImage = document.getElementById('recipeImage');
const recipeCost = document.getElementById('recipeCost');
// Global Variables:
let ingredients;
let ingredientsData;
let recipes;
let recipeData;
let recipeRepository;
let tags = [];
let user;
let userData;

Promise.all([
  getData(`http://localhost:3001/api/v1/users`),
  getData(`http://localhost:3001/api/v1/ingredients`),
  getData(`http://localhost:3001/api/v1/recipes`),
])
  .then(data => {
    console.log(data)
    userData = data[0];
    ingredientsData = data[1];
    recipeData = data[2];

    getUser(userData);
    displayHomeView();
    }
);

function modifyIngredient(userId, ingredientsId, ingredientsModification) {
  return fetch(`http://localhost:3001/api/v1/users`, {
    method: 'POST',
    body: JSON.stringify({
      "userID": userId,
      "ingredientID": ingredientsId,
      "ingredientModification": ingredientsModification
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => console.log('POST data: ', data))
    .catch(error => console.log('POST error: ', `${response.statusText}: Looks like there was a problem!`, error))
}


// Event Listeners:
// singleRecipeContent.addEventListener('click', () => {
  // displayRecipe(event) });
viewHomeButton.addEventListener('click', displayHomeView);
viewAllRecipesButton.addEventListener('click', displayAllRecipesView);
viewFavoritesButton.addEventListener('click', displayFavoritesView);
searchButton.addEventListener('click', displaySearchResultsView)
breakfastButton.addEventListener('click', displayBreakfastRecipes)
dipsButton.addEventListener('click', displayDipRecipes)
appetizersButton.addEventListener('click', displayAppetizerRecipes)
saucesButton.addEventListener('click', displaySauceRecipes)
saladsButton.addEventListener('click', displaySaladRecipes)
// mainCoursesButton.addEventListener('click', displayMainCourseRecipes)
sideDishesButton.addEventListener('click', displaySideDishRecipes)
// otherRecipesButton.addEventListener('click', displayOtherRecipes)
allSections.forEach(section => section.addEventListener('click', displayRecipe))
// allSections.forEach(section => {
//   section.addEventListener('keyup', function(event) {
//     if (event.keyCode === 13) {
//       displayRecipe(event)
//     }
//   });
// })

// Helper Functions:
function hideElements(elements) {
  elements.forEach(element => element.classList.add('hidden'));
};

function showElements(elements) {
  elements.forEach(element => element.classList.remove('hidden'));
};

// function addStyling(elements, className) {
//   elements.classList.add(className)
// };

// function removeStyling(elements, className) {
//   elements.classList.remove(className)
// };

// DOM Display
function displayHomeView() {
  hideElements([viewHomeButton, allRecipesView, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([homeView, viewAllRecipesButton, viewFavoritesButton]);
};

function displayAllRecipesView() {
  hideElements([homeView, viewAllRecipesButton, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([allRecipesView, viewHomeButton, viewFavoritesButton]);
  sortRecipesByName();
  createRecipeCard(allRecipesContent, recipeRepository);
};

function displayFavoritesView() {
  hideElements([homeView, allRecipesView, viewFavoritesButton, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([favoritesView, viewHomeButton, viewAllRecipesButton]);
};

function displaySearchResultsView() {
  hideElements([homeView, allRecipesView, favoritesView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([searchResultsView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
};

function displaySingleRecipeView() {
  hideElements([homeView, allRecipesView, favoritesView, searchResultsView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([singleRecipeView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);

};

function displayBreakfastRecipes() {
  hideElements([homeView, allRecipesView, favoritesView, searchResultsView, singleRecipeView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([breakfastRecipesView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
};

function displayDipRecipes() {
  hideElements([homeView, allRecipesView, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([dipRecipesView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
};

function displayAppetizerRecipes() {
  hideElements([homeView, allRecipesView, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([appetizerRecipesView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
};

function displaySauceRecipes() {
  hideElements([homeView, allRecipesView, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([sauceRecipesView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
};

function displaySaladRecipes() {
  hideElements([homeView, allRecipesView, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, mainCourseRecipesView, sideDishRecipesView, otherRecipesView]);
  showElements([saladRecipesView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
};

// function displayMainCourseRecipes() {
//   hideElements([homeView, allRecipesView, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, sideDishRecipesView, otherRecipesView]);
//   showElements([mainCourseRecipesView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
// };

function displaySideDishRecipes() {
  hideElements([homeView, allRecipesView, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, otherRecipesView]);
  showElements([sideDishRecipesView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
};

// function displayOtherRecipes() {
//   hideElements([homeView, allRecipesView, favoritesView, searchResultsView, singleRecipeView, breakfastRecipesView, dipRecipesView, appetizerRecipesView, sauceRecipesView, saladRecipesView, mainCourseRecipesView, sideDishRecipesView]);
//   showElements([otherRecipesView, viewHomeButton, viewAllRecipesButton, viewFavoritesButton]);
// };

// DOM Functionality
function getUser(usersData) {
  const randomIndex = getRandomIndex(usersData);
  const randomUserData = usersData[randomIndex];
  getRecipes();
  user = new User(randomUserData, recipeRepository);
};

function getRecipes() {
  recipeRepository = new RecipeRepository(recipeData);
  getIngredients();
};

function getIngredients() {
  recipeRepository.getRecipesInfo(ingredientsData);
};

const getRandomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};


function displayRecipe(event) {
  const card = event.target.closest('article');

  if (card.classList.contains('recipes-card-content')) {
    displaySingleRecipeView()
    createSingleRecipeCard(card.id);
  }
};

function createRecipeInterpolation(recipe) {
  recipeName.innerText = recipe.name;
  recipeImage.src = recipe.image;
  recipeIngredients.innerText = recipe.ingredients;
  recipeCost.innerHTML = recipe.returnTotalCost();
  recipeInstructions.innerText = recipe.instructions;
}

function createRecipeCard(content, recipeRepository) {
  content.innerHTML = '';

  recipeRepository.recipes.forEach(recipe => {
    content.innerHTML +=
      `<article tabindex="0" role="button" class="recipes-card-content" id=${recipe.id}>
          <img src="${recipe.image}" class="recipe-image" alt=${recipe.name}>
          <h1 class="recipe-card-name" id="recipeName">${recipe.name}</h1>
      </article>`;
  });
}

function createSingleRecipeCard(recipeId) {
const recipe = recipeRepository.recipes.find(recipe => {
  recipe.id === parseInt(recipeId)
})

createRecipeInterpolation(recipe);
createIngredientList(recipe);
create
};

function createRecipeInstructions(instructions) {
    recipeInstructions.innerHTML = instructions.reduce((acc, instruction) => {
      acc += `<li class="instructions-list" id="recipeInstructionsList">${instruction}</li>`;
      return acc;
    }, '');
 };

function createRecipeIngredients(ingredients) {
    recipeIngredients.innerHTML = ingredients.reduce((acc, ingredient) => {
      acc += `<li class="ingredient-list" id="recipeIngredientsList">${ingredient}</li>`;
      return acc;
    }, '');
  };

  function createIngredientList(recipe) {
    const ingredientList = recipe.returnIngredientsList();
    createRecipeIngredients(ingredientList);
  }

  function createInstructionList(recipe) {
    const instructionsList = recipe.returnInstructions();
    createRecipeInstructions(instructionsList);
  }

  function sortRecipesByName() {
    recipeRepository.recipes.sort((a, b) => a.name - b.name);
  }

function removeAllRecipeCards() {
    const recipeCards = document.querySelectorAll('.recipes-container-recipe-card');

    recipeCards.forEach((recipeCard) => {
      recipeCard.remove();
    })
  };

function addFavorite() {
  hideElements([addToFavoritesButton]);
  showElements([removeFromFavoritesButton]);

  const favoriteRecipe = recipeRepository.recipes.find(recipe => recipe.id === parseInt(addToFavoritesButton.name));
  user.addToFavorites(favoriteRecipe);
};

function removeFromFavorites() {
  hideElements([removeFromFavoritesButton]);
  showElements([addToFavoritesButton]);

  const favoriteRecipe = recipeRepository.recipes.find(recipe => recipe.id === parseInt(removeFromFavoritesButton.name));
  user.removeFromFavorites(favoriteRecipe);

};

function searchInitialization(event) {
  const searchTerm = event.target.value.toLowerCase();
  searchDeclaration(searchTerm);
};

function searchDeclaration(searchTerm) {
  if (!searchInput.value && !recipeSearchResultsContainer.innerHTML) {
    return;

  } else if (searchInput.value) {
    hideElements([noResultsSearch, mainPageView]);
    showElements([recipeSearchResults, recipeSearchResultsContainer]);

    removeStyling(singleRecipeView, 'single-recipe-view');
    removeStyling(allRecipesSection, 'all-recipes');

    searchInvocation(searchTerm);

  } else {
    hideElements([recipeSearchResultsContainer]);
    showElements([noResultsSearch, recipeSearchResults]);
  }
};

function searchInvocation(searchTerm) {
  let filteredRecipes = recipeRepository.filterByRecipeName(searchTerm);
  let findRecipesByIngredient = recipeRepository.getRecipeIngredientsData(searchTerm);

  findRecipesByIngredient.forEach(recipe => {
    if (!filteredRecipes.includes(recipe)) {
      filteredRecipes.push(recipe);
    }
  });

  createRecipeCard(recipeSearchResultsContainer, filteredRecipes);
};

function getTag(event) {
  const tagClicked = event.target.closest('button');
  const tag = tagClicked.value;
}
