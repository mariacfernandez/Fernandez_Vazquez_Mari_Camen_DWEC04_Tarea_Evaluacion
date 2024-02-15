//Solo las categorias
const API_URL_CATEGORIA = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
//Para filtrar, hay que añadirle el filtro, obtiene todas las recetas de pe desayuno
//por ejemplo //https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood 
const API_URL_FILTRO = "https://www.themealdb.com/api/json/v1/1/filter.php?c="
//Para obtener una receta concreta accediendo por id
//por ejemplo https://www.themealdb.com/api/json/v1/1/lookup.php?i=52835 
//se corresponde con Fettucine alfredo
const API_URL_ID ="https://www.themealdb.com/api/json/v1/1/lookup.php?i="

//para obtener todas las categorias
let categorias = [];
//Dejo comentado la llamada js
//async function categoriasApp() {
//  
//  await fetch(API_URL_CATEGORIA)
//    .then((res) => res.json())
//    .then((data) => (categorias = data.meals));
//  
//};
// con ajax
function categoriasApp() {
  return $.ajax({
    url: API_URL_CATEGORIA,
    method: 'GET',
    dataType: 'json'
  })
  .done(function(data) {
    categorias = data.meals;
  })
  .fail(function(error) {
    console.error('Error al obtener las categorías:', error);
  });
}

//para obtener todas las recetas de una categoria que se pasa por parametro
let recetas =[];
//async function recetasCategoriaApp(category) {
//  await fetch(API_URL_FILTRO + category)
//    .then((res) => res.json())
//    .then((data) => (recetas = data.meals));
//};
function recetasCategoriaApp(category) {
  return $.ajax({
    url: API_URL_FILTRO + category,
    method: 'GET',
    dataType: 'json'
  })
  .done(function(data){
    recetas = data.meals;
  })
  .fail(function(error){
    console.error('Error al obtener las recetas:', error);
  });

}
//para obtener una sola receta, se pasa el id de la receta por parametro
let unaReceta =[];
async function unaRecetaApp(id) {
  await fetch(API_URL_ID + id)
    .then((res) => res.json())
    .then((data) => (unaReceta = data.meals));
};

// obtener elementos padre
const sectionCenter = document.querySelector(".section-center");
const btnContainer = document.querySelector(".btn-container");
// displaya todas las categorias cuando se carga la página
window.addEventListener("DOMContentLoaded", function () {
    categoriasApp().then(() => {
        displayCategoriasButtons();
    });
});

function displayCategoriasButtons() {
  const categories = categorias.reduce(
    function (values, item) {
      if (!values.includes(item.strCategory)) {
        values.push(item.strCategory);
      }
      return values;
    },
    []
  );
   const categoryBtns = categories
    .map(function (category) {
      return `<button type="button" class="filter-btn" data-id=${category}>
          ${category}
        </button>`;
    })
    .join("");

  btnContainer.innerHTML = categoryBtns;
  const filterBtns = btnContainer.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
     
      const category = e.currentTarget.dataset.id;
     
     //obtener las recetas de la categoria del boton pulsado
       recetasCategoriaApp(category).then(() => { diplayMenuItems(recetas)});
    });
 
  });
}

sectionCenter.addEventListener("click", function (e) {
    // Obtiene el idMeal del atributo data-idMeal
    const idMeal = e.target.dataset.id;
    // Llama a la función para obtener detalles de la API usando el idMeal
    unaRecetaApp(idMeal).then(()=> { diplayUnaReceta(unaReceta)});
  
});
function diplayMenuItems(menuItems) {
  let displayMenu = menuItems.map(function (item) {
    return `<article class="menu-item">
          <img src=${item.strMealThumb} alt=${item.strMeal} class="photo" />
          <div class="item-info">
            <header>
              <h4>${item.strMeal}</h4>
            </header>
            <p>  </p>
            <button type ="button" class="more-details-btn" data-id ="${item.idMeal}" >More Details</button>
          </div>
        </article>`;
  });
  displayMenu = displayMenu.join("");
    sectionCenter.innerHTML = displayMenu;
}

function diplayUnaReceta(unaReceta) {
  let displayMenu = unaReceta.map(function (item) {
     sectionCenter.innerHTML= " "
     let ingredients = [];
          for (i = 1; i < 21; i++) {
            if (item[`strIngredient${i}`]) {
              let ingredient = item[`strIngredient${i}`];
              let measure = item[`strMeasure${i}`];
              ingredients.push(`<li>${ingredient}-${measure}</li>`);
            }
          }
    return `<article class="menu-item-grande">
          <div class="item-info">
            <header>
              <h3>${item.strMeal}</h3>
              <h4>${item.strArea}</h4>
            </header>
            <img src=${item.strMealThumb} alt=${item.strMeal} class="photomax" />
              <li class="card-meal"> Ingredients
              <ul>${ingredients.join("")}</ul>
              </li>
              <li class="card-meal"> Instructions</li>
              <p>${item.strInstructions}</p>
          </div>
        </article>`;
  });
  displayMenu = displayMenu.join("");
  sectionCenter.innerHTML = displayMenu;
}