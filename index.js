const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: 3, title: '1984', author: 'George Orwell' },
  { id: 4, title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { id: 5, title: 'Animal Farm', author: 'George Orwell' },
];

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
    updateBook(id: ID!, title: String, author: String): Book
    deleteBook(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    addBook: (_, { title, author }) => {
      const book = { id: books.length + 1, title, author };
      books.push(book);
      return book;
    },
    updateBook: (_, { id, title, author }) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex === -1) {
        throw new Error("Book not found.");
      }
      const book = books[bookIndex];
      books[bookIndex] = {
        ...book,
        title: title || book.title,
        author: author || book.author,
      };
      return books[bookIndex];
    },
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex === -1) {
        throw new Error("Book not found.");
      }
      books.splice(bookIndex, 1);
      return true;
    },
  },
};



const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.start().then(res => {
  server.applyMiddleware({ app });
  app.listen({ port: 3000 }, () =>
      console.log('Now browse to http://localhost:3000' + server.graphqlPath)
  )
 })