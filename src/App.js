import "./App.css";
import Node from "./Node.js";
import Nodes from "./Nodes.js";
import Login from "./Login.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const [graph, setGraph] = useState({ nodes: [], connections: [] });
  const [password, setPassword] = useState("");

  useEffect(async () => {
    if (password === "") {
      return;
    }

    const res = await fetch(
      `https://google-sheet-server.herokuapp.com/api/1qbP4LUm-EZAB_Rn-ntIcec5EyE3uWiks6bfSUfEEnvM`,
      {
        headers: new Headers({
          Authorization: `Basic ${btoa(`6bet70y8Ri:${password}`)}`,
        }),
      }
    );

    const { sheets } = await res.json();

    const nodes = sheets[0].values.map(([title], id) => ({ id, title }));
    const connections = sheets[1].values.map(
      ([source, target, description]) => ({
        source: nodes.findIndex(({ title }) => title === source),
        target: nodes.findIndex(({ title }) => title === target),
        description,
      })
    );

    console.log(nodes, connections);
    return setGraph({ nodes, connections });
  }, [password]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            password === "" ? (
              <Login setPassword={setPassword} />
            ) : (
              <>
                {graph.nodes.length === 0 ? <div>Loading...</div> : null}
                <Nodes graph={graph} />
              </>
            )
          }
        />
        <Route
          path="/:nodeId"
          element={<Node graph={graph} sourceLevels={1} targetLevels={1} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
