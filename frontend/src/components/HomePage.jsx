import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Signup from './Signup'
import Login from './Login'

function HomePage() {
  return (
    <Container maxW='xl' centerContent>
      <Box
      display='flex'
      justifyContent='center'
      p={3}
      bg={'white'}
      w='100%'
      m='40px 0 15px 0'
      borderRadius='lg'
      borderWidth='1px'
      >
        <Text textAlign='center' fontSize='4xl' fontFamily='"Work Sans", sans-serif' fontWeight='400' className='text'>Vikram&apos;s Chat App</Text>
      </Box>
      <Box p={4} borderRadius='lg' bg='white' width='100%' borderWidth='1px'>
      <Tabs variant='soft-rounded'>
        <TabList mb='1em'>
          <Tab width='50%'>Login</Tab>
          <Tab width='50%'>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login/>
          </TabPanel>
          <TabPanel>
            <Signup/>
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
