import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaFacebook, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      const { data } = await supabase.from('contact').select('*').single();
      if (data) setData(data);
    };
    fetchContact();
  }, []);

  if (!data) return null;

  return (
    <section id="contact" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '80px', marginTop: '80px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '40px', fontSize: '32px' }}>Get In Touch</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', marginTop: '30px' }}>
        <div className="contact-card">
          <FaPhoneAlt size={24} style={{ color: 'var(--accent-color)', marginBottom: '10px' }} />
          <h4 style={{ color: 'var(--accent-color)' }}>Call</h4>
          <p style={{ color: 'var(--text-main)' }}>{data.phone}</p>
        </div>
        
        <div className="contact-card">
          <FaEnvelope size={24} style={{ color: 'var(--accent-color)', marginBottom: '10px' }} />
          <h4 style={{ color: 'var(--accent-color)' }}>Email</h4>
          <a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>{data.email}</a>
        </div>
        
        <div className="contact-card">
          <h4 style={{ color: 'var(--accent-color)', marginBottom: '15px' }}>Socials</h4>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a href={data.facebook_url} target="_blank" rel="noreferrer" className="social-icon-link"><FaFacebook size={30} /></a>
            <a href={data.instagram_url} target="_blank" rel="noreferrer" className="social-icon-link"><FaInstagram size={30} /></a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;