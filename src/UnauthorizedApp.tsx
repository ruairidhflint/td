function UnauthorizedApp(): JSX.Element {
  return (
    <div className="grid h-screen place-items-center">
      <div className="relative w-auto my-6 mx-auto min-w-[90%] md:min-w-[60%] xl:min-w-[30%]">
        <form className="w-full px-6 py-8">
          <div className="flex items-center border-b border-blue-600 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Password"
              autoFocus
            />
            <button
              className="bg-blue-600 hover:bg-blue-800 border-blue-600 hover:border-blue-800 text-sm border-4 text-white py-1 px-6 rounded disabled:opacity-20"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UnauthorizedApp;
