import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from  'react-toastify'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    };

    const handleShowPassword = () => {
    setShow(!show);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/login', formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          });
    
          const token = response.data.token2;
          const user = response.data.user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
    
          navigate('/chats');
    
          toast.success('Logged in successfully', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });

          console.log(response.data)
    
        } catch (error) {
          console.error('Error in login:', error.response.data.message);
        }
    };

  return (
    <VStack spacing='5px' color='black'>

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

      <Button
      colorScheme='blue'
      width='100%'
      style={{marginTop: 15}}
      onClick={handleSubmit}
      >
        Login
      </Button>

      <Button
      variant='solid'
      colorScheme='red'
      width='100%'
      style={{marginTop: 15}}
      onClick={() => {
        setFormData({
            email: 'example@abc.com',
            password: '123456'
        })
      }}
      >
        Get guest user credentials
      </Button>
    </VStack>
  )
}

export default Login
