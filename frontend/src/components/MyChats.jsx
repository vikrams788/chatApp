import { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
    useEffect(() => {
        const fetchChats = async () => {
            // console.log(user._id);
            try {
        
            const response = await axios.get("/api/chat", {
                withCredentials: true,
                headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Credentials': true,
                },
            });
            setChats(response.data);
            } catch (error) {
            console.log('Error occured in fetching chats: ', error);
            }
        };

        
        setLoggedUser(JSON.parse(localStorage.getItem('user')));
        fetchChats();
    }, [setChats])

  return (
    <div>
      My Chats
    </div>
  )
}

export default MyChats
