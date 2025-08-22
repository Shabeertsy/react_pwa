
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import BookingFormSection from "./pages/BookingFormSection";
import VehicleFleet from "./pages/VehicleFleet";
import Footer from "./pages/Footer";
import AdBlock from "./pages/AdBlock";
import ParentFleet from "./pages/ParentComponent";
import PackageDetails from "./pages/PackageDetails";



function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <ParentFleet />
              <AdBlock />
            </>
          } />
          <Route path="/package/:id" element={<PackageDetails />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
