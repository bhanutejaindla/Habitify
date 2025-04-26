import React from 'react';
import Navbar from './components/Navbar/Navbar.js';
import Hero from './components/Hero/Hero.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home.js';
import SignUp from './components/signup/SignUp.js';
import SignIn from './components/signin/SignIn.js';
import DashBoard from './components/dashboard/DashBoard.js';
import ViewProgress from './components/viewprogress/ViewProgress';
import Analytics from './components/analytics/Analytics.js';
import Recommendataions from './components/recommendataions/Recommendataions.js';
import { HabitProvider } from './components/context/HabitContext.js';


const App = () => {
  return (
    <HabitProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/progress/:id" element={<ViewProgress />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path='/recommendations' element={<Recommendataions />} />
        </Routes>
      </BrowserRouter>
    </HabitProvider>

  );
}

export default App;
