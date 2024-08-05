// import React, { useState } from 'react';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import './style.css'; // Import your CSS file
// import gemini from '../assets/img/gemini.webp';  

// function Chat() {
//     const [message, setMessage] = useState('');
//     const [chatLog, setChatLog] = useState([]);

//     const handleInputChange = (e) => {
//         setMessage(e.target.value);
//     };

//     const handleSendMessage = () => {
//         if (message.trim()) {
//             // Add the sent message to chat log
//             setChatLog(prevChatLog => [...prevChatLog, { text: message, sent: true }]);
//             setMessage('');

//             // Simulate receiving a message after a delay
//             setTimeout(() => {
//                 setChatLog(prevChatLog => [
//                     ...prevChatLog,
//                     { text: "This is a response message.", sent: false }
//                 ]);
//             }, 1000); // Simulate response delay
//         }
//     };

//     return (
//         <div className="chat-container">
//             <div className="header">
//                 <h3>
//                     <div className="image">
//                         <img src={gemini} className="img1" alt="Gemini" />
//                     </div>
//                 </h3>
//             </div>

//             <div className="info">
//                 <h4>- by Shivam Jani</h4>
//             </div>

//             <div className="chat-log">
//                 {chatLog.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={`chat-message ${msg.sent ? 'sent' : 'received'}`}
//                     >
//                         {msg.text}
//                     </div>
//                 ))}
//             </div>

//             <div className="input-container">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={handleInputChange}
//                     placeholder="Send a message."
//                 />
//                 <button onClick={handleSendMessage}>
//                     <i className="fa-solid fa-paper-plane"></i>
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Chat;


import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css'; 
import gemini from '../assets/img/gemini.webp';  

function Chat() {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatLogRef = useRef(null);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const formatMessage = (text) => {
        const lines = text.replace(/\*\*/g, '').split('\n').map(line => line.trim());

        let formattedText = [];
        let currentList = null;

        lines.forEach((line, index) => {
            if (line.match(/^\d+\./)) {
                if (!currentList) {
                    currentList = [];
                }
                currentList.push(<li key={index}>{line}</li>);
            } else if (line.startsWith('•') || line.startsWith('-') || line.match(/^[-*]\s/)) {
                if (!currentList) {
                    currentList = [];
                }
                currentList.push(<li key={index}>{line.substring(1).trim()}</li>);
            } else if (line.match(/^[A-Z].*:\s*$/)) {
                if (currentList) {
                    formattedText.push(<ul key={`list-${index}`}>{currentList}</ul>);
                    currentList = null;
                }
                formattedText.push(
                    <strong key={index} style={{ display: 'block', marginTop: '1em' }}>
                        {line.replace(':', '')}
                    </strong>
                );
            } else {
                if (currentList) {
                    formattedText.push(<ul key={`list-${index}`}>{currentList}</ul>);
                    currentList = null;
                }
                formattedText.push(<p key={index}>{line}</p>);
            }
        });

        if (currentList) {
            formattedText.push(<ul key="last-list">{currentList}</ul>);
        }

        return formattedText;
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            setChatLog(prevChatLog => [...prevChatLog, { text: message, sent: true }]);
            setMessage('');
            setIsLoading(true);

            setTimeout(async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const formattedText = formatMessage(result.response.text);
                        setChatLog(prevChatLog => [
                            ...prevChatLog,
                            { text: formattedText, sent: false }
                        ]);
                    } else {
                        console.error('Error:', response.status);
                        setChatLog(prevChatLog => [
                            ...prevChatLog,
                            { text: 'Error: Unable to get response.', sent: false }
                        ]);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setChatLog(prevChatLog => [
                        ...prevChatLog,
                        { text: 'Error: Unable to get response.', sent: false }
                    ]);
                }
                setIsLoading(false);
            }, 1000); 
        }
    };

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chatLog, isLoading]);

    return (
        <div className="chat-container">
            <div className="header">
                <h3>
                    <div className="image">
                        <img src={gemini} className="img1" alt="Gemini" />
                    </div>
                </h3>
            </div>

            <div className="info">
                <h4>- by Shivam Jani</h4>
            </div>

            <div className="chat-log" ref={chatLogRef}>
                {chatLog.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.sent ? 'sent' : 'received'}`}
                    >
                        <div className={`icon ${msg.sent ? 'sent-icon' : 'received-icon'}`}>
                            <i className={`fa-solid ${msg.sent ? 'fa-user' : 'fa-robot'}`}></i>
                        </div>
                        <div className="message-text">
                            {Array.isArray(msg.text) ? msg.text : <p>{msg.text}</p>}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message received">
                        <div className="icon">
                            <i className="fa-solid fa-robot"></i>
                        </div>
                        <div className="message-text">
                            Typing...
                        </div>
                    </div>
                )}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    placeholder="Send a message."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
                <button onClick={handleSendMessage} disabled={isLoading}>
                    <i className={`fa-solid ${isLoading ? 'fa-spinner fa-pulse' : 'fa-paper-plane'}`}></i>
                </button>
            </div>  
        </div>
    );
}

export default Chat;


