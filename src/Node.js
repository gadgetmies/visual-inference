import {useParams} from "react-router-dom"
import graph from './graph.js'
import * as R from 'ramda'
import NodeLink from './NodeLink.js';

export default function Node() {
  const nodeId = parseInt(useParams()?.nodeId, 10)
  const node = graph.find(R.propEq('id', nodeId || 0))
  const dependencies = graph.filter(({id}) => node.dependencies.some(R.propEq('id', id)))
  const provides = graph.filter(({dependencies}) => dependencies.some(R.propEq('id', node.id)))
  console.log({nodeId, node, dependencies, provides})

  return <div style={{display: 'flex', flexDirection: 'row'}}>
    <div style={{display: 'inline-block', flex: 1}}>
      {
        dependencies.map(({id, title}) =>
          <NodeLink key={id} id={id} title={title}
                    description={node.dependencies.find(R.propEq('id', id)).description}/>)
      }
    </div>
    <div style={{display: 'inline-block', flex: 1}}>
      <div className='node'>{node.title}</div>
    </div>
    <div style={{display: 'inline-block', flex: 1}}>
      {
        provides.map(({id, title, dependencies}) =>
          <NodeLink key={id} id={id} title={title} popupPosition={'left'}
                    description={dependencies.find(R.propEq('id', node.id)).description}/>)
      }
    </div>
  </div>
}