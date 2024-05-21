import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import './App.css';
import ChatPage from './components/ChatPage';

function App() {

  let isLoggedIn = localStorage.getItem('token');

  return (
    <div className='App'>
        <Routes>
          <Route path='/' element = {<HomePage/>}/>
          <Route path='/chats' element = {isLoggedIn ? <ChatPage /> : <Navigate to='/' />}/>
        </Routes>
    </div>
  )
}

export default App