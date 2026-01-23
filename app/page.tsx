"use client";

import React from "react";
import Navbar from "./components/Navbar"; // <--- Import the new Navbar
import Hero from "./components/Hero";
import SelectedWorks from "./components/SelectedWorks";
import Awards from "./components/Awards";
import Speaking from "./components/Speaking";
import Footer from "./components/Footer";

export default function Portfolio() {
  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen font-sans selection:bg-white selection:text-black">
      {/* Navigation Component */}
      <Navbar />

      {/* The Page Structure */}
      <Hero />
      <SelectedWorks />
      <Awards />
      <Speaking />
      <Footer />
    </div>
  );
}
