
import { useState } from "react";
import Gallery from "./components/Gallery.jsx";
import "./index.css";

const projects = {
  FLOODSENSE: {
    category: "AI / NATURAL LANGUAGE PROCESSING",
    description:
      "An AI system concept that classifies flood emergency messages to help identify urgent requests for assistance.",
    stack: "Python · NLP · Machine Learning",
  },
  "POTHOLE DETECTION": {
    category: "COMPUTER VISION",
    description:
      "A road-damage detection system using computer vision to identify potholes and support infrastructure maintenance.",
    stack: "Python · YOLOv8 · OpenCV · FastAPI · React",
  },
  MENTORMIND: {
    category: "AI APPLICATIONS",
    description:
      "An AI productivity coach designed to help users organize their goals and work through tasks.",
    stack: "Python · Flask · React · OpenRouter",
  },
};

export default function App() {
  const [entered, setEntered] = useState(false);
  const [selected, setSelected] = useState(null);

  const project = projects[selected];

  return (
    <main className="portfolio">
      <header className="topbar">
        <button
          className="logo"
          onClick={() => {
            setEntered(false);
            setSelected(null);
          }}
        >
          P<span>.</span>
        </button>

        <div className="nav-links">
          <button onClick={() => setEntered(true)}>
            THE GALLERY
          </button>
          <button onClick={() => setSelected("FLOODSENSE")}>
            PROJECTS
          </button>
          <a href="mailto:your-email@example.com">
            CONTACT ↗
          </a>
        </div>

        <span className="edition">DIGITAL ARCHIVE · 2026</span>
      </header>

      <section className="gallery-world">
        <Gallery onSelect={setSelected} />

        {!entered && !selected && (
          <div className="intro">
            <p className="eyebrow">
              A COMPUTER SCIENCE PORTFOLIO
            </p>

            <h1>
              Ideas made
              <br />
              <em>tangible.</em>
            </h1>

            <p className="intro-copy">
              Exploring artificial intelligence,
              software engineering, and the space
              where technology meets creativity.
            </p>

            <button
              className="enter-button"
              onClick={() => setEntered(true)}
            >
              ENTER THE GALLERY <span>↗</span>
            </button>

            <p className="scroll-note">
              AN INTERACTIVE DIGITAL EXHIBITION
            </p>
          </div>
        )}

        {entered && !selected && (
          <div className="controls-hint">
            <span>W A S D</span> MOVE
            <span>MOUSE</span> LOOK AROUND
            <p>Click the scene to explore · ESC to unlock</p>
          </div>
        )}

        {selected && (
          <aside className="project-card">
            <button
              className="close"
              onClick={() => setSelected(null)}
              aria-label="Close project"
            >
              ×
            </button>

            {project ? (
              <>
                <p className="eyebrow">{project.category}</p>
                <h2>{selected}</h2>
                <p className="project-description">
                  {project.description}
                </p>
                <p className="stack">{project.stack}</p>
                <a
                  className="text-link"
                  href={`https://github.com/search?q=${encodeURIComponent(selected)}&type=repositories`}
                  target="_blank"
                  rel="noreferrer"
                >
                  EXPLORE ON GITHUB ↗
                </a>
              </>
            ) : (
              <>
                <p className="eyebrow">THE EXHIBITION</p>
                <h2>Work in progress.</h2>
                <p>
                  This exhibit is being prepared.
                  Return to the gallery to explore.
                </p>
              </>
            )}
          </aside>
        )}

        <footer className="gallery-footer">
          <span>INDEPENDENT DIGITAL ARCHIVE</span>
          <span>01 / EXPLORE</span>
        </footer>
      </section>
    </main>
  );
}

