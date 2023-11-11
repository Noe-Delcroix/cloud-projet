import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Signup from './components/Signup';
import VerifyAccount from './components/VerifyAccount';
import Login from './components/Login';
import {Toaster} from "react-hot-toast";
import {Application} from "./components/Application";


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

                  <Route path="/" element={<Login />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
