import { useContext, useState } from 'react';
import './public/ProfileModal.css';
import { MyContext } from './MyContext';

const EMOJI_LIST = ["😀", "😎", "🤓", "😊", "🤩", "🚀", "🐼", "🦊", "🐶", "🐱", "🦁", "🐸", "🐧", "🦄"];

function ProfileModal() {
    const { user, setUser, setShowProfile } = useContext(MyContext);

    const [email, setEmail] = useState(user?.email || "");
    const [emoji, setEmoji] = useState(user?.emoji || "😀");

    const [passwordUnlocked, setPasswordUnlocked] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    
    const [showVerifyBox, setShowVerifyBox] = useState(false);
    const [verifyPasswordInput, setVerifyPasswordInput] = useState("");
    const [verifyError, setVerifyError] = useState("");
    
    const [loading, setLoading] = useState(false);

    const handleRandomEmoji = () => {
        const randomIndex = Math.floor(Math.random() * EMOJI_LIST.length);
        setEmoji(EMOJI_LIST[randomIndex]);
    };

    const handleVerifyPassword = async () => {
        setVerifyError("");
        if (!verifyPasswordInput) {
            setVerifyError("Please enter password");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/verify-password", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: verifyPasswordInput })
            });

            if (response.ok) {
                setPasswordUnlocked(true);
                setShowVerifyBox(false);
                setVerifyPasswordInput("");
            } else {
                const data = await response.json();
                setVerifyError(data.message || "Invalid password");
            }
        } catch (err) {
            setVerifyError("Failed to verify");
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const payload = { email, emoji };
            if (passwordUnlocked && newPassword) {
                payload.password = newPassword;
            }

            const response = await fetch("http://localhost:8080/api/auth/profile", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setShowProfile(false);
            } else {
                alert("Failed to update profile");
            }
        } catch (err) {
            console.error("Error updating profile", err);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-modal-overlay" onClick={() => setShowProfile(false)}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit profile</h2>
                
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar" onClick={handleRandomEmoji} title="Click to randomize emoji">
                        {emoji}
                        <div className="profile-avatar-edit-icon">
                            <i className="fa-solid fa-camera"></i>
                        </div>
                    </div>
                </div>

                <div className="profile-form-group">
                    <label>Email</label>
                    <div className="profile-input-wrapper">
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="profile-form-group">
                    <label>Password</label>
                    <div className="profile-input-wrapper">
                        <input 
                            type={passwordUnlocked ? "text" : "password"} 
                            value={passwordUnlocked ? newPassword : "lockedpassword"}
                            readOnly={!passwordUnlocked}
                            placeholder={passwordUnlocked ? "Enter new password" : ""}
                            onChange={(e) => passwordUnlocked && setNewPassword(e.target.value)} 
                        />
                        <i 
                            className={`profile-lock-icon fa-solid ${passwordUnlocked ? "fa-unlock" : "fa-lock"}`}
                            onClick={() => {
                                if (!passwordUnlocked) setShowVerifyBox(!showVerifyBox);
                            }}
                            title={passwordUnlocked ? "Unlocked" : "Click to unlock and change"}
                        ></i>
                    </div>

                    {showVerifyBox && !passwordUnlocked && (
                        <div className="password-verify-box">
                            <p>Verify current password to change it</p>
                            <input 
                                type="password" 
                                placeholder="Current Password" 
                                value={verifyPasswordInput}
                                onChange={(e) => setVerifyPasswordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
                            />
                            <div className="password-verify-actions">
                                <span className="error">{verifyError}</span>
                                <button onClick={handleVerifyPassword}>Verify</button>
                            </div>
                        </div>
                    )}
                </div>

                <p className="profile-info-text">
                    Your profile helps people recognize you. Your email is used for login.
                </p>

                <div className="profile-actions">
                    <button className="btn-cancel" onClick={() => setShowProfile(false)}>Cancel</button>
                    <button className="btn-save" onClick={handleSaveProfile} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
