const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLFloat
    
} = graphql

//types
// Scaler Type
/* 
String = GraphQLString
int
Float
Boolean
ID
 */

const Person = new GraphQLObjectType({
    name:'Person',
    description:'Represent a Person Type',
    fields: () =>({
        id:{type:GraphQLID},
        name:{type: new GraphQLNonNull(GraphQLString)},
        age:{type:new GraphQLNonNull(GraphQLInt)},
        isMarried:{type: GraphQLBoolean},
        gpa:{type:GraphQLFloat},

        justAType:{
            type: Person,
            resolve(parent, args){
                return parent;
            }
        }
    })
})

// RootQuery

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description:'Description',
    fields:{
       person: {
        type: Person,
        //args:{id{type:GraphQLString},
        resolve(parent, args){
//we resolve with data
//get and return data from datasourse

let personObj = {
    //id:{type:GraphQLID},
    name:null,
    age:'16',
    isMarried:true,
    gpa: 4.0
}
return personObj


        }
        }}
       }

)


    module.exports = new GraphQLSchema({
        query: RootQuery,
        
    })