const button = document.getElementById("buttonBuscar");
const buttonBusquedaEspecifica = document.getElementById(
  "buttonBusquedaEspecifica"
);
const buttonGenerarPelicula = document.getElementById("buttonGenerarPelicula");

const inputTextField = document.getElementById("inputTextField");

button.addEventListener("click", function (e) {
  // realizar la busqueda y generar la lista
  fetch("/peliculas/" + "?inputText=" + inputTextField.value, {
    method: "GET",
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Request failed.");
    })
    .then((data) => {
      clearSearchDescription(), showMovie(data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

buttonBusquedaEspecifica.addEventListener("click", function (e) {
  // realizar la busqueda y generar la lista
  fetch("/peliculas-especificas", {
    method: "GET",
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Request failed.");
    })
    .then((data) => {
      showSearchDescription(), showMovie(data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

buttonGenerarPelicula.addEventListener("click", function (e) {
  // realizar la busqueda y generar la pelicula
  fetch("/peliculas-random", {
    method: "GET",
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Request failed.");
    })
    .then((data) => {
      jsonPeliculaGenerada = generatePeliculaRandom(data);
      postPeliculaGenerada(jsonPeliculaGenerada);
      clearSearchDescription();
      showPeliculaGenerada(jsonPeliculaGenerada);
    })
    .catch(function (error) {
      console.log(error);
    });
});

const generatePeliculaRandom = (data) => {
  let title, year, fullplot, poster, cast;
  title = "TADW Presenta : " + data[0].title;
  year = data[4].year;
  fullplot = data[1].fullplot;
  poster = data[3].poster;
  cast = data[2].cast;

  let jsonPeliculaGenerada = [
    {
      title: title,
      year: year,
      fullplot: fullplot,
      poster: poster,
      cast: cast,
    },
  ];

  return jsonPeliculaGenerada;
};

const postPeliculaGenerada = (item) => {
  fetch("/peliculas", {
    method: "POST",
    body: item,
  }).then(function (response) {
    if (!response.ok) {
      throw new Error("Request failed.");
    }
  });
};

const showMovie = (data) => {
  let lista = "";
  data.forEach((peli) => {
    lista =
      lista +
      '<div class="item_pelicula">' +
      "<p id='item_pelicula_title' class='item_pelicula_desc'>" +
      peli.title +
      "</p>" +
      "<p class='item_pelicula_desc'>" +
      "Estrenada en : " +
      peli.year +
      "</p>" +
      "<p class='item_pelicula_desc'>" +
      "Rating IMDB : " +
      peli.imdb +
      "</p>" +
      "<p class='item_pelicula_desc'>" +
      "Rating Tomatoes : " +
      peli.tomatoes +
      "</p>" +
      "<p class='item_pelicula_desc'>" +
      "Rating Metacritic : " +
      peli.metacritic +
      "</p>" +
      "<p class='item_pelicula_desc'>" +
      '<img class="item_pelicula_poster" src="' +
      peli.poster +
      '">' +
      "</p>" +
      "</div>";
  });
  const divRes = document.getElementById("resultados");
  divRes.innerHTML = lista;
  return;
};

const showSearchDescription = () => {
  desc =
    "<h1 class='search-description__text'>Peliculas en las que aparecen o bien Johnny Depp o Brad Pitt, y o bien en el titulo aparece la palabra Club o en el plot la palabra Man, estrenada despues de 1990 y con un rating IMDB mayor a 6.</h1>";
  const divDesc = document.getElementById("search-description");
  divDesc.innerHTML = desc;
  return;
};

const clearSearchDescription = () => {
  const divDesc = document.getElementById("search-description");
  divDesc.innerHTML = "";
  return;
};

const showPeliculaGenerada = (jsonPeliculaGenerada) => {
  const peli = jsonPeliculaGenerada[0];
  const divDesc = document.getElementById("resultados");
  desc =
    '<div class="item_pelicula">' +
    "<p> <b>SE AGREGO LA PELICULA :</b> </p>" +
    "<p id='item_pelicula_title' class='item_pelicula_desc'>" +
    peli.title +
    "</p>" +
    "<p class='item_pelicula_desc'>" +
    "Estrenada en : " +
    peli.year +
    "</p>" +
    "<p class='item_pelicula_desc'>" +
    "Plot : " +
    peli.fullplot +
    "</p>" +
    "<p class='item_pelicula_desc'>" +
    "Actores : " +
    peli.cast +
    "</p>" +
    "<p class='item_pelicula_desc'>" +
    '<img class="item_pelicula_poster" src="' +
    peli.poster +
    '">' +
    "</p>" +
    "</div>";

  divDesc.innerHTML = desc;
};

const clearPeliculaGenerada = () => {
  const divDesc = document.getElementById("action-description");
  divDesc.innerHTML = "";
};
