// ini centernya data diolah dimari
const graphql = require ('graphql');
// lodash sudah gak dibutuhkan karena pakai axios
// const _= require ('lodash');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema, //library inti dari schema yang ditaruh di root
    GraphQLList
} = graphql;

// 1 relasi ke tabel lain
const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ( {
        id: {type:GraphQLString},
        name: {type:GraphQLString},
        description: {type:GraphQLString},
        // resolving circular reference
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(res=>res.data);
            }
        }
    })
});


const UserType = new GraphQLObjectType({ //definisi
    // bagian ini ada 2 property
    // property
    name: 'User',
    // objek property
    fields: () => ({
        id:  {type: GraphQLString} ,
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        // ini relasinya
        company:{
            type: CompanyType,
            resolve(parentValue, args){
                console.log(parentValue,args);
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(res => res.data);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    // root ini berdasarkan id
    // beri saya id saya akan kembalikan ke UserType
    name : 'RootQueryType',
    fields:{
        user: {
            type: UserType,
            args:{id:{type:GraphQLString}},
            resolve(parentValue, args){ //actual data
                // return _.find(users,{id: args.id});
                // ganti pakai json server
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp=>resp.data); //{data: {firstName: "Rama"}}
                    // .then(response => console.log(response)) //{data: {firstName: "Rama"}}
            }
        },
        // untuk dapat melihat company langsung ditambahkan objek pada rootQuery
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp=>resp.data); 
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});