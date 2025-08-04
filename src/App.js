import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import ResultPage from "./components/ResultPage";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/myadmin" element={<AdminPage />} />

      </Routes>
    </Router>
  );
}

export default App;
