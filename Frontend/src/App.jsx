import { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import {v1 as uuidv1} from 'uuid';


function App() {
  let [prompt, setPrompt] = useState("");
  let [reply, setReply] = useState(null);
  let [currThreadId, setCurrThreadId] = useState(uuidv1());
  let [prevChats, setPrevChats] = useState([]); // Stores prompt and reply combo in a single array for a specific chat
  let [newChat, setNewChat] = useState(true);
  let [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads
  };

  return (
    <div className='main'>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App