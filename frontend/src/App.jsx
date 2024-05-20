import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import './App.css';
import ChatPage from './components/ChatPage';

function App() {

  return (
    <div className='App'>
        <Routes>
          <Route path='/' element = {<HomePage/>}/>
          <Route path='/chats' element = {<ChatPage/>}/>
        </Routes>
    </div>
  )
}

export default App