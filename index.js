const express = require("express");

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

server.get("/api/users", (res, req) => {});
server.get("/api/users/:id", (res, req) => {});
server.post("/api/users", (res, req) => {});
server.put("/api/users/:id", (res, req) => {});
server.delete("/api/users/:id", (res, req) => {});

server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
