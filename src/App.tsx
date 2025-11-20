import Navbar from "./components/header/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <div className="grow w-full">
      <Navbar />

      <main className="grow w-full">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default App;
