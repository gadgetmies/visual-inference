import './App.css';
import Node from './Node.js'
import Nodes from './Nodes.js'

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Nodes/>}/>
        <Route path="/:nodeId" element={<Node sourceLevels={2} targetLevels={2} />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
