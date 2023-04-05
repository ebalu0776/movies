const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "moviesData.db");

const app = express();
app.use(express.json());

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer(); 

const convertDbObjectToResponseObject = (dbObject)=>{
    return {
        movieId:dbObject.movie_id,
        directorId:dbObject.director_id,
        movieName:dbObject.movie_name,
        leadActor:dbObject.lead_actor,
    };
};

//get all movies list

app.get("/movies/", async (request, response) => {
  const getAllMovies = ` 
    SELECT * FROM movie;
    `;
  const moviesQuery = await db.all(getAllMovies);
  response.send(moviesQuery.map(eachMovie)=>
      convertDbObjectToResponseObject(eachMovie);
  );
});
module.exports = app;
