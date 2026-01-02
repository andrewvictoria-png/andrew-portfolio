import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const About = () => {
  const [profile, setProfile] = useState({
    name: "Loading...",
    bio_prefix: "An",
    role: "Information Technology student",
    school: "La Consolacion University Philippines",
    profile_img: ""
  });
  
  const [displayText, setDisplayText] = useState("");
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";


  useEffect(() => {
    const fetchProfileData = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();
      
      if (data) {
        setProfile(data);
      } else if (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfileData();
  }, []);


  useEffect(() => {
    if (!profile.name || profile.name === "Loading...") return;

    let iteration = 0;
    let interval = setInterval(() => {
      setDisplayText(profile.name.split("")
        .map((char, index) => {
          if (index < iteration) {
            return profile.name[index];
          }
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join("")
      );

      if (iteration >= profile.name.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [profile.name]);

  return (
    <section id="about" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', minHeight: '60vh' }}>
      {/* Left Side: Text Content */}
      <div style={{ flex: 1 }}>
        <h1 className="hero-text" style={{ 
          fontFamily: 'monospace', 
          color: 'var(--accent-color)', 
          textShadow: '0 0 10px rgba(46, 204, 113, 0.2)' 
        }}>
          {displayText}
        </h1>
        
        <p className="sub-hero" style={{ color: 'var(--text-sub)' }}>
          {profile.bio_prefix || "An"} <strong style={{ color: 'var(--text-main)' }}>{profile.role || "Information Technology student"}</strong> at 
          <span style={{ color: 'var(--text-main)', marginLeft: '5px' }}> 
            {profile.school || "La Consolacion University Philippines"}
          </span>.
        </p>
      </div>

      {/* Right Side: Photo Container */}
      <div className="about-photo-container" style={{
        flexShrink: 0,
        width: '350px',
        height: '450px',
        backgroundColor: 'var(--card-bg)',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}>
        {profile.profile_img ? (
          <img 
            src={profile.profile_img} 
            alt={profile.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ color: 'var(--text-sub)' }}>[No Photo Set]</span>
        )}
      </div>
    </section>
  );
};

export default About;