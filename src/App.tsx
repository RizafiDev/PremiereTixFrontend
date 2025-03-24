import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Notfound from "./Pages/Notfound";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import SelectChair from "./Pages/transaction/SelectChair";

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
        {/* transaction */}
        <Route path="/chair" element={<SelectChair />} />
      </Routes>
    </Router>
  );
}

export default App;
