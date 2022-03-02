import {Link} from "react-router-dom";
import Info from './Info.js'

export default function NodeLink({id, title, description, popupPosition}) {
  return <div key={id} className='node'>
    <Link to={`/${id}`}>{title}</Link>&nbsp;
    {description ? <Info text={description} popupPosition={popupPosition} /> : null}
  </div>
}