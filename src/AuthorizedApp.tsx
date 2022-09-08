import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { MenuArea } from "./components/MenuArea";
import { TodoItem } from "./components/TodoItem";
import { NewTodoModal } from "./components/NewTodoModal";
import { Spinner } from "./components/Spinner";
import { Logout } from "./components/Logout";
import { Todo } from "../types";

function AuthorizedApp({ logout }: any): JSX.Element {
  const [todos, setTodos] = useState<any[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<string | null>("loading");

  const toggleModal = (): void => {
    setModal(!modal);
  };

  const clearCompletedTodos = async (): Promise<void> => {
    const completed: Todo[] = todos.filter((x) => x.completed);
    const notCompleted: Todo[] = todos.filter((x) => !x.completed);
    const ids: string[] = completed.map((x) => x.id);

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

  const addNewTodo = (input: string): void => {
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

  const toggleCompleteState = async (id: string): Promise<void> => {
    const current: Todo | undefined = todos.find((x) => x.id === id)?.completed;
    const updated: Todo[] = todos.map((x) => {
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

  const openModalWithControlK = useCallback(
    (event: { key: string; ctrlKey: boolean }) => {
      if (event.key === "k" && event.ctrlKey && !modal) {
        setModal(true);
      }
    },
    []
  );

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
    document.addEventListener("keydown", openModalWithControlK, false);
    return () => {
      document.removeEventListener("keydown", closeModalWithEscapeKey, false);
      document.removeEventListener("keydown", openModalWithControlK, false);
    };
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
      <Logout logout={logout} />
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

export default AuthorizedApp;
