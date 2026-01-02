import React from 'react';
/* Importing specific icons from reliable sets */
import { 
  DiHtml5, 
  DiCss3, 
  DiJavascript1, 
  DiReact, 
  DiPython, 
  DiJava 
} from "react-icons/di";
import { 
  SiKotlin, 
  SiXml 
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb"; 

const TechStack = () => {
  const technologies = [
    { name: "HTML", icon: <DiHtml5 size={50} /> },
    { name: "CSS", icon: <DiCss3 size={50} /> },
    { name: "JavaScript", icon: <DiJavascript1 size={50} /> },
    { name: "JS React", icon: <DiReact size={50} /> },
    { name: "Python", icon: <DiPython size={50} /> },
    { name: "C#", icon: <TbBrandCSharp size={45} /> },
    { name: "Java", icon: <DiJava size={50} /> },
    { name: "Kotlin", icon: <SiKotlin size={40} /> },
    { name: "XML", icon: <SiXml size={40} /> },
  ];

  return (
    <section id="tech" style={{ padding: '80px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ borderLeft: '4px solid var(--accent-color)', paddingLeft: '15px', margin: 0 }}>
          Tech Stack
        </h2>
      </div>

      <div 
        className="tech-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '25px',
        }}
      >
        {technologies.map((tech, index) => (
          <div key={index} className="tech-card">
            <div className="tech-icon-wrapper">
              {tech.icon}
            </div>
            <h4 style={{ margin: '15px 0 0 0', fontWeight: '600' }}>{tech.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;