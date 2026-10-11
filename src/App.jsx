import React, { useState } from "react";
import Gallery from "./components/Gallery";

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleEnterGallery = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-screen bg-[#090909] text-[#f1ece4] overflow-hidden selection:bg-[#d6b58b] selection:text-black font-mono">
      {/* Navbar: 3-column grid layout restoring the exact header */}
      <header className="absolute top-0 left-0 w-full h-[84px] grid grid-cols-3 items-center px-[5%] md:px-[6%] z-30 pointer-events-auto">
        <div className="text-2xl font-serif-headline font-bold tracking-wider text-[#f1ece4] justify-self-start">
          P.
        </div>
        <nav className="hidden md:flex items-center justify-center space-x-12 text-[11px] uppercase tracking-[0.25em] text-[#b8b0a6] font-medium justify-self-center">
          <a href="#gallery" onClick={(e) => { e.preventDefault(); handleEnterGallery(); }} className="hover:text-[#f1ece4] transition-colors">THE GALLERY</a>
          <a href="#projects" onClick={(e) => { e.preventDefault(); handleEnterGallery(); }} className="hover:text-[#f1ece4] transition-colors">PROJECTS</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); handleEnterGallery(); }} className="hover:text-[#f1ece4] transition-colors flex items-center gap-1">CONTACT <span>↗</span></a>
        </nav>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#b8b0a6] font-light justify-self-end text-right">
          DIGITAL ARCHIVE &nbsp;&middot;&nbsp; 2026
        </div>
      </header>

      {/* Single 3D Gallery Canvas Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <Gallery onSelect={(title) => setSelectedProject(title)} />
      </div>

      {/* Hero Overlay Content matching original proportions */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between pt-[104px] pb-12 px-[7%] md:px-[7%] pointer-events-none">
        {/* Hero Content Box */}
        <div className="max-w-[440px] z-20 pointer-events-auto my-auto relative">
          <p className="text-[10px] uppercase tracking-[0.38em] text-[#d6b58b] mb-4 font-mono font-medium">
            A COMPUTER SCIENCE PORTFOLIO
          </p>
          <h1 className="text-[clamp(52px,6vw,76px)] font-serif-headline font-normal tracking-[-0.03em] mb-5 leading-[1.02] text-[#f1ece4]">
            Ideas made <br />
            <span className="font-normal italic text-[#d6b58b]">tangible.</span>
          </h1>
          <p className="text-[12.5px] text-[#b8b0a6] font-light mb-8 leading-[2] font-mono max-w-[400px]">
            Exploring artificial intelligence, software engineering, and the space where technology meets creativity.
          </p>
          <button
            onClick={handleEnterGallery}
            className="group w-[224px] h-[56px] bg-[#d6b58b] text-[#111111] text-[11px] uppercase tracking-[0.2em] font-medium rounded-none flex items-center justify-center space-x-3 shadow-xl cursor-pointer pointer-events-auto hover:bg-[#e2c49e] transition-all"
          >
            <span>ENTER THE GALLERY</span>
            <span className="transform group-hover:translate-x-1 transition-transform">↗</span>
          </button>
        </div>

        {/* Footer Editorial Labels */}
        <div className="flex justify-between items-end w-full z-20 pointer-events-auto text-[10px] uppercase tracking-[0.22em] text-[#b8b0a6] pb-2">
          <div>
            <p className="mb-0.5">AN INTERACTIVE DIGITAL EXHIBITION</p>
            <p className="text-[#888076]">INDEPENDENT DIGITAL ARCHIVE</p>
          </div>
          <div className="text-right cursor-pointer flex items-center gap-2 hover:text-[#f1ece4] transition-colors" onClick={handleEnterGallery}>
            <span className="text-[#d6b58b]">01 / EXPLORE</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6 pointer-events-auto">
          <div className="bg-[#121110] border border-[#d6b58b]/30 max-w-2xl w-full p-8 rounded relative shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-[#b8b0a6] hover:text-white font-mono text-lg"
            >
              [✕]
            </button>
            <h2 className="text-3xl font-serif-headline text-[#f1ece4] mb-4">{selectedProject}</h2>
            <p className="text-[#b8b0a6] font-mono text-sm mb-8 leading-relaxed">
              Detailed architecture and interactive overview for {selectedProject}. Engineered with high-performance React and Three.js components within a cinematic exhibition space.
            </p>
            <button
              onClick={() => setSelectedProject(null)}
              className="px-6 py-3 bg-[#d6b58b] text-[#111111] text-xs font-mono uppercase tracking-widest rounded-none hover:bg-[#e2c49e] transition-colors"
            >
              CLOSE EXHIBIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}