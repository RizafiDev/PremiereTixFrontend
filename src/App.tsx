import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Notfound from "./Pages/Notfound";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import BuyTicket from "./Pages/transaction/films/BuyTicket";
import SelectSeat from "./Pages/transaction/films/SelectSeat";

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
        {/* films transactions */}
        <Route path="/select-seat" element={<SelectSeat />} />
        <Route path="/buy" element={<BuyTicket />} />
      </Routes>
    </Router>
  );
}

export default App;
