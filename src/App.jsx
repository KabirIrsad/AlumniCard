import React from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AlumniCard from "./components/AlumniCard.jsx";
import AlumniForm from './components/AlumniForm.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AlumniForm />} />
          <Route path="/card" element={<AlumniCard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
