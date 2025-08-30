import { Routes, Route } from 'react-router-dom';
import Chat from './pages/chat';
import Settings from './pages/settings';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;