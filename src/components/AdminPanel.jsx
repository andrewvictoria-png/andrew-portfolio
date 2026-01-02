import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  LogOut, Plus, Trash2, User, Folder, Phone, 
  Upload, CheckCircle, Instagram, Facebook, School, Type 
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [profile, setProfile] = useState({ 
    id: null, name: '', bio_prefix: '', role: '', school: '', profile_img: '', theme_color: '' 
  });
  const [contact, setContact] = useState({ 
    id: null, phone: '', email: '', facebook_url: '', instagram_url: '' 
  });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ 
    title: '', description: '', role: '', link: '', image_url: '' 
  });

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    const { data: prof } = await supabase.from('profile').select('*').single();
    const { data: cont } = await supabase.from('contact').select('*').single();
    const { data: proj } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    
    if (prof) setProfile(prof);
    if (cont) setContact(cont);
    if (proj) setProjects(proj || []);
  };

  // --- IMAGE UPLOAD LOGIC ---
  const uploadImage = async (file, folder) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const url = await uploadImage(file, 'avatars');
    if (url) setProfile(prev => ({ ...prev, profile_img: url }));
    setLoading(false);
  };

  const handleProjectImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const url = await uploadImage(file, 'projects');
    if (url) setNewProject(prev => ({ ...prev, image_url: url }));
    setLoading(false);
  };

  // --- SAVE HANDLERS ---
  const handleUpdateProfile = async () => {
    if (!profile.id) return alert("System Error: Profile ID missing. Refresh page.");
    setLoading(true);
    const { error } = await supabase
      .from('profile')
      .update({
        name: profile.name,
        bio_prefix: profile.bio_prefix,
        role: profile.role,
        school: profile.school,
        profile_img: profile.profile_img,
        theme_color: profile.theme_color
      })
      .eq('id', profile.id);

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      alert("Profile data synced successfully!");
      document.documentElement.style.setProperty('--accent-color', profile.theme_color);
    }
    setLoading(false);
  };

  const handleUpdateContact = async () => {
    if (!contact.id) return alert("System Error: Contact ID missing.");
    setLoading(true);
    const { error } = await supabase
      .from('contact')
      .update({
        phone: contact.phone,
        email: contact.email,
        facebook_url: contact.facebook_url,
        instagram_url: contact.instagram_url
      })
      .eq('id', contact.id);

    if (error) alert("Error updating contact: " + error.message);
    else alert("Contact & Socials synced successfully!");
    setLoading(false);
  };

  const handlePublishProject = async () => {
    if (!newProject.title) return alert("Project Title is required");
    setLoading(true);
    const { error } = await supabase.from('projects').insert([{
      title: newProject.title,
      description: newProject.description,
      role: newProject.role,
      link: newProject.link,
      image_url: newProject.image_url
    }]);

    if (error) {
      alert("Project Save Error: " + error.message);
    } else {
      alert("New Project Published!");
      setNewProject({ title: '', description: '', role: '', link: '', image_url: '' });
      fetchData();
    }
    setLoading(false);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === "0000") setIsAuthenticated(true);
    else { alert("ACCESS_DENIED"); setPin(""); }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#050505' }}>
        <form onSubmit={handlePinSubmit} style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', fontFamily: 'monospace', letterSpacing: '2px' }}>SYSTEM_LOCK_V2</h2>
          <input 
            type="password" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            maxLength={4} 
            autoFocus 
            placeholder="****"
            style={pinInputStyle} 
          />
        </form>
      </div>
    );
  }

  return (
    <div style={adminContainerStyle}>
      <header style={headerStyle}>
        <h1 style={{ letterSpacing: '-1px' }}>SYSTEM_ADMIN_DASHBOARD</h1>
        <button onClick={() => navigate('/')} style={logoutButtonStyle}>
          <LogOut size={18} /> TERMINATE_SESSION
        </button>
      </header>

      <div style={gridStyle}>
        
        {/* PROFILE BLOCK */}
        <section style={panelStyle}>
          <h3><User size={18} /> PROFILE_CONFIG</h3>
          <div style={uploadContainer}>
             <img src={profile.profile_img || 'https://via.placeholder.com/100'} style={previewCircle} alt="Profile" />
             <label style={uploadLabel}>
                <Upload size={14} /> Change Avatar
                <input type="file" onChange={handleProfileImageUpload} hidden accept="image/*" />
             </label>
          </div>
          <div style={inputGroup}><label>FULL_NAME</label><input style={fieldStyle} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} /></div>
          <div style={inputGroup}><label>BIO_PREFIX (e.g. "I am a")</label><input style={fieldStyle} value={profile.bio_prefix} onChange={(e) => setProfile({...profile, bio_prefix: e.target.value})} /></div>
          <div style={inputGroup}><label><School size={14}/> SCHOOL/INSTITUTION</label><input style={fieldStyle} value={profile.school} onChange={(e) => setProfile({...profile, school: e.target.value})} /></div>
          <div style={inputGroup}><label>CURRENT_ROLE</label><input style={fieldStyle} value={profile.role} onChange={(e) => setProfile({...profile, role: e.target.value})} /></div>
          <div style={inputGroup}>
            <label>ACCENT_THEME_COLOR</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <input type="color" value={profile.theme_color || '#00ff88'} onChange={(e) => setProfile({...profile, theme_color: e.target.value})} style={{width:'50px', height:'40px', border:'none', background:'none'}} />
              <input style={fieldStyle} value={profile.theme_color} onChange={(e) => setProfile({...profile, theme_color: e.target.value})} />
            </div>
          </div>
          <button onClick={handleUpdateProfile} style={actionButton} disabled={loading}>
            {loading ? "SYNCING..." : "COMMIT_PROFILE_CHANGES"}
          </button>
        </section>

        {/* CONTACT & SOCIALS BLOCK */}
        <section style={panelStyle}>
          <h3><Phone size={18} /> SOCIAL_DATA_CONFIG</h3>
          <div style={inputGroup}><label>PHONE</label><input style={fieldStyle} value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} /></div>
          <div style={inputGroup}><label>EMAIL</label><input style={fieldStyle} value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} /></div>
          <div style={inputGroup}><label><Facebook size={14}/> FACEBOOK_URL</label><input style={fieldStyle} value={contact.facebook_url} onChange={(e) => setContact({...contact, facebook_url: e.target.value})} /></div>
          <div style={inputGroup}><label><Instagram size={14}/> INSTAGRAM_URL</label><input style={fieldStyle} value={contact.instagram_url} onChange={(e) => setContact({...contact, instagram_url: e.target.value})} /></div>
          <button onClick={handleUpdateContact} style={actionButton} disabled={loading}>UPDATE_SOCIALS</button>
        </section>

        {/* PROJECT ADDER */}
        <section style={panelStyle}>
          <h3><Plus size={18} /> NEW_PROJECT_ENTRY</h3>
          <input placeholder="Project Title" style={fieldStyle} value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} />
          <input placeholder="Role (e.g. Lead Designer)" style={fieldStyle} value={newProject.role} onChange={(e) => setNewProject({...newProject, role: e.target.value})} />
          <textarea placeholder="Description of work..." style={{...fieldStyle, height: '80px'}} value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
          <input placeholder="External Link (GitHub/Demo)" style={fieldStyle} value={newProject.link} onChange={(e) => setNewProject({...newProject, link: e.target.value})} />
          
          <div style={{marginBottom: '15px'}}>
            <label style={uploadLabel}>
               {newProject.image_url ? <><CheckCircle size={14} color="#00ff88" /> PREVIEW_IMAGE_READY</> : <><Upload size={14} /> UPLOAD_PROJECT_IMAGE</>}
               <input type="file" onChange={handleProjectImageUpload} hidden accept="image/*" />
            </label>
          </div>

          <button onClick={handlePublishProject} style={{...actionButton, background: '#fff', color: '#000'}} disabled={loading}>
            {loading ? "UPLOADING..." : "PUBLISH_PROJECT"}
          </button>
        </section>
      </div>

      {/* PROJECT INVENTORY */}
      <div style={{marginTop: '50px'}}>
        <h3 style={{ borderLeft: '3px solid #fff', paddingLeft: '15px' }}>ACTIVE_PROJECT_INVENTORY</h3>
        <div style={inventoryGrid}>
          {projects.map(p => (
            <div key={p.id} style={miniCard}>
              <div style={{display:'flex', alignItems:'center', gap: '15px'}}>
                <img src={p.image_url} style={miniThumb} alt="" />
                <div>
                  <div style={{fontSize: '14px', fontWeight: 'bold'}}>{p.title}</div>
                  <div style={{fontSize: '10px', color: '#666'}}>{p.role}</div>
                </div>
              </div>
              <Trash2 size={18} color="#ff4444" style={{cursor:'pointer'}} onClick={async () => { 
                if(window.confirm("Permanent Delete?")) { 
                  await supabase.from('projects').delete().eq('id', p.id); 
                  fetchData(); 
                } 
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const adminContainerStyle = { padding: '40px', background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'monospace' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' };
const panelStyle = { background: '#0f0f0f', padding: '25px', borderRadius: '12px', border: '1px solid #222', display: 'flex', flexDirection: 'column' };
const inputGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' };
const fieldStyle = { width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', outline: 'none', borderRadius: '6px' };
const actionButton = { width: '100%', padding: '14px', background: 'none', border: '1px solid #444', color: '#fff', cursor: 'pointer', fontWeight: 'bold', marginTop: 'auto' };
const pinInputStyle = { padding: '15px', fontSize: '32px', textAlign: 'center', width: '220px', background: '#111', color: '#00ff88', border: '1px solid #333', outline: 'none', borderRadius: '12px' };
const logoutButtonStyle = { background: '#ff444411', color: '#ff4444', border: '1px solid #ff4444', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '6px' };
const uploadContainer = { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', padding: '15px', background: '#111', borderRadius: '10px', border: '1px solid #222' };
const previewCircle = { width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #333' };
const uploadLabel = { background: '#222', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px dashed #444' };
const inventoryGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '25px' };
const miniCard = { padding: '15px', background: '#0f0f0f', border: '1px solid #222', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const miniThumb = { width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' };

export default AdminPanel;