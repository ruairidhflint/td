export function MenuArea({
  toggleModal,
  clearCompletedTodos,
}: {
  toggleModal: () => void;
  clearCompletedTodos: () => void;
}): JSX.Element {
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
