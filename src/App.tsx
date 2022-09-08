import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import AuthorizedApp from "./AuthorizedApp";
import { Spinner } from "./components/Spinner";
import UnauthorizedApp from "./UnauthorizedApp";

const cookies = new Cookies();

const App = () => {
  const [cookie, setCookie] = useState<null | string | boolean>(null);

  const login = (id: string) => {
    setCookie(id);
    cookies.set("auth", id);
  };

  const logout = () => {
    axios.post("/.netlify/functions/logout", cookie, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    cookies.remove("auth");
    setCookie(false);
  };

  useEffect(() => {
    const authCookie = cookies.get("auth");
    if (authCookie) {
      const validate = async () => {
        await axios.post("/.netlify/functions/validateCookie", authCookie, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCookie(authCookie);
      };
      validate();
    } else {
      setCookie(false);
    }
  }, []);
  if (cookie === null) {
    return (
      <div className="max-w-[650px] my-0 mx-auto mt-[50px] flex justify-center">
        <Spinner />
      </div>
    );
  }

  return cookie ? (
    <AuthorizedApp logout={logout} />
  ) : (
    <UnauthorizedApp login={login} />
  );
};

export default App;
