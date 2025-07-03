import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import ListOfOrchids from "./components/ListOfOrchids";
import EditOrchid from "./components/EditOrchid";
import HomeScreen from "./components/HomeScreen";
import NavBar from "./components/NavBar";
import ListOfEmployees from "./components/ListOfEmployees";
import DetailOrchid from "./components/DetailOrchid";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import CategoryManagement from "./components/CategoryManagement";
import Register from "./components/Register";
import Order from "./components/Order";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orchids" element={<ListOfOrchids />} />
        <Route path="/detail/:id" element={<DetailOrchid />} />
        <Route path="/edit/:id" element={<EditOrchid />} />
        <Route path="/categories" element={<CategoryManagement />} />
        <Route path="/employees" element={<ListOfEmployees />} />
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/order" element={<Order />}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;
