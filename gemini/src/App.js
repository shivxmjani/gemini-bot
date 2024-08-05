// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Body from './components/Body';
import Chat from './components/Chat';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <Body /> */}
      <Router>
            <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/Chat" element={<Chat />} />
            </Routes>
        </Router> 
    </div>
  );
}

export default App; 
