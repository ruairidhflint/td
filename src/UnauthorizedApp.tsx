import { useState, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function UnauthorizedApp({ login }: any): JSX.Element {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitPassword = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(
        "/.netlify/functions/login",
        passwordRef.current?.value,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      login(response.data);
    } catch (err: any) {
      const status = err.response.status;
      if (status === 401) {
        toast.error("Incorrect password", { position: "top-center" });
      } else {
        toast.error("Error connecting to server", { position: "top-center" });
      }
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="grid h-[80vh] place-items-center">
        <div className="relative w-auto my-6 mx-auto min-w-[80%] md:min-w-[60%] xl:min-w-[25%]">
          <form className="w-full px-6 py-8" onSubmit={submitPassword}>
            <div className="flex items-center border-b border-blue-600 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="password"
                placeholder="Password"
                autoFocus
                required
                ref={passwordRef}
                disabled={submitting}
              />
              <button
                className="bg-blue-600 hover:bg-blue-800 border-blue-600 hover:border-blue-800 text-sm border-4 text-white py-1 px-6 rounded disabled:opacity-20"
                type="submit"
                disabled={submitting}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
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
    </>
  );
}

export default UnauthorizedApp;
