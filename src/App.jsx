
import Navbar from "./pages/Navbar";
import BookingFormSection from "./pages/BookingFormSection";
import VehicleFleet from "./pages/VehicleFleet";
import Footer from "./pages/Footer";
import AdBlock from "./pages/AdBlock";


function App() {
  const handleSearch = (formData) => {
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <BookingFormSection onSubmit={handleSearch} />
      <VehicleFleet />
      <AdBlock />
      <Footer />
    </div>
  );
}

export default App;
