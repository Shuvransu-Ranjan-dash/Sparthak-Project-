const { ApolloServer, gql } = require("apollo-server");

let todos = [{ id: "1", title: "Learn GraphQL", completed: false }];

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
  }

  type Mutation {
    addTodo(title: String!): Todo!
    updateTodo(id: ID!, title: String, completed: Boolean): Todo
    deleteTodo(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
    todo: (_, { id }) => todos.find((todo) => todo.id === id),
  },

  Mutation: {
    addTodo: (_, { title }) => {
      const newTodo = {
        id: String(todos.length + 1),
        title,
        completed: false,
      };
      todos.push(newTodo);
      return newTodo;
    },

    updateTodo: (_, { id, title, completed }) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return null;

      if (title !== undefined) todo.title = title;
      if (completed !== undefined) todo.completed = completed;

      return todo;
    },

    deleteTodo: (_, { id }) => {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return false;

      todos.splice(index, 1);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(` GraphQL Server ready at ${url}`);
});
