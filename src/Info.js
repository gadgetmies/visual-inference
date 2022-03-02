export default function Info({text, popupPosition}) {
  return <div className='popup-container'>
    <span className='popup-anchor'>ℹ️</span>
    <div className={`popup-content popup-to-${popupPosition}`}>{text}</div>
  </div>
}