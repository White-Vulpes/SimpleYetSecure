import express from 'express'
import fetch from 'node-fetch'

var app = express()

//SingIn Function
app.get('/SignIn', async (req, res) => {

  var user = "xyz@gmail.com"
  var pass = "thefoxofawesomeness"                           //Dummy Data
  var URL = "https://set-mantis-52.hasura.app/v1/graphql"
  var query = JSON.stringify({query: `{
    Users_users_by_pk(Email_ID: "${user}") {
      Password
      Username
      Email_ID
    }
  }`});

 var data =  await fetcher(query);

 if(data.data.Users_users_by_pk == null){
   res.send("You entered wrong email and password");
 }
 else if(data.data.Users_users_by_pk.Password.toString() == pass.toString()){
   res.send("Congratulation You are Verified : " + data.data.Users_users_by_pk.Username);
 }
 else{
   res.send("You entered wrong Password")
 }
})

//SingUp Function
app.get('/SignUp', async (req, res) => {
  var username = "rutiyoqpwo";
  var password = "qwertyuiop";                       //Dummy Data
  var email = "HelloJi@gmail.com"

  var mutation_query = JSON.stringify({query: `mutation {
  insert_Users_users_one(object: {Email_ID: "${email}", Password: "${password}", Username: "${username}"}) {
    Email_ID
  }
}`});
  await fetcher(mutation_query);
  res.send("You Have been Registered");
})

//Function to fetch data from database
var fetcher = async (q) => {
  console.log(q);
  var result = await fetch(URL,{method: 'POST',headers: {'x-hasura-admin-secret':'DW89IumpsvS15P0oOyXmAaj2nrk1D31N6wMMqayJ6ZYU7yq8kpd3S3HtIBp0fQLl'},body: q}).then((response) => response.json()).then((user) => { return user;});
  console.log(result);
  return result;
}
app.listen(3981,() => {console.log("Server Running on 3981")})