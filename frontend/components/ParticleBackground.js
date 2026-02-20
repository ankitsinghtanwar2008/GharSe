"use client";

import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 -z-10"
      options={{
        fullScreen: {
          enable: false,
        },
        background: {
          color: "transparent",
        },
        particles: {
          number: {
            value: 100,
          },
          color: {
            value: ["#3b82f6", "#8b5cf6", "#ec4899"],
          },
          links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.5,
          },
          size: {
            value: { min: 2, max: 4 },
          },
          opacity: {
            value: 0.5,
          },
        },
        detectRetina: true,
      }}
    />
  );
}