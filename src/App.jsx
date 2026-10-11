import React, { useState, useEffect } from "react";
import Gallery from "./components/Gallery";
import "./App.css";

const projectDetails = {
  "FLOODSENSE": {
    index: "01",
    tags: "IOT · REAL-TIME ANALYTICS · WATER MANAGEMENT",
    description: "An advanced IoT monitoring and predictive analytics platform engineered to track water levels and deliver real-time emergency telemetry.",
    githubUrl: "https://github.com/praacheeee/Portfolio"
  },
  "POTHOLE DETECTION": {
    index: "02",
    tags: "COMPUTER VISION · DEEP LEARNING · INFRASTRUCTURE",
    description: "An automated computer vision system utilizing convolutional neural networks to detect road surface anomalies and streamline municipal workflows.",
    githubUrl: "https://github.com/praacheeee/Portfolio"
  },
  "MENTORMIND": {
    index: "03",
    tags: "AI · PRODUCTIVITY · WEB",
    description: "An AI-powered productivity coach designed to support planning, reflection, and focused work.",
    githubUrl: "https://github.com/praacheeee/Portfolio"
  }
};

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null); // { title, bounds }
  const [scrollProgress, setScrollProgress] = useState(0);

  // The page stays visually pinned; scrolling drives the transition into the 3D scene.
  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight || 1;
        const progress = Math.min(1, Math.max(0, window.scrollY / viewportHeight));
        setScrollProgress(progress);

        if (progress > 0.02) setSelectedProject(null);
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const handleEnterGallery = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const projectInfo = selectedProject ? projectDetails[selectedProject.title] || {
    index: "01",
    tags: "SOFTWARE · ARCHITECTURE",
    description: `Detailed architecture and interactive overview for ${selectedProject.title}. Engineered with high-performance React and Three.js components.`,
    githubUrl: "https://github.com/praacheeee/Portfolio"
  } : null;

  // Anchor the exhibit placard beside the selected frame while keeping it inside the viewport.
  const panelStyle = selectedProject ? (() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bounds = selectedProject.bounds || {
      left: selectedProject.x || vw / 2,
      right: selectedProject.x || vw / 2,
      top: selectedProject.y || vh / 2,
      bottom: selectedProject.y || vh / 2,
    };
    const margin = 16;
    const gap = 22;
    const width = Math.min(360, vw - margin * 2);
    const height = Math.min(310, vh - margin * 2);
    const centerY = (bounds.top + bounds.bottom) / 2;

    let left;
    if (bounds.right + gap + width <= vw - margin) {
      left = bounds.right + gap;
    } else if (bounds.left - gap - width >= margin) {
      left = bounds.left - gap - width;
    } else {
      left = Math.max(margin, Math.min(vw - width - margin, bounds.right + gap));
    }
    const top = Math.max(margin, Math.min(vh - height - margin, centerY - height / 2));

    return { left: `${left}px`, top: `${top}px`, width: `${width}px`, maxHeight: `${height}px` };
  })() : {};

  const overlayOpacity = Math.max(0, 1 - scrollProgress * 1.55);

  return (
    <div className="portfolio-scroll-track">
      <div className="portfolio-stage relative w-full h-screen bg-[#090909] text-[#f1ece4] overflow-hidden selection:bg-[#d6b58b] selection:text-black font-mono">
      {/* Navbar: 3-column grid layout */}
      <header
        style={{ opacity: overlayOpacity, pointerEvents: scrollProgress > 0.68 ? "none" : "auto" }}
        className="absolute top-0 left-0 w-full h-[84px] grid grid-cols-3 items-center px-[5%] md:px-[6%] z-30 pointer-events-auto portfolio-home-overlay"
      >
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
        <Gallery
          transitionProgress={scrollProgress}
          exhibitionActive={scrollProgress >= 1}
          onSelect={(title, bounds) => setSelectedProject({ title, bounds })}
        />
      </div>

      {/* Hero Overlay Content */}
      <div
        style={{ opacity: overlayOpacity, pointerEvents: scrollProgress > 0.68 ? "none" : "auto" }}
        className="absolute inset-0 z-20 flex flex-col justify-between pt-[104px] pb-12 px-[7%] md:px-[7%] pointer-events-none portfolio-home-overlay"
      >
        <div className="max-w-[440px] z-20 pointer-events-auto my-auto relative">
          <p className="text-[10px] uppercase tracking-[0.38em] text-[#d6b58b] mb-4 font-mono font-medium">
            A COMPUTER SCIENCE PORTFOLIO
          </p>
          <h1 className="text-[clamp(52px,6vw,76px)] font-serif-headline font-light tracking-[-0.03em] mb-5 leading-[1.05] text-[#f1ece4]">
            Ideas made <br />
            <span className="font-light italic text-[#d6b58b]">tangible.</span>
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

      {/* Project detail placard, styled to match the supplied Stitch exhibit-card reference */}
      {selectedProject && projectInfo && (
        <div className="exhibit-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <section
            style={panelStyle}
            className="exhibit-placard"
            role="dialog"
            aria-modal="false"
            aria-labelledby="exhibit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="exhibit-placard__top">
              <div className="exhibit-placard__eyebrow">
                <span>EXHIBIT {projectInfo.index}</span>
                <span className="exhibit-placard__separator">/</span>
                <span>PROJECT ARCHIVE</span>
              </div>
              <button type="button" onClick={() => setSelectedProject(null)}
                aria-label="Close project details" className="exhibit-placard__close">×</button>
            </div>

            <div className="exhibit-placard__content">
              <p className="exhibit-placard__kicker">FEATURED PROJECT</p>
              <h2 id="exhibit-title" className="exhibit-placard__title">
                {selectedProject.title === "POTHOLE DETECTION" ? "Pothole Detection" :
                 selectedProject.title === "FLOODSENSE" ? "FloodSense" : "MentorMind"}
              </h2>
              <p className="exhibit-placard__description">{projectInfo.description}</p>
              <p className="exhibit-placard__tags">{projectInfo.tags}</p>
            </div>

            <div className="exhibit-placard__footer">
              {projectInfo.githubUrl && (
                <a href={projectInfo.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="exhibit-placard__github">
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.027 3.3-1.027.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>VIEW SOURCE CODE <span aria-hidden="true">↗</span></span>
                </a>
              )}
              <span className="exhibit-placard__archive">ARCHIVE / {projectInfo.index}</span>
            </div>
          </section>
        </div>
      )}
      </div>
    </div>
  );
}