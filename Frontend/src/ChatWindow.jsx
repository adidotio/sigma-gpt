import './public/ChatWindow.css'
import Chat from './Chat.jsx';
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect, useRef } from 'react';
import {ScaleLoader}  from 'react-spinners';

function ChatWindow(){
    let {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, theme, toggleTheme, setIsAuth, isAuth, setShowAuth, authChecked, user, setShowProfile} = useContext(MyContext);
    let [loading, setLoading] = useState(false);
    let [isOpen, isSetOpen] = useState(false);

    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if(
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ){
                isSetOpen(false);
            }
        };

        if(isOpen){
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if(e.key === "Escape"){
                isSetOpen(false);
            }
        };

        if(isOpen){
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);


    const getReply = async() => {
        if (!authChecked) return;

        if(!isAuth){
            setShowAuth(true);
            return;
        }

        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try{
            const response = await fetch("http://localhost:8080/api/chat", options);

            let res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch(err){
            console.log(`Some error occurred - ${err}`);
        }

        setLoading(false);
    }

    // Appending new chats to previous chats
    useEffect(() => {
        if (prompt && reply){
            setPrevChats(prevChats => (
                [...prevChats, {
                    roles: "user",
                    content: prompt
                },{
                    roles: "assistant",
                    content: reply
                }]
            ));
            setNewChat(false);
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => {
        isSetOpen(!isOpen);
    };


    const logout = async() => {
        await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        setIsAuth(false);
        isSetOpen(false);
    };

    return <div className='chatwindow'>
        <div className="chat-nav">
            <span className='chat-logo'>
                <div>SigmaGPT <i className="fa-solid fa-angle-down"></i></div>
            </span>
            <span className="theme-and-profile">
                <span className="theme-toggle" onClick={toggleTheme}>
                    <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                </span>

                {authChecked && !isAuth ? (
                    <span className="auth-links">
                    <span onClick={() => setShowAuth(true)}>Login</span>
                    <span className="divider">|</span>
                    <span onClick={() => setShowAuth(true)}>Sign up</span>
                    </span>
                ) : isAuth && (
                    <span className="profile" onClick={handleProfileClick}>
                        {user?.emoji ? 
                            <span style={{ fontSize: "1.2rem" }}>{user.emoji}</span> 
                            : <i className="fa-solid fa-user"></i>
                        }
                    </span>
                )}
            </span>

        </div>
        <div>
            {
                isOpen && <div className="dropdown" ref={dropdownRef}>
                    <div className="item" onClick={() => { setShowProfile(true); isSetOpen(false); }}>
                        <i className="fa-solid fa-info"></i>Your Profile
                    </div>
                    <div className="item">
                        <i className="fa-solid fa-square-caret-up"></i>Upgrade Plan
                    </div>
                    <div className="item">
                        <i className="fa-solid fa-gear"></i>Settings
                    </div>
                    <div className="item" onClick={logout}>
                        <i className="fa-solid fa-right-from-bracket"></i>Log Out
                    </div>
                </div>
            }
        </div>

        <Chat></Chat>

        <div className="loader-container">
            <ScaleLoader color='var(--text-color)' loading={loading} height={28} width={3} radius={3} margin={3}></ScaleLoader>
        </div>

        <div className="user-area">
            <div className="user-input">
                <input type="text" placeholder='Ask anything' value={prompt} onChange={(e) => {setPrompt(e.target.value)}} onKeyDown={(e) => {e.key === 'Enter' ? getReply() : ''}}/>
                <i className="fa-solid fa-paper-plane" onClick={getReply}></i>
            </div>
            <p className="info">ChatGPT can make mistakes. Check important info. See <a href="#">Cookie Preferences.</a></p>
        </div>
    </div>
}

export default ChatWindow;