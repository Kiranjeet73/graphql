const graphql = require('graphql');
var _ = require('lodash');
const User =  require("../model/user");
const Post =  require("../model/post");
const Hobby =  require("../model/hobby");
const user = require('../model/user');

//dummy data
var userData =[
    {id:'1', name:'Kiran', age:26, profession:'Developer'},
    {id:'126', name:'Parminder', age:28, profession:'Accontant'},
    {id:'156', name:'Davinder', age:24, profession:'Ilets'},
    {id:'134', name:'Kulwant', age:29, profession:'Engineer'},
    {id:'167', name:'Simranjeet', age:28, profession:'Software Developer'},
    {id:'112', name:'Beant', age:32, profession:'Broker'},
]

var hobbiesData = [
    {id:'1', title:'Programming', description:'Using computer to make world a better place', userId:'1'},
    {id:'2', title:'Cooking', description:'Preparing new dishes', userId:'126'},
    {id:'3', title:'reading', description:'Reading books to enhance knowledge', userId:'156'},
    {id:'4', title:'Swimming', description:'Get in the water and learn to become swimmer', userId:'134'},
    {id:'5', title:'Hiking', description:'Wear hinking shoes and explore the world', userId:'112'},
    
]

var postData = [
    {id:'1', Comment:'Builing a mind', userId:'1'},
    {id:'2', Comment:'GraphQl is amazing' , userId:'126'},
    {id:'3', Comment:'How to change world',  userId:'167'},
    {id:'4', Comment:'How to change world' , userId:'1'},
    {id:'5', Comment:'How to change world' , userId:'1'},
]

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    findByIdAndUpdate
} = graphql


//create types
const UserType = new GraphQLObjectType({
    name:'User',
    description:'Documentaion for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type:GraphQLString},

// graphQl list - making a relationship between users, posts and hobbies
        posts:{
            type:new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find({userId:parent.id});
                //return  _.filter(postData, {userId: parent.id});
            }
        },

        hobbies:{
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find({userId: parent.id});
                //return _.filter(hobbiesData, {userId: parent.id});
            }
        }
    })

});

const HobbyType = new GraphQLObjectType({
    name:'Hobby',
    description:'Hobby Description ',
    fields: () =>({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type:GraphQLString},
        user:{
            type:UserType,
            resolve(parent, args){
                return Hobby;
                //return _.find(userData, {id: parent.userId})
            }
        }
    })
});

//post type(id, comment)
 const PostType = new GraphQLObjectType({
    name: 'Post',
    description:'Post Description',
    fields: () =>({
        id: {type:GraphQLID},
        Comment: {type: GraphQLString},
        user:{
            type:UserType,
            resolve(parent, args){
                return Post;

               // return _.find(userData, {id: parent.userId})
            }
        }

    })
 })

// RootQuery

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description:'Description',
    fields:{
        user:{
            type:UserType,
            args:{id:{type:GraphQLString}},

            resolve(parent, args){
                  return User.findById(args.id)
                // we resolve with data
                //get and return data from datasource
            }
        },
// return all the users
        users:{
            type:new GraphQLList(UserType),
            resolve(parent, args){
                return User.find();
            }
        },

         hobby:{
            type: HobbyType,
            args: {id:{type: GraphQLID}},

            resolve(parent, args){
                //return data for our hobby
                return Hobby.findById(args.id)
            }
        },
//return all hobbies
        hobbies:{
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find();
            }
        },

        post: {
            type:PostType,
            args: {id:{type: GraphQLID}},

            resolve(parent, args){
                //return data  (post data)
                return Post.findById(args.id)
            }
           },
// return all the posts
        posts:{
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find();
            }
        },
    }
});

//Mutations

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        createUser:{
            type:UserType,
            args:{
               // id:{type:GraphQLID}
               name:{type:new  GraphQLNonNull(GraphQLString)},
               age:{type:new  GraphQLNonNull(GraphQLInt)},
               profession:{type:GraphQLString}
            },
            resolve(parent, args){
                let user = User({
                    name:args.name,
                    age:args.age,
                    profession:args.profession
                })
                return user.save();
            }
        },

        //Update User
        UpdateUser:{
            type:UserType,
            args: {
                id:{type: new GraphQLNonNull(GraphQLString)},
                name:{type:new  GraphQLNonNull(GraphQLString)},
                age:{type:new  GraphQLNonNull(GraphQLInt)},
                profession:{type:GraphQLString}
            },
            resolve(parent, args){
                return (updateUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name:args.name,
                            age:args.age,
                            profession:args.profession
                        }
                    },
                    {new: true} // send back a update object
                ))
            }

        },

        // Remove User
        RemoveUser:{
            type:UserType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedUser = User.findByIdAndRemove(args.id).exec()
                if (!removedUser){
                    throw new "Error"();
                }else{
                    return removedUser;
                }
            }

        },

        // CreatePost
        createPost:{
            type:PostType,
            args:{
                  // id:{type:GraphQLID}
                Comment:{type:new  GraphQLNonNull(GraphQLString)},
                userId:{type:new  GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let post = Post({
                    Comment:args.Comment,
                    userId:args.userId
                })
                return post.save();
            }
        },
        // Remove Post 
        RemovePost:{
            type:PostType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedPost = User.findByIdAndRemove(args.id).exec()
                if (!removedPost){
                    throw new "Error"();
                }else{
                    return removedPost;
                }
            }

        },

        // Update Post
        UpdatePost: {
            type:PostType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                Comment:{type:new  GraphQLNonNull(GraphQLString)},
                
            },
            resolve(parent, args){
                return (updatePost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            Comment:args.Comment
                        }
                    },
                    {new: true}
                ))
            }

        },

        // Remove Hobby

        RemoveHobby:{
            type:HobbyType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedHobby = User.findByIdAndRemove(args.id).exec()
                if (!removedHobby){
                    throw new "Error"();
                }else{
                    return removedHobby;
                }
            }

        },

        // CreateHobby

        createHobby:{
            type:HobbyType,
            args:{
                // id:{type:GraphQLID}
                title:{type:new  GraphQLNonNull(GraphQLString)},
                description:{type:new  GraphQLNonNull(GraphQLString)},
                userId:{type:new  GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let hobby = Hobby({
                    title:args.title,
                   description:args.description,
                   userId:args.userId
                })
                return hobby.save();
            }
        },

        // Update Hobby
        UpdateHobby:{
            type:HobbyType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
                title:{type:new  GraphQLNonNull(GraphQLString)},
                description:{type:new  GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return (updateHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            title: args.title,
                            description: args.description
                        }
                    },
                    {new:true}
                ))
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})