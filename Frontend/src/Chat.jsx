import './public/Chat.css';
import { useContext, useState, useEffect, useRef } from 'react';
import { MyContext } from './MyContext.jsx';

// For overall formating : react-markdown
// For code output formatting : rehype-highlight
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';


function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  let [latestReply, setLatestReply] = useState(null);
  const bottomRef = useRef(null);
  const chatsRef = useRef(null);

  useEffect(() => {
    if(reply === null){
        setLatestReply(null);
        return;
    }

    if (!prevChats?.length || typeof reply !== "string") return;
    setLatestReply("");

    let content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
        setLatestReply(content.slice(0, idx+1).join(" "));
        idx++;
        if(idx >= content.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);

  }, [reply]);

  // Auto-scroll to bottom on new message or typing update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [prevChats, latestReply]);

  return (
    <div className="chats">
        {newChat && (
            <div className="welcome-state">
                <p className="welcome-title">What can I help with?</p>
            </div>
        )}
        <div className='chat-body'>
            {
                prevChats?.slice(0, -1).map((chat, idx) => 
                    <div className={chat.roles === "user" ? "userDiv" : "gptDiv"} key={idx}>
                        {
                            chat.roles === "user" ? 
                            <div className='userMessage'>{chat.content}</div> : 
                            <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
                        }
                    </div>
                )
            }

            {
                prevChats.length > 0 && latestReply !== null && 
                <div className="gptDiv" key={"typing"}>
                    <div className="gptMessage">
                        <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                    </div>
                </div>
            }

            {
                prevChats.length > 0 && latestReply == null && 
                <div className="gptDiv" key={"typing"}>
                    <div className="gptMessage">
                        <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                    </div>
                </div>
            }
        </div>
        <div ref={bottomRef} />
    </div>
  );
}

export default Chat;