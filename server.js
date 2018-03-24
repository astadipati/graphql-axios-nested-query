const express = require ('express');
const expressGraphQL = require('express-graphql'); //handle graphql

const schema = require('./schema/schema'); //import schema

const app = express();

app.use('/graphql', expressGraphQL({
    schema, //panggil schema
    graphiql: true
}));

app.listen(4000,()=>{
    console.log('Listening port 4000');
});