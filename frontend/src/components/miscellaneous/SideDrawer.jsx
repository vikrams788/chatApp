import { Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Spinner } from "@chakra-ui/react";
import { useState } from "react"
import { FaSearch, FaRegBell, FaChevronDown } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSearch = async (query) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/search`, {
                params: {query},
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
            });

            setSearchResults(response.data);
            setLoading(false);
        } catch (error) {
            console.log('Error occured in searching users: ', error);
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/logout`, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Credentials': true,
                },
            });

            navigate('/');
        } catch (error) {
            console.log("Error logging out", error)
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/chat/${userId}`, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Credentials': true,
                },
            });

            if (!chats.find((c) => c._id === response.data._id)) {
                setChats([response.data, ...chats]);
            }

            setSelectedChat(response.data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            console.log('Error occured in accessing chat(s)', error);
        }
    }

  return (
    <>
      <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
      >
        <Tooltip 
        label='Search users to chat with' 
        hasArrow 
        placement="bottom-end"
        >
            <Button 
            variant='ghost'
            onClick={onOpen}
            >
                <FaSearch size={24} />
                <Text
                display={{base: 'none', md: 'flex'}}
                px='4'
                >
                    Search User
                </Text>
            </Button>
        </Tooltip>
        <Text
        fontSize='2xl'
        fontFamily='"Work Sans", sans-serif'
        fontWeight='400'
        >
            Vikram&apos;s Chat App
        </Text>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Menu>
                <MenuButton 
                p='1'
                >
                    <FaRegBell size={24} style={{margin: 1}}/>
                </MenuButton>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                    <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
      </Box>

      <Drawer
      placement="left"
      onClose={onClose}
      isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
            <DrawerBody>
            <Box
            display='flex'
            pb={2}
            >
                <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    handleSearch(e.target.value);
                }}
              />
            </Box>
            {loading ? (
                <ChatLoading />
            ) : (
                searchResults?.map((user) => (
                    <UserListItem
                    key = {user._id}
                    user = {user}
                    handleFunction = {() => accessChat(user._id)}
                    />
                ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex'/>}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
