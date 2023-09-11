const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// create the connection to database
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  database : 'delta_app2',
  password : 'Pocophonef1@'
});


let getRandomUser = () => {
  return [ 
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
};

// let q = "INSERT INTO user2(id,username,email,password)VALUES ?";

// let data1 = [];
// for(let i = 1; i <= 100; i++){
//   console.log(getRandomUser());
//   data1.push(getRandomUser());
// }

// try {
//   connection.query(q, [data1], (err, result)=>{
//     if(err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

// connection.end();

//show count of users
app.get("/", (req, res)=>{
  let q = `SELECT count(*) FROM user2`;
  try {
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let count = (result[0]["count(*)"]);
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some err in DB");
  }
})

//to show all the users
app.get("/users",(req, res) =>{
  let q = `SELECT * FROM user2`;
  try {
    connection.query(q, (err, result) =>{
      if(err) throw err;
      let data = result;
      console.log(data);
      res.render("users.ejs", { result });
    });
  } catch (error) {
    res.send("some err occured");
  }
});

//edit username 
app.get("/users/:id/edit",(req,res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user2 WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) =>{
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", {  user });
    });
  } catch (error) {
    res.send("some err occured");
  }
});

//update username in DB
app.patch("/users/:id", (req,res)=> {
  let { id } = req.params;
  let { username : newUsername, password : formPass } = req.body;
  let q = `SELECT * FROM user2 WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) =>{
      if(err) throw err;
      let user = result[0];
      if(formPass != user.password) res.send(user);
      else{
        let q2 = `UPDATE user2 SET username = '${newUsername}' WHERE  id = '${id}'`;
        connection.query(q2, (err, result) =>{
          if(err) throw err;
          res.redirect("/users");
        })
      }
    });
  } catch (error) {
    res.send("some err occured");
  }
});

//add a new user
app.get("/users/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/users/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user2 (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/users");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

//to delete a user by id
app.get("/users/:id/delete", (req,res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user2 WHERE id= '${id}'`;
  try {
    connection.query(q, (err,result) => {
      if(err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some err in db");
  }
app.delete("/users/:id/", (req,res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user2 WHERE id= '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];

      if(user.password != password) res.send("Wrong Password!");
      else{
        let q2 = `DELETE FROM user2 WHERE id='${id}'`;//query to delete
        connection.query(q2, (err, result) => {
          if(err) throw err;
          else{
            console.log(result);
            console.log("Deleted!");
            res.redirect("/users");
          }
        });
      }
    });
  } catch (err) {
    res.send("Some err occured");
  }
});
});
app.listen("8080", ()=>{
  console.log("server is listening to port 8080");
});