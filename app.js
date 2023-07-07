const express = require ('express');
const {graphqlHTTP} = require('express-graphql');
require('dotenv').config();



const schema = require('./server/schema/schema');
//const testSchema = require('./server/schema/types_schema');
const mongoose = require("mongoose")

const app = express(); // instantiation
const port = process.env.port || 4000;

//app.use(cors());

app.use('/graphql', graphqlHTTP({
    graphiql : true,
    schema:schema
}))
//console.log(process.env.ss);
//console.log(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.xqxanft.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`);
mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.xqxanft.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,
{useNewUrlParser:true, useUnifiedTopology:true})
.then(() =>{
    app.listen({port:port}, () =>{ //localhost:4000
        console.log('Listening for requests on my awesome port ' + port);
    })
}).catch((e) =>console.log("Error:::" + e))

