import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import {v1 as uuidv1} from 'uuid';
import './index.css';
// import Login from './Login.jsx';
import Auth from './Auth.jsx';


function App() {
  let [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  let [isAuth, setIsAuth] = useState(false);
  let [user, setUser] = useState(null);
  let [showAuth, setShowAuth] = useState(false);
  let [authChecked, setAuthChecked] = useState(false);

  let [prompt, setPrompt] = useState("");
  let [reply, setReply] = useState(null);
  let [currThreadId, setCurrThreadId] = useState(uuidv1());
  let [prevChats, setPrevChats] = useState([]); // Stores prompt and reply combo in a single array for a specific chat
  let [newChat, setNewChat] = useState(true);
  let [allThreads, setAllThreads] = useState([]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    theme,
    toggleTheme,
    isAuth, setIsAuth,
    user, setUser,
    showAuth, setShowAuth,
    authChecked, setAuthChecked
  };

  useEffect(() => {
    const checkAuth = async() => {
      try{
        const response = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include"
        });

        if(response.ok){
          const data = await response.json();
          setIsAuth(true);
          setUser(data);
        } else{
          setIsAuth(false);
          setUser(null);
        }

        setAuthChecked(true);
      } catch{
        setIsAuth(false);
        setUser(null);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className='main'>
      <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>

          {showAuth && <Auth />}
      </MyContext.Provider>
    </div>
  )
}

export default App