import AuthorizedApp from "./AuthorizedApp";
import UnauthorizedApp from "./UnauthorizedApp";

const booleanControl = true;

const App = () => (booleanControl ? <UnauthorizedApp /> : <AuthorizedApp />);

export default App;
