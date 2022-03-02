import graph from './graph.js'
import {Link} from "react-router-dom";

export default function Nodes() {
  return <div>
    {
      graph.map(({id, title}) =>
        <Link key={id} to={`/${id}`} className='node'>{title}</Link>)
    }
  </div>
}