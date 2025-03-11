import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import SplashScreen from "./pages/SplashScreen";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={SplashScreen} />
        <Route path="/log-in" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/sign-up" component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
