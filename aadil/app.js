// select elements

const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const ul = document.querySelector(".nav__menu");

// sticky navigation using Intersection observer api for better performance

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("header__sticky");
  else nav.classList.remove("header__sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);

// page navigation scroll smoothly with event delegation
const sections = document.querySelectorAll("section");

ul.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    sections.forEach((section) => (section.style.paddingTop = "100px"));
  }
});

// fading animation with better performance
const allSections = document.querySelectorAll(".section");

const fadingSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section__hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(fadingSection, {
  root: null,
  threshold: 0.12,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section__hidden");
});

// mobile menu
const mobileMenu = document.querySelector(".mobile__menu");
const overlay = document.querySelector(".navigation");

const showMenu = () => {
  overlay.classList.add("show__menu");
};

const hideMenu = () => {
  overlay.classList.remove("show__menu");
};

mobileMenu.addEventListener("click", showMenu);
overlay.addEventListener("click", hideMenu);


const form = document.querySelector('form');
const recipeList = document.querySelector('#recipe-list');
const noRecipes = document.getElementById('no-recipes');
const searchBox = document.getElementById('search-box');

// Define recipes array
let recipes = [];

// Handle form submit
function handleSubmit(event) {
  // Prevent default form submission behavior
  event.preventDefault();
  
  // Get recipe name, ingredients, and method input values
  const nameInput = document.querySelector('#recipe-name');
  const ingrInput = document.querySelector('#recipe-ingredients');
  const methodInput = document.querySelector('#recipe-method');
  const name = nameInput.value.trim();
  const ingredients = ingrInput.value.trim().split(',').map(i => i.trim());
  const method = methodInput.value.trim();
  
  // Check if recipe name, ingredients, and method are valid
  if (name && ingredients.length > 0 && method) {
    // Create new recipe object and add it to recipes array
    const newRecipe = { name, ingredients, method };
    recipes.push(newRecipe);
    
    // Clear form inputs
    nameInput.value = '';
    ingrInput.value = '';
    methodInput.value = '';
    
    // Add new recipe to recipe list
    displayRecipes();
  }
}

// Display recipes in recipe list
function displayRecipes() {
  recipeList.innerHTML = '';
  recipes.forEach((recipe, index) => {
    const recipeDiv = document.createElement('div');
	// Create div to display the individual recipe, for each recipe
    recipeDiv.innerHTML = `
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong></p>
      <ul>
        ${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}
      </ul>
      <p><strong>Method:</strong></p>
      <p>${recipe.method}</p>
      <button class="delete-button" data-index="${index}">Delete</button>`;
    recipeDiv.classList.add('recipe');
    recipeList.appendChild(recipeDiv);
  });
  // Display warning when there are no recipes in the list
  if (recipes.length > 0) {
	noRecipes.style.display = 'none';
  }
  else {
	noRecipes.style.display = 'flex';
  }
}

// Handle recipe deletion
function handleDelete(event) {
  if (event.target.classList.contains('delete-button')) {
    const index = event.target.dataset.index;
    recipes.splice(index, 1);
    displayRecipes();
	searchBox.value = '';
  }
}

// Search recipes by search query
function search(query) {
  const filteredRecipes = recipes.filter(recipe => {
    return recipe.name.toLowerCase().includes(query.toLowerCase());
  });
  recipeList.innerHTML = '';
  filteredRecipes.forEach(recipe => {
    const recipeEl = document.createElement('div');
    recipeEl.innerHTML = `
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong></p>
      <ul>
        ${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}
      </ul>
      <p><strong>Method:</strong></p>
      <p>${recipe.method}</p>
      <button class="delete-button" data-index="${recipes.indexOf(recipe)}">
		Delete
	  </button>`;
    recipeEl.classList.add('recipe');
    recipeList.appendChild(recipeEl);
  });
}

// Add event listeners
form.addEventListener('submit', handleSubmit);
recipeList.addEventListener('click', handleDelete);
searchBox.addEventListener('input', event => search(event.target.value));