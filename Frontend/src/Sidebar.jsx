import './public/Sidebar.css'
import { useContext, useState, useEffect } from 'react';
import { MyContext } from './MyContext.jsx';
import {v1 as uuidv1} from 'uuid';


function Sidebar(){
    const {allThreads, setAllThreads, currThreadId, newChat, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, theme} = useContext(MyContext);

    const getAllThreads = async() => {
        try{
            let response = await fetch("http://localhost:8080/api/thread", {
                credentials: "include"
            });
            let res = await response.json();
            let filterData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filterData);

        } catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const showThread = async(newThreadId) => {
        setCurrThreadId(newThreadId);
        try{
            let response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                credentials: "include"
            });
            let res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err){
            console.log(err);
        }
    };

    const deleteThread = async(delThreadId) => {
        try{
            let response = await fetch(`http://localhost:8080/api/thread/${delThreadId}`, {
                method: "DELETE",
                credentials: "include"
            });
            let res = await response.json();
            console.log(res);

            // Re-render updated threads after delete
            setAllThreads(prev => prev.filter(thread => thread.threadId !== delThreadId));

            if(delThreadId === currThreadId){
                createNewChat();
            }
        }catch(err){
           console.log(err); 
        }
    };

    const logoSrc = theme === "dark" ? "src/assets/blacklogo.png": "src/assets/whitelogo.png";


    return <div className='sidebar'>
        <section className='sidebar-nav'>
            <img src={logoSrc} alt="logo" className='logo' />
            <span className='searchAndChat'>
                <i class="fa-solid fa-magnifying-glass search"></i>
                <i className="fa-solid fa-pen-to-square new-chat" onClick={createNewChat}></i>
            </span>
        </section>  
        <section className='history'>
            <ul>
                {
                    allThreads.map((thread, idx) => (
                        <li key={idx} onClick={(e) => showThread(thread.threadId)} className={thread.threadId === currThreadId ? "highlighted" : ""}>
                            <span>{thread.title}</span>
                            <i className="fa-solid fa-trash-can" onClick={(e) => {
                                e.stopPropagation() // Stops event bubbling
                                deleteThread(thread.threadId);
                            }}></i>
                        </li>
                    ))
                }
            </ul>
        </section>
        <section className='sidebar-footer'>
            <hr />
            <p>Made by Aditya Singh</p>
        </section>
    </div>
}

export default Sidebar;