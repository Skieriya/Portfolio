"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const thirdImageRef = useRef(null);
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [svgRevealed, setSvgRevealed] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 }); // Track mouse position for shader
  const scrollPosition = useRef(0); // Track scroll position for shader

  // Project data organized by categories with input/output hubs
  const projects = {
    research: [
      { id: 'research1', name: 'Neural Architecture Search', x: '20%', y: '35%', color: '#ff6b6b' },
      { id: 'research2', name: 'Attention Mechanisms', x: '15%', y: '50%', color: '#ff6b6b' },
      { id: 'research3', name: 'Transfer Learning', x: '25%', y: '65%', color: '#ff6b6b' }
    ],
    college: [
      { id: 'college1', name: 'Computer Vision Project', x: '50%', y: '35%', color: '#4ecdc4' },
      { id: 'college2', name: 'ML Classification System', x: '50%', y: '50%', color: '#4ecdc4' },
      { id: 'college3', name: 'Data Mining Assignment', x: '50%', y: '65%', color: '#4ecdc4' }
    ],
    personal: [
      { id: 'personal1', name: 'Chatbot Development', x: '80%', y: '35%', color: '#95e1d3' },
      { id: 'personal2', name: 'Stock Prediction Model', x: '85%', y: '50%', color: '#95e1d3' },
      { id: 'personal3', name: 'Personal AI Assistant', x: '75%', y: '65%', color: '#95e1d3' }
    ],
    hubs: [
      { id: 'input-hub', name: 'AI Input Core', x: '50%', y: '15%', color: '#6c5ce7' },
      { id: 'output-hub', name: 'AI Output Core', x: '50%', y: '85%', color: '#a29bfe' }
    ]
  };
  const allProjects = [...projects.research, ...projects.college, ...projects.personal, ...projects.hubs];

  // Track mouse and scroll position
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
        if (containerRef.current) {
            scrollPosition.current = containerRef.current.scrollTop;
        }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    const container = containerRef.current;
    if (container) {
        container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) {
          container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Initialize animations
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.style.clipPath = "inset(100% 0 0 0)";
      svgRef.current.style.opacity = "0";
    }
    if (thirdImageRef.current) {
      thirdImageRef.current.style.transform = "scale(0) rotate(180deg)";
      thirdImageRef.current.style.opacity = "0";
    }
  }, []);

  // Scroll/wheel logic with GSAP-like animations using CSS transitions
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (!cardRef.current || !containerRef.current) return;
      if (e.deltaY > 0) {
        // Scrolling down
        if (currentSection === 0 && !isFlipped) {
          cardRef.current.style.transform = "rotateY(180deg)";
          cardRef.current.style.transition = "transform 1s ease-in-out";
          setIsFlipped(true);
        } else if (currentSection === 0 && isFlipped) {
          setCurrentSection(1);
          containerRef.current.scrollTop = containerRef.current.scrollHeight / 3;
          containerRef.current.style.scrollBehavior = "smooth";
          
          setTimeout(() => {
            if (svgRef.current && !svgRevealed) {
              svgRef.current.style.clipPath = "inset(0% 0 0 0)";
              svgRef.current.style.opacity = "1";
              svgRef.current.style.transition = "clip-path 2s ease-in-out, opacity 2s ease-in-out";
              setSvgRevealed(true);
            }
          }, 1000);
        } else if (currentSection === 1 && svgRevealed) {
          setCurrentSection(2);
          containerRef.current.scrollTop = (containerRef.current.scrollHeight * 2) / 3;
          
          setTimeout(() => {
            if (thirdImageRef.current) {
              thirdImageRef.current.style.transform = "scale(1) rotate(0deg)";
              thirdImageRef.current.style.opacity = "1";
              thirdImageRef.current.style.transition = "transform 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 1.5s ease-in-out";
            }
          }, 1000);
        }
      } else {
        // Scrolling up
        if (currentSection === 2) {
          if (thirdImageRef.current) {
            thirdImageRef.current.style.transform = "scale(0) rotate(180deg)";
            thirdImageRef.current.style.opacity = "0";
            thirdImageRef.current.style.transition = "transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
          }
          setCurrentSection(1);
          containerRef.current.scrollTop = containerRef.current.scrollHeight / 3;
        } else if (currentSection === 1) {
          setCurrentSection(0);
          setSvgRevealed(false);
          if (svgRef.current) {
            svgRef.current.style.clipPath = "inset(100% 0 0 0)";
            svgRef.current.style.opacity = "0";
            svgRef.current.style.transition = "clip-path 1s ease-in-out, opacity 1s ease-in-out";
          }
          containerRef.current.scrollTop = 0;
        } else if (currentSection === 0 && isFlipped) {
          cardRef.current.style.transform = "rotateY(0deg)";
          cardRef.current.style.transition = "transform 1s ease-in-out";
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

  const togglePower = () => {
    setIsPoweredOn(!isPoweredOn);
  };

  // WebGL Shader Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;
    
    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    
    // Fragment shader - Updated for inward-push interaction
    const fragmentShaderSource = `
      precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scroll;

// Hash function for noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// 2D noise with smoothstep interpolation
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // Smootherstep

    float n = mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                  mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    return n;
}

// Flowing blob with position animation and mouse interaction
float flowBlob(vec2 p, float scale, float speed, vec2 start_offset, float time_offset) {
    // Animate center position in a circular or drifting path
    vec2 centerOffset = vec2(
        sin(u_time * speed + time_offset) * 0.4,
        cos(u_time * speed * 0.7 + time_offset) * 0.3
    );
    
    vec2 pos = (p + start_offset + centerOffset) * scale;
    float n = noise(pos + u_time * speed);

    // Radial falloff from center (but now center moves!)
    float d = length(p - start_offset - centerOffset);
    float strength = 1.0 - smoothstep(0.0, 0.7, d);
    return n * strength;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y += u_scroll * 1.0; 
    uv = uv * 2.0 - 1.0; // Range: [-1, 1]

    // Background: bright orangish-yellow
    vec3 bgColor = vec3(1.0, 0.7, 0.2);

    // Create 3 large moving blobs with different paths, speeds, and scales
    float blob1 = flowBlob(uv, 1.0, 0.2, vec2(0.0, 0.0), 0.0);
    float blob2 = flowBlob(uv, 1.2, 0.15, vec2(0.8, -0.6), 1.5);
    float blob3 = flowBlob(uv, 1.3, 0.25, vec2(-0.8, 0.6), 3.0);
    float blob4 = flowBlob(uv, 1.1, 0.22, vec2(-0.5, -0.9), 4.5);

    // Combine all blobs by taking the maximum value at each pixel
    float totalBlob = max(max(blob1, blob2), max(blob3, blob4));
    totalBlob = smoothstep(0.0, 1.0, totalBlob); // Smooth blend

    // Invert: blobs are dark regions
    float edgeDarkness = 1.0 - totalBlob;

    // Color gradient from center: yellow → orange → red → black
    vec3 color;
    if (edgeDarkness < 0.2) {
        color = vec3(1.0, 0.7, 0.2); // Yellow-orange
    } else if (edgeDarkness < 0.5) {
        color = mix(vec3(1.0, 0.7, 0.2), vec3(0.8, 0.3, 0.1), (edgeDarkness - 0.2) / 0.3);
    } else if (edgeDarkness < 0.8) {
        color = mix(vec3(0.8, 0.3, 0.1), vec3(0.3, 0.1, 0.0), (edgeDarkness - 0.5) / 0.3);
    } else {
        color = vec3(0.0, 0.0, 0.0); // Black
    }

    // Blend background with dark blob effect
    vec3 finalColor = mix(bgColor, color, edgeDarkness * 1.0);
    finalColor = clamp(finalColor, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
}
    `;
    
    // Compile vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    
    // Check vertex shader compilation
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
      return;
    }
    
    // Compile fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    
    // Check fragment shader compilation
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
      return;
    }
    
    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    // Check for linking errors
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error linking program:', gl.getProgramInfoLog(program));
      return;
    }
    
    // Set up buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Get attribute locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    
    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const scrollLocation = gl.getUniformLocation(program, 'u_scroll');
    
    // Draw function
    function draw() {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Use our program
      gl.useProgram(program);
      
      // Bind the position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      
      // Turn on the position attribute
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      
      // Set uniforms
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, performance.now() / 1000);
      gl.uniform1f(scrollLocation, scrollPosition.current / window.innerHeight);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    // Animation loop
    function animate() {
      draw();
      requestAnimationFrame(animate);
    }
    
    // Resize handler
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3; // Make canvas 3x viewport height
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    
    // Initial resize
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // New useEffect to set full-screen styles on body and html
  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Container for canvas and content */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          perspective: "1200px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* WebGL Canvas for Water Shader, now inside the scrollable container */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "300vh", // Match the height of the scrollable content
            zIndex: 1,
          }}
        />
        {/* Section 1 */}
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            position: "relative", // Ensure content is above the canvas
            zIndex: 2,
          }}
        >
          <div
            ref={cardRef}
            style={{
              width: "80%",
              height: "70%",
              position: "relative",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front face */}
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
            {/* Back face - Interactive Diagram */}
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
              <div style={{ position: "relative", width: "90%", height: "85%", background: "#fff", borderRadius: "40px", border: "1px solid #ddd" }}>
                {/* Power Button */}
                <button
                  onClick={() => setIsPoweredOn(!isPoweredOn)}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    width: "80px",
                    height: "40px",
                    borderRadius: "30px",
                    border: "none",
                    background: isPoweredOn ? "#4CAF50" : "#f0f0f0",
                    color: isPoweredOn ? "#fff" : "#333",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                    boxShadow: isPoweredOn 
                      ? "0 0 15px #4CAF50, 0 0 30px #4CAF5040" 
                      : "0 0 5px rgba(0,0,0,0.2)",
                    zIndex: 20,
                    transform: isPoweredOn ? "scale(1.05)" : "scale(1)",
                    textShadow: isPoweredOn ? "0 0 8px rgba(255,255,255,0.7)" : "none",
                  }}
                >
                  {isPoweredOn ? "ON" : "OFF"}
                  <span
                    style={{
                      position: "absolute",
                      left: isPoweredOn ? "calc(100% - 25px)" : "5px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
                {/* Category Labels */}
                <div style={{
                  position: "absolute",
                  left: "8%",
                  top: "8%",
                  fontFamily: "cursive",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#ff6b6b",
                  textAlign: "center"
                }}>
                  Research<br/>Projects
                </div>
                
                <div style={{
                  position: "absolute",
                  left: "42%",
                  top: "5%",
                  fontFamily: "cursive",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#4ecdc4",
                  textAlign: "center"
                }}>
                  College<br/>Projects
                </div>
                
                <div style={{
                  position: "absolute",
                  right: "8%",
                  top: "8%",
                  fontFamily: "cursive",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#95e1d3",
                  textAlign: "center"
                }}>
                  Personal<br/>Projects
                </div>
                {/* SVG Lines - Branching neuron connections */}
                <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                  {/* Research Branch */}
                  <line x1="50%" y1="15%" x2="20%" y2="35%" stroke={isPoweredOn ? "#ff6b6b" : "#888"} strokeWidth="2" opacity={isPoweredOn ? "0.8" : "0.4"} strokeDasharray="4,3">
                    <animate attributeName="stroke-dashoffset" values="7;0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="20%" y1="35%" x2="15%" y2="50%" stroke={isPoweredOn ? "#ff6b6b" : "#888"} strokeWidth="2" opacity={isPoweredOn ? "0.8" : "0.4"} strokeDasharray="4,3">
                    <animate attributeName="stroke-dashoffset" values="7;0" dur="2.5s" repeatCount="indefinite" />
                  </line>
                  <line x1="15%" y1="50%" x2="25%" y2="65%" stroke={isPoweredOn ? "#ff6b6b" : "#888"} strokeWidth="2" opacity={isPoweredOn ? "0.8" : "0.4"} strokeDasharray="4,3">
                    <animate attributeName="stroke-dashoffset" values="7;0" dur="3s" repeatCount="indefinite" />
                  </line>
                  <line x1="25%" y1="65%" x2="50%" y2="85%" stroke={isPoweredOn ? "#ff6b6b" : "#888"} strokeWidth="2" opacity={isPoweredOn ? "0.8" : "0.4"} strokeDasharray="4,3">
                    <animate attributeName="stroke-dashoffset" values="7;0" dur="3.5s" repeatCount="indefinite" />
                  </line>
                  {/* College Branch */}
                  <line x1="50%" y1="15%" x2="50%" y2="35%" stroke={isPoweredOn ? "#4ecdc4" : "#888"} strokeWidth="3" opacity={isPoweredOn ? "0.9" : "0.4"} />
                  <line x1="50%" y1="35%" x2="50%" y2="50%" stroke={isPoweredOn ? "#4ecdc4" : "#888"} strokeWidth="3" opacity={isPoweredOn ? "0.9" : "0.4"} />
                  <line x1="50%" y1="50%" x2="50%" y2="65%" stroke={isPoweredOn ? "#4ecdc4" : "#888"} strokeWidth="3" opacity={isPoweredOn ? "0.9" : "0.4"} />
                  <line x1="50%" y1="65%" x2="50%" y2="85%" stroke={isPoweredOn ? "#4ecdc4" : "#888"} strokeWidth="3" opacity={isPoweredOn ? "0.9" : "0.4"} />
                  {/* Personal Branch */}
                  <line x1="50%" y1="15%" x2="80%" y2="35%" stroke={isPoweredOn ? "#95e1d3" : "#888"} strokeWidth="2" opacity={isPoweredOn ? "0.8" : "0.4"} strokeDasharray="4,3">
                    <animate attributeName="stroke-dashoffset" values="7;0" dur="2.2s" repeatCount="indefinite" />
                  </line>
                  <line x1="80%" y1="35%" x2="85%" y2="50%" stroke={isPoweredOn ? "#95e1d3" : "#888"} strokeWidth="2" opacity={isPoweredOn ? "0.8" : "0.4"} strokeDasharray="4,3">
                    <animate attributeName="stroke-dashoffset" values="7;0" dur="2.8s" repeatCount="indefinite" />
                  </line>
                  <line x1="85%" y1="50%" x2="75%" y2="65%" stroke={isPoweredOn ? "#95e1d3" : "#888"} strokeWidth="2" opacity={isPoweredOn ? "0.8" : "0.4"} strokeDasharray="4,3">
                    <animate attributeName="stroke-dashoffset" values="7;0" dur="3.2s" repeatCount="indefinite" />
                  </line>
                  <line x1="75%" y1="65%" x2="50%" y2="85%" stroke={isPoweredOn ? "#95e1d3" : "#888"} strokeWidth="2" opacity={isPoweredOn ? "0.8" : "0.4"} strokeDasharray="4,3">
                    <animate attributeName="stroke-dashoffset" values="7;0" dur="3.8s" repeatCount="indefinite" />
                  </line>
                </svg>
                {/* Add CSS animation for input/output flow */}
                <style>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -10;
                    }
                  }
                  @keyframes pulse {
                    0%, 100% {
                      transform: translate(-50%, -50%) scale(1.1);
                    }
                    50% {
                      transform: translate(-50%, -50%) scale(1.2);
                    }
                  }
                `}</style>
                {/* Interactive Project Circles */}
                {allProjects.map((project) => {
                  const isHub = project.id.includes('hub');
                  return (
                    <div
                      key={project.id}
                      style={{
                        position: "absolute",
                        left: project.x,
                        top: project.y,
                        width: isHub ? "60px" : "45px",
                        height: isHub ? "60px" : "45px",
                        borderRadius: "50%",
                        backgroundColor: isPoweredOn 
                          ? (hoveredProject === project.id ? project.color : "white") 
                          : (hoveredProject === project.id ? "#888" : "white"),
                        border: `${isHub ? 4 : 3}px solid ${isPoweredOn ? project.color : "#888"}`,
                        transform: "translate(-50%, -50%)",
                        cursor: "pointer",
                        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        boxShadow: isPoweredOn && isHub
                          ? `0 0 40px 15px ${project.color}30, 0 0 80px 25px ${project.color}15, 0 15px 40px rgba(0,0,0,0.3)`
                          : isPoweredOn && hoveredProject === project.id 
                            ? `0 0 25px 8px ${project.color}40, 0 0 50px 15px ${project.color}20, 0 8px 25px rgba(0,0,0,0.2)` 
                            : `0 4px 15px rgba(0,0,0,0.1)`,
                        zIndex: isHub ? 15 : hoveredProject === project.id ? 10 : 1,
                        scale: isHub ? "1.1" : hoveredProject === project.id ? "1.3" : "1",
                        animation: isHub ? "pulse 2s ease-in-out infinite" : "none",
                        opacity: isPoweredOn ? 1 : 0.6,
                      }}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                    />
                  );
                })}
                {/* Project name tooltip */}
                {hoveredProject && (
                  <div
                    style={{
                      position: "absolute",
                      left: allProjects.find(p => p.id === hoveredProject)?.x,
                      top: `calc(${allProjects.find(p => p.id === hoveredProject)?.y} - 70px)`,
                      transform: "translateX(-50%)",
                      background: isPoweredOn
                        ? `linear-gradient(135deg, ${allProjects.find(p => p.id === hoveredProject)?.color}, ${allProjects.find(p => p.id === hoveredProject)?.color}dd)`
                        : "linear-gradient(135deg, #888, #666)",
                      color: "white",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      zIndex: 30,
                      pointerEvents: "none",
                      boxShadow: isPoweredOn
                        ? `0 8px 25px ${allProjects.find(p => p.id === hoveredProject)?.color}40, 0 4px 15px rgba(0, 0, 0, 0.2)`
                        : "0 8px 25px #88840, 0 4px 15px rgba(0, 0, 0, 0.2)",
                      animation: "tooltipFadeIn 0.3s ease-out",
                    }}
                  >
                    {allProjects.find(p => p.id === hoveredProject)?.name}
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderTop: isPoweredOn
                        ? `8px solid ${allProjects.find(p => p.id === hoveredProject)?.color}`
                        : "8px solid #888"
                    }} />
                  </div>
                )}
                {/* Tooltip animation styles */}
                <style>{`
                  @keyframes tooltipFadeIn {
                    from {
                      opacity: 0;
                      transform: translateX(-50%) translateY(10px) scale(0.8);
                    }
                    to {
                      opacity: 1;
                      transform: translateX(-50%) translateY(0) scale(1);
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
        {/* Section 2 */}
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              border: "2px solid black",
              borderRadius: "60px",
              width: "80%",
              height: "70%",
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
        {/* Section 3 */}
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              border: "2px solid black",
              borderRadius: "60px",
              width: "80%",
              height: "70%",
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
                objectFit: "cover",
                borderRadius: "40px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}