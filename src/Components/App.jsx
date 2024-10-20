import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home/Home";
import Sidebar from "./Sidebar/Sidebar";
import Contabilidad from "./Contabilidad/Contabilidad";

function App() {
  return (
    <div className="content">
      <Sidebar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/asesoras" element={<Contabilidad />} />
        </Routes>

    </div>
  );
}

export default App;
