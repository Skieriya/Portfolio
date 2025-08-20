"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Home() {
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null); // For second section image
  const thirdImageRef = useRef(null); // For third section image
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentSection, setCurrentSection] = useState(0); // 0: first, 1: second, 2: third
  const [svgRevealed, setSvgRevealed] = useState(false);

  useEffect(() => {
    // Initialize SVG as hidden
    if (svgRef.current) {
      gsap.set(svgRef.current, {
        clipPath: "inset(100% 0 0 0)", // Start completely hidden from top
        opacity: 0
      });
    }
    
    // Initialize third section image as hidden
    if (thirdImageRef.current) {
      gsap.set(thirdImageRef.current, {
        scale: 0,
        opacity: 0,
        rotation: 180
      });
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault(); // Prevent default scroll behavior
      
      if (!cardRef.current || !containerRef.current) return;

      if (e.deltaY > 0) { // Scrolling down
        if (currentSection === 0 && !isFlipped) {
          // First scroll: flip the card
          gsap.to(cardRef.current, {
            rotateY: 180,
            duration: 1,
            ease: "power2.inOut",
          });
          setIsFlipped(true);
        } else if (currentSection === 0 && isFlipped) {
          // Second scroll: move to second section
          setCurrentSection(1);
          gsap.to(containerRef.current, {
            scrollTop: containerRef.current.scrollHeight / 3, // Scroll to second section
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
              // Start revealing SVG after scroll completes
              if (svgRef.current && !svgRevealed) {
                gsap.to(svgRef.current, {
                  clipPath: "inset(0% 0 0 0)", // Reveal from top to bottom
                  opacity: 1,
                  duration: 2,
                  ease: "power2.inOut",
                  onComplete: () => {
                    setSvgRevealed(true);
                  }
                });
              }
            }
          });
        } else if (currentSection === 1 && svgRevealed) {
          // Third scroll: move to third section (only after SVG is revealed)
          setCurrentSection(2);
          gsap.to(containerRef.current, {
            scrollTop: containerRef.current.scrollHeight * 2 / 3, // Scroll to third section
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
              // Animate third section image
              if (thirdImageRef.current) {
                gsap.to(thirdImageRef.current, {
                  scale: 1,
                  opacity: 1,
                  rotation: 0,
                  duration: 1.5,
                  ease: "back.out(1.7)"
                });
              }
            }
          });
        }
      } else { // Scrolling up
        if (currentSection === 2) {
          // Hide third section image and scroll back to second section
          if (thirdImageRef.current) {
            gsap.to(thirdImageRef.current, {
              scale: 0,
              opacity: 0,
              rotation: 180,
              duration: 0.5,
              ease: "power2.inOut"
            });
          }
          setCurrentSection(1);
          gsap.to(containerRef.current, {
            scrollTop: containerRef.current.scrollHeight / 3,
            duration: 1,
            ease: "power2.inOut",
          });
        } else if (currentSection === 1) {
          // Scroll back to first section and hide SVG
          setCurrentSection(0);
          setSvgRevealed(false);
          if (svgRef.current) {
            gsap.to(svgRef.current, {
              clipPath: "inset(100% 0 0 0)",
              opacity: 0,
              duration: 1,
              ease: "power2.inOut",
            });
          }
          gsap.to(containerRef.current, {
            scrollTop: 0,
            duration: 1,
            ease: "power2.inOut",
          });
        } else if (currentSection === 0 && isFlipped) {
          // Flip card back to front
          gsap.to(cardRef.current, {
            rotateY: 0,
            duration: 1,
            ease: "power2.inOut",
          });
          setIsFlipped(false);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [isFlipped, currentSection, svgRevealed]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden", // Hide scrollbars, we'll control scroll programmatically
        display: "flex",
        flexDirection: "column",
        perspective: "1200px",
      }}
    >
      {/* First section with card */}
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0, // Prevent shrinking
        }}
      >
        {/* Card wrapper */}
        <div
          ref={cardRef}
          style={{
            width: "80%",
            height: "70%",
            position: "relative",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front Face */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid black",
              borderRadius: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
              backfaceVisibility: "hidden",
            }}
          >
            <img
              src="./mainimg.png"
              alt="profile"
              style={{
                width: "42%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "40px",
              }}
            />

            <img
              src="./auto.svg"
              alt="autograph"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "200px",
                height: "auto",
              }}
            />

            <span
              style={{
                padding: "20px",
                position: "absolute",
                top: "10px",
                left: "20px",
                fontFamily: "'Niconne', cursive",
              }}
            >
              <div style={{ fontSize: "50px", paddingBottom: "10px" }}>
                Pratham Kadam
              </div>
              <div
                style={{
                  fontSize: "28px",
                  marginTop: "-10px",
                  fontFamily: "sans-serif",
                  paddingBottom: "10px",
                }}
              >
                AI Researcher and Engineer
              </div>
            </span>
          </div>

          {/* Back Face with diagram image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid black",
              borderRadius: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#f9f9f9",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              overflow: "hidden",
            }}
          >
            <img
              src="./diagram.png"
              alt="diagram"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "60px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Second section */}
      <div 
        style={{ 
          height: "100vh", // Match first section height
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0, // Prevent shrinking
        }}
      >
        <div
          style={{
            border: "2px solid black",
            borderRadius: "60px",
            width: "80%",
            height: "70%", // Match first section card height
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f0f0f0",
            overflow: "hidden",
          }}
        >
          <img
            ref={svgRef}
            src="./amb.svg"
            alt="ambition"
            style={{
              width: "90%",
              height: "90%",
              objectFit: "contain",
              borderRadius: "40px",
            }}
          />
        </div>
      </div>

      {/* Third section */}
      <div 
        style={{ 
          height: "100vh", // Match first section height
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0, // Prevent shrinking
        }}
      >
        <div
          style={{
            border: "2px solid black",
            borderRadius: "60px",
            width: "80%",
            height: "70%", // Match first section card height
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#e0e0e0",
            overflow: "hidden",
          }}
        >
          <img
            ref={thirdImageRef}
            src="./blackhole.jpg"
            alt="blackhole"
            style={{
              width: "90%",
              height: "90%",
              objectFit: "cover", // Use cover for better image display
              borderRadius: "40px",
            }}
          />
        </div>
      </div>
    </div>
  );
}