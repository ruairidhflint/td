import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { BsCircle, BsFillCheckCircleFill } from "react-icons/bs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import "./App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<string | null>("loading");

  const toggleModal = () => {
    setModal(!modal);
  };

  const clearCompletedTodos = async () => {
    const completed = todos.filter((x) => x.completed);
    const notCompleted = todos.filter((x) => !x.completed);
    const ids = completed.map((x) => x.id);

    if (!ids.length) {
      return;
    }

    setTodos(notCompleted);
    try {
      await axios.post(
        "/.netlify/functions/clearRecords",
        JSON.stringify(ids),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch {
      toast.error("Error clearing tasks", { position: "bottom-center" });
    }
  };

  const addNewTodo = (input: string) => {
    setLoading("posting");
    axios
      .post(
        "/.netlify/functions/addNewRecord",
        JSON.stringify({ todo: input }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => setTodos([res.data, ...todos]))
      .catch(() =>
        toast.error("Error creating task", { position: "bottom-center" })
      )
      .finally(() => {
        setInput("");
        setModal(false);
        setLoading(null);
      });
  };

  const toggleCompleteState = async (id: string) => {
    const current = todos.find((x) => x.id === id)?.completed;
    const updated = todos.map((x: Todo) => {
      if (x.id === id) {
        return { ...x, completed: !current };
      }

      return x;
    });
    setTodos(updated);
    try {
      await axios.post(
        "/.netlify/functions/changeCompletedStatus",
        JSON.stringify({ id, completed: JSON.stringify(!current) }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch {
      toast.error("Error updating task", { position: "bottom-center" });
    }
  };

  const closeModalWithEscapeKey = useCallback((event: { key: string }) => {
    if (event.key === "Escape") {
      setModal(false);
      setInput("");
    }
  }, []);

  useEffect(() => {
    axios
      .get("/.netlify/functions/getRecords")
      .then((res) => {
        setTodos(res.data);
        setLoading(null);
      })
      .catch(() =>
        toast.error("Error retrieving tasks", { position: "bottom-center" })
      );

    return () => {};
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", closeModalWithEscapeKey, false);
    return () =>
      document.removeEventListener("keydown", closeModalWithEscapeKey, false);
  }, []);

  if (loading === "loading") {
    return (
      <div
        className="max-w-[650px] my-0 mx-auto 
  mt-[50px] flex justify-center"
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="max-w-[650px] my-0 mx-auto 
    mt-[50px] px-[25px]"
    >
      {modal && (
        <NewTodoModal
          input={input}
          setInput={setInput}
          addNewTodo={addNewTodo}
          loading={loading}
        />
      )}
      <MenuArea
        clearCompletedTodos={clearCompletedTodos}
        toggleModal={toggleModal}
      />
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
      <Toaster
        toastOptions={{
          error: {
            icon: undefined,
            style: {
              background: "#F47174",
              color: "#fff",
              width: "300px",
              fontSize: "1rem",
              padding: "0.5rem",
            },
          },
        }}
      />
    </div>
  );
}

export default App;

function MenuArea({
  toggleModal,
  clearCompletedTodos,
}: {
  toggleModal: () => void;
  clearCompletedTodos: () => void;
}) {
  return (
    <div className="flex justify-between items-center h-[100px] border-solid border-b-2 border-slate-100 mx-3">
      <button
        type="button"
        className="inline-block px-6 py-2.5 bg-red-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-500 hover:shadow-lg focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-500 active:shadow-lg transition duration-100 ease-in-out"
        onClick={clearCompletedTodos}
      >
        Clear
      </button>
      <button
        type="button"
        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-100 ease-in-out"
        onClick={toggleModal}
      >
        Add New Task
      </button>
    </div>
  );
}

interface Todo {
  id: string;
  completed: boolean;
  todo: string;
  toggle: (id: string) => void;
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

function NewTodoModal({
  input,
  setInput,
  addNewTodo,
  loading,
}: {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  addNewTodo: (input: string) => void;
  loading: string | null;
}) {
  const handleForm = (e: any) => {
    e.preventDefault();
    addNewTodo(input);
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto min-w-[90%] md:min-w-[60%]">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <form className="w-full px-6 py-8" onSubmit={handleForm}>
              <div className="flex items-center border-b border-blue-600 py-2">
                <input
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  placeholder="Add new task"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                />
                <button
                  className="bg-blue-600 hover:bg-blue-800 border-blue-600 hover:border-blue-800 text-sm border-4 text-white py-1 px-6 rounded disabled:opacity-20"
                  type="submit"
                  disabled={loading === "posting"}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

function Spinner() {
  return (
    <svg
      role="status"
      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-blue-200 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
}
