const { MongoClient, ObjectId } = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017";
const dbName = "peliculas";

let db;

const init = () =>
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then(
    (client) => {
      db = client.db(dbName);
    }
  );

const insertItem = (item) => {
  const collection = db.collection("movies");
  return collection.insertOne(item);
};

const getPelis = (term) => {
  const filter = {
    $or: [
      { title: { $regex: term } },
      { fullplot: { $regex: term } },
      { cast: { $in: [term] } },
    ],
  };
  const projection = {
    title: 1,
    _id: 0,
    year: 1,
    imdb: 1,
    tomatoes: 1,
    metacritic: 1,
    poster: 1,
  };
  const coll = db.collection("movies");
  const cursor = coll.find(filter, { projection });
  const result = cursor.toArray();
  return result;
};

const getPelisEspecificas = () => {
  // hardcodeado: peliculas en las que aparecen o bien Johnny Depp o
  // Brad Pitt, y o bien en el titulo aparece la palabra Club o en el plot Man,
  // estrenada despues de 1990 y con un rating imdb mayor a 6.
  const filter = {
    $and: [
      {
        $or: [
          { cast: { $in: ["Brad Pitt"] } },
          { cast: { $in: ["Johnny Depp"] } },
        ],
      },
      {
        $or: [{ title: { $regex: /Club/ } }, { fullplot: { $regex: /Man/ } }],
      },
    ],
    year: { $gt: 1990 },
    "imdb.rating": { $gt: 6 },
  };
  const projection = {
    title: 1,
    _id: 0,
    year: 1,
    imdb: 1,
    tomatoes: 1,
    metacritic: 1,
    poster: 1,
  };
  const coll = db.collection("movies");
  const cursor = coll.find(filter, { projection });
  const result = cursor.toArray();
  return result;
};

const getPeliculasRandom = () => {
  const projection = {
    title: 1,
    _id: 0,
    year: 1,
    imdb: 1,
    tomatoes: 1,
    metacritic: 1,
    poster: 1,
    fullplot: 1,
    cast: 1,
  };
  const coll = db.collection("movies");
  const cursor = coll.aggregate(
    [
      {
        $sample: {
          size: 5,
        },
      },
    ],
    { projection }
  );
  const result = cursor.toArray();
  return result;
};

module.exports = {
  init,
  insertItem,
  getPelis,
  getPelisEspecificas,
  getPeliculasRandom,
};
