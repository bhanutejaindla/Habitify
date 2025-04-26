import React from 'react';
import Navbar from '../../components/Navbar/Navbar.js';
import Hero from '../../components/Hero/Hero.js';
import NavbarHome from '../../components/Navbarhome/NavbarHome.js';

const Home=()=>{
    return (
        <div>
            <NavbarHome/>
            <Hero/>
        </div>
    )
}

export default Home;