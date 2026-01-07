import './public/ChatWindow.css'
import Chat from './Chat.jsx';
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from 'react';
import {ScaleLoader}  from 'react-spinners';

function ChatWindow(){
    let {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat } = useContext(MyContext);
    let [loading, setLoading] = useState(false);
    let [isOpen, isSetOpen] = useState(false);

    const getReply = async() => {
        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
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
    }

    return <div className='chatwindow'>
        <div className="chat-nav">
            <span className='chat-logo'>
                <div>SigmaGPT <i className="fa-solid fa-angle-down"></i></div>
            </span>
            <span className="profile" onClick={handleProfileClick}><i className="fa-solid fa-user"></i></span>
        </div>
        <div>
            {
                isOpen && <div className="dropdown">
                    <div className="item">
                        <i className="fa-solid fa-info"></i>Your Profile
                    </div>
                    <div className="item">
                        <i className="fa-solid fa-square-caret-up"></i>Upgrade Plan
                    </div>
                    <div className="item">
                        <i className="fa-solid fa-gear"></i>Settings
                    </div>
                    <div className="item">
                        <i className="fa-solid fa-right-from-bracket"></i>Log Out
                    </div>
                </div>
            }
        </div>

        <Chat></Chat>

        <ScaleLoader color='#fff' loading={loading}></ScaleLoader>

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