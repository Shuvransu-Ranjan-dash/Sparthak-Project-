import React, { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  gql,
} from '@apollo/client';

/* =========================
   Apollo Client Setup
========================= */

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

/* =========================
   GraphQL Queries & Mutations
========================= */

const GET_TODOS = gql`
  query {
    todos {
      id
      title
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation ($title: String!) {
    addTodo(title: $title) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation ($id: ID!, $completed: Boolean!) {
    updateTodo(id: $id, completed: $completed) {
      id
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation ($id: ID!) {
    deleteTodo(id: $id)
  }
`;

/* =========================
   Todo App Component
========================= */

const TodoApp: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TODOS);

  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const [title, setTitle] = useState('');

  const handleAdd = async () => {
    if (!title.trim()) return;

    await addTodo({
      variables: { title },
      refetchQueries: [{ query: GET_TODOS }],
    });

    setTitle('');
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await updateTodo({
      variables: { id, completed: !completed },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };

  const handleDelete = async (id: string) => {
    await deleteTodo({
      variables: { id },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>📝 GraphQL Todo App</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add todo"
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {data.todos.map((todo: any) => (
          <li key={todo.id} style={{ marginBottom: '8px' }}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.title}
            </span>

            <button
              style={{ marginLeft: '10px' }}
              onClick={() => handleToggle(todo.id, todo.completed)}
            >
              {todo.completed ? 'Undo' : 'Done'}
            </button>

            <button
              style={{ marginLeft: '5px', color: 'red' }}
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* =========================
   App Wrapper
========================= */

const AppWrapper: React.FC = () => (
  <ApolloProvider client={client}>
    <TodoApp />
  </ApolloProvider>
);

export default AppWrapper;
