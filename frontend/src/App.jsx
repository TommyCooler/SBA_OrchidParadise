import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router";
import ListOfOrchids from "./components/ListOfOrchids";
import EditOrchid from "./components/EditOrchid";
import HomeScreen from "./components/HomeScreen";
import NavBar from "./components/NavBar";
import ListOfEmployees from "./components/ListOfEmployees";
import DetailOrchid from "./components/DetailOrchid";
import About from "./components/About";
import Contact from "./components/Contact";
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        {/* <Route path='/home' element={<HomeScreen/>}/> */}
        <Route path="/orchids" element={<ListOfOrchids />} />
        <Route path="/detail/:id" element={<DetailOrchid />} />
        <Route path="/edit/:id" element={<EditOrchid />} />
        <Route path="/employees" element={<ListOfEmployees />} />
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </>
  );
}

export default App;
