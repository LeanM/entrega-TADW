const { response } = require("express");
const express = require("express");
const Joi = require("@hapi/joi");
const {
  insertItem,
  getPelis,
  getPelisEspecificas,
  getPeliculasRandom,
} = require("./db");

const router = express.Router();
const itemSchema = Joi.object({
  title: Joi.string(),
  fullplot: Joi.string(),
  year: Joi.string().required(),
  cast: Joi.string().allow(""),
  poster: Joi.string().allow(""),
});

router.get("/public", (req, res) => {
  res.sendFile(__dirname + "/public");
});

// Obtener las peliculas solicitadas
router.get("/peliculas/", (req, res) => {
  getPelis(req.query.inputText)
    .then((items) => res.json(generateItems(items)))
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

//ObtenerPeliculasBusquedaEspecifica
router.get("/peliculas-especificas", (req, res) => {
  getPelisEspecificas()
    .then((items) => res.json(generateItems(items)))
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

//Obtener 5 Peliculas Random
router.get("/peliculas-random", (req, res) => {
  getPeliculasRandom()
    .then((items) => res.json(generateItems(items)))
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

const generateItems = (items) => {
  items = items.map((item) => ({
    title: item.title,
    year: item.year,
    imdb: item.imdb.rating || "-",
    tomatoes: item.tomatoes?.critic?.rating || "-",
    metacritic: item.metacritic || "-",
    poster: item.poster || "",
    fullplot: item.fullplot || "-",
    cast: item.cast || "-",
  }));
  return items;
};

// Postear una pelicula
router.post("/peliculas", (req, res) => {
  let item = req.body;
  console.log(item);
  const result = itemSchema.validate;
  if (result.error) {
    console.log(result.error);
    res.status(400).end();
    return;
  }
  insertItem(item)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

module.exports = router;
