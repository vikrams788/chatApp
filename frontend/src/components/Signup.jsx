import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    pic: ''
  });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (files) {
      const file = files[0];
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
        setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleShowPassword = () => {
    setShow(!show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('pic', formData.pic);
      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/signup', data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Credentials': true,
        },
      });

      const token = response.data.token2;
      const user = response.data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/chats');

    } catch (error) {
      console.error('Error in login:', error.response.data.message);
    }
  };

  return (
    <VStack spacing='5px' color='black'>
      <FormControl isRequired id='name'>
        <FormLabel>
          Name
        </FormLabel>
        <Input 
        placeholder='Enter Your Name'
        onChange={handleChange}
        value={formData.name}
        name='name'
        />
      </FormControl>

      <FormControl isRequired id='email'>
        <FormLabel>
          Email
        </FormLabel>
        <Input 
        placeholder='Enter Your Email'
        onChange={handleChange}
        value={formData.email}
        name='email'
        />
      </FormControl>

      <FormControl isRequired id='password'>
        <FormLabel>
          Password
        </FormLabel>
        <InputGroup>
            <Input 
            type={show? 'text' : 'password'}
            placeholder='Enter Your Password'
            onChange={handleChange}
            value={formData.password}
            name='password'
            />
            <InputRightElement>
                <Button h='1.75rem' size='sm' onClick={handleShowPassword}>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>
          Profile Picture
        </FormLabel>
        <Input 
        type='file'
        p={1.5}
        onChange={handleChange}
        name='pic'
        accept='image/*'
        />
      </FormControl>

      <Button
      colorScheme='blue'
      width='100%'
      style={{marginTop: 15}}
      onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup
