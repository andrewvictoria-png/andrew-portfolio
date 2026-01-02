import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false }); // Newest projects first

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <section id="projects"><h2>Loading Projects...</h2></section>;
  }

  return (
    <section id="projects">
      <h2 style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-color)', paddingLeft: '15px' }}>
        Featured Work
      </h2>
      
      <div className="project-list">
        {projects.length > 0 ? (
          projects.map((proj) => (
            <div className="project-item" key={proj.id}>
              <div className="project-info">
                <h3>{proj.title}</h3>
                <p>{proj.description}</p>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-sub)', 
                  marginBottom: '20px',
                  fontWeight: '500'
                }}>
                  {proj.role || "Developer"}
                </div>
                
                {proj.link && (
                  <a 
                    href={proj.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="learn-more"
                  >
                    View Project →
                  </a>
                )}
              </div>

              {/* Project Image Container */}
              <div className="project-image" style={{ 
                height: '400px', 
                backgroundColor: 'var(--card-bg)', 
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {proj.image_url ? (
                  <img 
                    src={proj.image_url} 
                    alt={proj.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <span style={{ color: 'var(--text-sub)' }}>Coming Soon</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-sub)' }}>No projects added yet.</p>
        )}
      </div>
    </section>
  );
};

export default Projects;