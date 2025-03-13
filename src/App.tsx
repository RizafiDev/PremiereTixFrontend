import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Notfound from "./Pages/Notfound";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* default */}
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Notfound />} />
        {/* authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
