import { useState, useEffect } from "react";
import { BsCircle, BsFillCheckCircleFill } from "react-icons/bs";
import axios from "axios";

import "./App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const toggleCompleteState = async (id: number) => {
    const current = todos.find((x) => x.id === id)?.completed;
    const updated = todos.map((x: Todo) => {
      if (x.id === id) {
        return { ...x, completed: !current };
      }

      return x;
    });
    setTodos(updated);
    await axios.post(
      "/.netlify/functions/changeCompletedStatus",
      JSON.stringify({ id, completed: JSON.stringify(!current) }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  useEffect(() => {
    axios.get("/.netlify/functions/getRecords").then((res) => {
      setTodos(res.data);
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
          <TodoItem
            completed={todo.completed}
            id={todo.id}
            toggle={toggleCompleteState}
            todo={todo.todo}
            key={todo.id}
          />
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
  completed: boolean;
  todo: string;
  toggle: (id: number) => void;
}

function TodoItem({ completed, todo, toggle, id }: Todo) {
  return (
    <div
      onClick={() => toggle(id)}
      className="flex items-center py-[20px] border-solid border-b-2 border-slate-100 mx-3 text-slate-800 "
    >
      <div className={`w-[5%] ${completed && "opacity-25"}`}>
        {completed ? <BsFillCheckCircleFill /> : <BsCircle />}
      </div>
      <p
        className={`pl-2 w-[95%] ${
          completed && "opacity-25 line-through"
        } cursor-pointer`}
      >
        {todo}
      </p>
    </div>
  );
}
