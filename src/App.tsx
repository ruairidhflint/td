import { useState, useEffect } from 'react';
import { BsCircle, BsFillCheckCircleFill } from 'react-icons/bs';
import axios from 'axios';

import './App.css';

const dummyData: any[] = [
  { id: 1, complete: false, todo: 'Clippers on beard' },
  { id: 2, complete: false, todo: 'Shave' },
  { id: 3, complete: false, todo: 'Find shirt' },
  { id: 4, complete: false, todo: 'Clean/Sort Trousers/Outfit for tomorrow' },
  { id: 5, complete: false, todo: 'Pack bag for tomorrow' },
];

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const toggleCompleteState = (id: number) => {
    const updated = todos.map((x: Todo) => {
      if (x.id === id) {
        return { ...x, complete: !x.complete };
      }

      return x;
    });
    setTodos(updated);
  };

  useEffect(() => {
    axios.get('/.netlify/functions/hello-world').then((res) => {
      setTodos(res.data.data);
    });
  }, []);

  return (
    <div
      className="w-[600px] my-0 mx-auto 
    mt-[50px]"
    >
      <MenuArea />
      <div className="flex flex-col">
        {todos.map((todo) => (
          <TodoItem complete={todo.complete} id={todo.id} toggle={toggleCompleteState} todo={todo.todo} key={todo.id} />
        ))}
      </div>
    </div>
  );
}

export default App;

function MenuArea() {
  return (
    <div className="flex justify-end items-center h-[80px] border-solid border-b-2 border-slate-100 mx-3">
      <button
        type="button"
        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-100 ease-in-out"
      >
        + Add New Task
      </button>
    </div>
  );
}

interface Todo {
  id: number;
  complete: boolean;
  todo: string;
  toggle: (id: number) => void;
}

function TodoItem({ complete, todo, toggle, id }: Todo) {
  return (
    <div
      onClick={() => toggle(id)}
      className="flex items-center py-[20px] border-solid border-b-2 border-slate-100 mx-3 text-slate-800 "
    >
      <div className={`w-[5%] ${complete && 'opacity-25'}`}>{complete ? <BsFillCheckCircleFill /> : <BsCircle />}</div>
      <p className={`pl-2 w-[95%] ${complete && 'opacity-25 line-through'} cursor-pointer`}>{todo}</p>
    </div>
  );
}
