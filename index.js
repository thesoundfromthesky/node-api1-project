const express = require("express");
const db = require("./data/db");
// implement your API here
// Inside `index.js` add the code necessary to implement the following _endpoints_:

// | Method | URL            | Description                                                                                                                       |
// | ------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.                                                              |
// | GET    | /api/users     | Returns an array of all the user objects contained in the database.                                                               |
// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                                                  |
// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                                            |
// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. |
const server = express();
const port = 8000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// | GET    | /api/users     | Returns an array of all the user objects contained in the database.
// When the client makes a `GET` request to `/api/users`:

// - If there's an error in retrieving the _users_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The users information could not be retrieved." }`.
server.get("/api/users", (req, res) => {
  db.find().then(users => {
    if (!users) {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    } else {
      res.status(200).json(users);
    }
  });
});

// | GET    | /api/users/:id | Returns the user object with the specified `id`.
// When the client makes a `GET` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If there's an error in retrieving the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user information could not be retrieved." }`.
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." })
    );
});

// ```js
// {
//   name: "Jane Doe", // String, required
//   bio: "Not Tarzan's Wife, another Jane",  // String, required
//   created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//   updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
// }
// ```
// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.
// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide name and bio for the user." }`.

// - If the information about the _user_ is valid:

//   - save the new _user_ the the database.
//   - respond with HTTP status code `201` (Created).
//   - return the newly created _user document_.

// - If there's an error while saving the _user_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ errorMessage: "There was an error while saving the user to the database" }`.
server.post("/api/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(req.body)
      .then(obj => {
        const id = obj.id;
        db.findById(id).then(user => {
          res.status(201).json(user);
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
});

// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from
// the `request body`. Returns the modified document, **NOT the original**. |

// When the client makes a `PUT` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide name and bio for the user." }`.

// - If there's an error when updating the _user_:

//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user information could not be modified." }`.

// - If the user is found and the new information is valid:

//   - update the user document in the database using the new information sent in the `request body`.
//   - respond with HTTP status code `200` (OK).
//   - return the newly updated _user document_.
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.name || !body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, body)
      .then(id => {
        db.findById(id).then(user => {
          if (!user) {
            res.status(404).json({
              message: "The user with the specified ID does not exist."
            });
          } else {
            res.status(200).json(user);
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
});

// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.
// When the client makes a `DELETE` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If there's an error in removing the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user could not be removed" }`.
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id).then(user => {
    if (!user) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      db.remove(id)
        .then(id => {
          res.sendStatus(204);
        })
        .catch(err => {
          res
            .status(500)
            .json({ errorMessage: "The user could not be removed" });
        });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
