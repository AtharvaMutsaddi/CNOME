import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MutationDetection from "./pages/MutationDetection";
import KMerAnalytics from "./pages/KMerAnalytics";
import GeneticSimilarity from "./pages/GeneticSimilarity";
import { GeneProvider } from "./context/GeneContext";
import ViewGene from "./pages/ViewGene";
import BackgroundImage from "./assets/geneBG.jpg"
function App() {
  return (
    <GeneProvider>
      <Router>
        <div
          className="App"
          style={{
            backgroundImage: `url(${BackgroundImage})`, // Apply the background image
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh", // Ensure the background covers the entire viewport height
          }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/genetic-mutations" element={<MutationDetection />} />
            <Route path="/kmer-analysis" element={<KMerAnalytics />} />
            <Route path="/similarity" element={<GeneticSimilarity />} />
            <Route path="/viewGene" element={<ViewGene />} />
          </Routes>
        </div>
      </Router>
    </GeneProvider>
  );
}

export default App;
