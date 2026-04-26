import { useContext, useState } from 'react';
import './public/SettingsModal.css';
import { MyContext } from './MyContext';

function SettingsModal() {
    const { 
        theme, setTheme, toggleTheme, 
        setShowSettings, setShowProfile, 
        setIsAuth, user 
    } = useContext(MyContext);
    
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "General", icon: "fa-gear" },
        { id: "account", label: "Account", icon: "fa-user" }
    ];

    const handleThemeChange = (e) => {
        const selectedTheme = e.target.value;
        if (selectedTheme === "system") {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(systemPrefersDark ? "dark" : "light");
        } else {
            setTheme(selectedTheme);
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            setIsAuth(false);
            setShowSettings(false);
        } catch (err) {
            console.error("Sign out error", err);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/profile", {
                method: "DELETE",
                credentials: "include"
            });

            if (response.ok) {
                setIsAuth(false);
                setShowSettings(false);
                alert("Account successfully deleted.");
            } else {
                alert("Failed to delete account");
            }
        } catch (err) {
            console.error("Delete account error", err);
            alert("Error deleting account");
        }
    };

    const renderGeneralTab = () => (
        <>
            <div className="settings-row">
                <div className="settings-label">
                    <span className="settings-label-title">Theme</span>
                </div>
                <div className="settings-control">
                    <select value={theme === "light" ? "light" : "dark"} onChange={handleThemeChange}>
                        <option value="system">System</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>
            </div>
            
            <div className="settings-row">
                <div className="settings-label">
                    <span className="settings-label-title">Language</span>
                </div>
                <div className="settings-control">
                    <select defaultValue="auto">
                        <option value="auto">Auto-detect</option>
                        <option value="en">English (US)</option>
                    </select>
                </div>
            </div>

            <div className="settings-row">
                <div className="settings-label">
                    <span className="settings-label-title">Clear all chats</span>
                    <span className="settings-label-desc">Removes all local chat history</span>
                </div>
                <div className="settings-control">
                    <button className="btn-danger" onClick={() => alert("Cleared!")}>Clear</button>
                </div>
            </div>
        </>
    );

    const renderAccountTab = () => (
        <>
            <div className="settings-row">
                <div className="settings-label">
                    <span className="settings-label-title">Email</span>
                    <span className="settings-label-desc">{user?.email || "No email active"}</span>
                </div>
            </div>

            <div className="settings-row">
                <div className="settings-label">
                    <span className="settings-label-title">Profile</span>
                    <span className="settings-label-desc">Manage avatar and password</span>
                </div>
                <div className="settings-control">
                    <button onClick={() => { setShowSettings(false); setShowProfile(true); }}>Edit Profile</button>
                </div>
            </div>

            <div className="settings-row">
                <div className="settings-label">
                    <span className="settings-label-title">Sign Out</span>
                </div>
                <div className="settings-control">
                    <button onClick={handleSignOut}>Sign out</button>
                </div>
            </div>

            <div className="settings-row">
                <div className="settings-label">
                    <span className="settings-label-title">Delete Account</span>
                    <span className="settings-label-desc">Permanently erase account data</span>
                </div>
                <div className="settings-control">
                    <button className="btn-danger" onClick={handleDeleteAccount}>Delete</button>
                </div>
            </div>
        </>
    );

    return (
        <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <button className="settings-close-btn" onClick={() => setShowSettings(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                
                <div className="settings-sidebar">
                    {tabs.map(tab => (
                        <div 
                            key={tab.id} 
                            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i className={`fa-solid ${tab.icon}`}></i>
                            {tab.label}
                        </div>
                    ))}
                </div>
                
                <div className="settings-content-wrapper">
                    <h2>{activeTab === 'general' ? 'General' : 'Account'}</h2>
                    {activeTab === 'general' ? renderGeneralTab() : renderAccountTab()}
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
