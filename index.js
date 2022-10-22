import express from 'express'
import fetch from 'node-fetch'
import bcrypt from 'bcrypt'
import cors from 'cors'

/*

Two APIs SignIn and SignUp
Hasura GraphQL Engine is used for the project so you dont need to add a DB its already in cloud
The passwords are hashed and stored in DB
The Registration Number should be 15 character or more
The cloud table is empty so please add some data using signUp function to check all edge cases

*/



/*

Seems like I did too much for a simple login page but It seemed too easy so here it is!!!! Hope U Like it

*/

var app = express();
app.use(express.json());
app.use(cors());

var URL = "https://white-vulpes.hasura.app/v1/graphql";

app.post('/SignIn', async (req, res) => {
  let query = `query MyQuery($registration_id: String!) {
                SimpleLoginPage_students(where: {registration_id: {_eq: $registration_id}}) {
                  name
                  registration_id
                  password
                }
              }`;
  let variables = {registration_id: req.body.id};
  let result = await fetcher(query, variables);
  try{
    if(result.data != null && result.data.SimpleLoginPage_students.length <= 0 ){
      res.status(400).json({errors: 'Wrong User iD'});
    }
    else if(result.data != null && result.data.SimpleLoginPage_students[0].registration_id === req.body.id){
      if(await bcrypt.compare(req.body.password, result.data.SimpleLoginPage_students[0].password).then((result) => {return result;})) res.status(200).json(result.data.SimpleLoginPage_students[0]);
      else res.status(400).json({errors: 'Wrong Password'});
    }
    else{
      res.status(400).json(result.errors);
    }
  }catch(e){
    res.status(400).json({errors: e.message});
  }
})

app.post('/SignUp', async (req, res) => {
  let query = `mutation MyMutation($name: String = "", $password: String = "", $registration_id: String = "") {
                insert_SimpleLoginPage_students(objects: {name: $name, registration_id: $registration_id, password: $password}) {
                  affected_rows
                }
              }`;
  req.body.password = await bcrypt.hash(req.body.password, 10).then((hash) => {
    return hash;
  })
  let variables = {name: req.body.name, password: req.body.password, registration_id: req.body.id};
  let result = await fetcher(query, variables);
  try{
    if(result.data != null && result.data.insert_SimpleLoginPage_students.affected_rows >= 1){
      res.status(200).json(result.data.insert_SimpleLoginPage_students);
    }
    else{
      res.status(400).json(result.errors);
    }
  }catch(e){
    res.status(400).json({message: e.message});
  }
})

var fetcher = async (query, variables) => {
  var result = await fetch(URL,{method: 'POST',headers: {'content-type':'application/json', 'x-hasura-admin-secret':'SimpleLoginPageDuhh'},body: JSON.stringify({query:query, variables:variables})}).then((response) => response.json()).then((user) => { return user;});
  return result;
}

app.listen(3981,'127.0.0.1', () => {console.log("Server Running on 3981")})