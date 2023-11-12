import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Signup from './pages/Signup';
import VerifyAccount from './pages/VerifyAccount';
import Login from './pages/Login';
import {Toaster} from "react-hot-toast";
import {Application} from "./pages/Application";


function App() {
  return (
      <Router>
          <div>
              <Toaster />

              <Routes>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify" element={<VerifyAccount />} />
                  <Route path="/login" element={<Login />} />

                  <Route path="/app" element={<Application />} />

                  <Route path="/" element={<Application />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
