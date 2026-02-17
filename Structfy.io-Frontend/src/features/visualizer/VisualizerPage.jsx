import React from "react";
import { useNavigate } from "react-router-dom";
import VisualizerWorkspace from "./components/VisualizerWorkspace";

export default function VisualizerPage() {
  const navigate = useNavigate();

  return (
    <>
      <header className="viz-topbar">
        <button onClick={() => navigate("/courseMain")}>Go To Course Space</button>
      </header>
      <VisualizerWorkspace />
    </>
  );
}

