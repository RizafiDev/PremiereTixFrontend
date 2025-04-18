import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Notfound from "./Pages/Notfound";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import BuyTicket from "./Pages/transaction/films/BuyTicket";
import SelectSeat from "./Pages/transaction/films/SelectSeat";
import Payment from "./Pages/transaction/films/Payment";
import { AuthInitializer } from "@/components/AuthInitializer";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <>
      <AuthInitializer />
      <Router>
        <Routes>
          {/* default */}
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<Notfound />} />

          {/* authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* public transaction routes */}

          {/* routes that need authentication check */}

          <Route
            path="/select-seat"
            element={
              <ProtectedRoute>
                <SelectSeat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy"
            element={
              <ProtectedRoute>
                <BuyTicket />
              </ProtectedRoute>
            }
          />

          {/* ... other protected routes */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
