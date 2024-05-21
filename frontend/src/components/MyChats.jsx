import { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { Box, Stack, Text } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { setSelectedChat, selectedChat, chats, setChats } = ChatState();
    useEffect(() => {
        const fetchChats = async () => {
            // console.log(user._id);
            try {
        
            const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + "/api/all-chats", {
                withCredentials: true,
                headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                },
            });
            setChats(response.data);
            console.log(response.data);
            } catch (error) {
            console.log('Error occured in fetching chats: ', error);
            }
        };

        
        setLoggedUser(JSON.parse(localStorage.getItem('user')));
        fetchChats();
    }, [setChats])

  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
    >
      <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      fontFamily="Work sans"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      >
        My Chats
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack sx={
            { 
           '::-webkit-scrollbar':{
                  display:'none'
              }
           }
         }>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {getSender(loggedUser, chat.users)}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats
