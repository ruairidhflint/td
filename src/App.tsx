import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { MenuArea } from "./components/MenuArea";
import { TodoItem } from "./components/TodoItem";
import { NewTodoModal } from "./components/NewTodoModal";
import { Spinner } from "./components/Spinner";
import "./App.css";

function App(): JSX.Element {
  const [todos, setTodos] = useState<any[]>([]);
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
    const updated = todos.map((x) => {
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
