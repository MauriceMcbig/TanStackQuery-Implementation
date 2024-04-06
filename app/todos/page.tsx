'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const Todos = () => {
  const queryClient = useQueryClient();
  const mutation: any = useMutation<any>({
    mutationFn: (newTodo) => {
      return axios.post('http://localhost:3000/todos', newTodo);
    },
    onMutate: (variables) => {
      console.log('mutation happeneing ');
    },
    onError: (error, variables, context) => {
      console.log('error', error.message);
    },
    onSuccess: (data, variables, context) => {
      console.log('Success', data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const { data: todosData } = useQuery<any>({
    queryKey: ['todos'],
    queryFn: () =>
      fetch('http://localhost:3000/todos').then((res) => res.json()),
    // select: (todos) =>
    //   todos.map((todo: any) => ({ id: todo.id, title: todo.title })),
  });

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      {mutation.isPending ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Drink Wine' });
            }}>
            Create Todo
          </button>
        </>
      )}

      <h1 className='text-xl'>Todos</h1>
      <div className='flex flex-col gap-2'>
        {todosData?.slice(0, 5).map((todo: any) => (
          <div className='flex' key={todo.id}>
            <h2>{' ' + todo.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
