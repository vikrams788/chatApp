import { Box, FormControl, IconButton, Input, Spinner, Text } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider"
import { FaArrowLeft } from "react-icons/fa6";
import { getSender } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';

var socket, selectedChatCompare;

const SingleChat = () => {
    const { selectedChat, user, setSelectedChat } = ChatState();
    const [messages, setMessages] = useState();
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        socket = io(import.meta.env.VITE_REACT_APP_API_URL);
        socket.emit("setup", user);
        socket.on('connection', () => setSocketConnected(true))
    
        return () => {
          socket.disconnect();
        }
      }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if(!selectedChat) {
                return
            }
            try {
                setLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/all-messages/${selectedChat._id}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                    }
                });

                setMessages(response.data);
                socket.emit('join chat', selectedChat._id);
                setLoading(false);
            } catch(error) {
                console.log("Error fetching messages: ", error);
            }
        }

        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
              //give notification
            } else {
              setMessages([...messages, newMessageRecieved])
            }
        })
      }, [messages])

    const sendMessage = async (e) => {
        if(e.key === 'Enter' && newMessage) {
            try {

                
                const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/send`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                    }
                });

                socket.emit('new message', response.data)

                setNewMessage("");

                console.log("Message Sent: ", response.data);
                setMessages([...messages, response.data])
            } catch (error) {
                console.log("Error sending message: ", error);
            }
        }
    };

  return (
    <>
      {selectedChat ? (
        <>
            <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            >
                <IconButton 
                display={{base: 'flex', md: 'none'}}
                icon={<FaArrowLeft size={24}/>}
                onClick={() => setSelectedChat("")}
                />
                {getSender(user, selectedChat.users)}
            </Text>
            <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            >
                {loading ? (
                    <Spinner 
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                    />
                ) : (
                    <div className="messages">
                        <ScrollableChat messages={messages}/>
                    </div>
                )}

                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    <Input 
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    />
                </FormControl>
            </Box>
        </>
      ) : (
        <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        h='100%'
        >
            <Text
            fontStyle='"Work Sans", sans-serif'
            fontWeight='300'
            fontSize='3xl'
            pb={3}
            >
                Click on a user to start chatting
            </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
