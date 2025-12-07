import React from 'react'
import { Link } from 'react-router-dom'
export default function EventCard({ event }){
return (
<div className="card">
<h4>{event.title}</h4>
<p style={{minHeight:40}}>{event.description}</p>
<p>Price: ₹{event.price}</p>
<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<Link to={`/event/${event.slug}`} className="button" style={{textDecoration:'none'}}>Open</Link>
<small style={{color:'#666'}}>{event.date ? new Date(event.date).toLocaleDateString() : ''}</small>
</div>
</div>
)
}