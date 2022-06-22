import { Dispatch, SetStateAction } from "react";

export function NewTodoModal({
  input,
  setInput,
  addNewTodo,
  loading,
}: {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  addNewTodo: (input: string) => void;
  loading: string | null;
}): JSX.Element {
  const handleForm = (e: any) => {
    e.preventDefault();
    addNewTodo(input);
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto min-w-[90%] md:min-w-[60%] xl:min-w-[40%]">
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
