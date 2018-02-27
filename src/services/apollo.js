import ApolloClient from 'apollo-boost'

const apollo = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI
})

export default apollo
