import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import AuthorizedApp from "./AuthorizedApp";
import UnauthorizedApp from "./UnauthorizedApp";

const cookies = new Cookies();

const App = () => {
  const [cookie, setCookie] = useState(null);
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
    }
  }, []);
  return cookie ? <AuthorizedApp /> : <UnauthorizedApp setCookie={setCookie} />;
};

export default App;
