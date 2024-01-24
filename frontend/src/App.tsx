import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MutationDetection from "./pages/MutationDetection";
import KMerAnalytics from "./pages/KMerAnalytics";
import GeneticSimilarity from "./pages/GeneticSimilarity";
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genetic-mutations" element={<MutationDetection/>} />
          <Route path="/kmer-analysis" element={<KMerAnalytics/>} />
          <Route path="/similarity" element={<GeneticSimilarity/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
