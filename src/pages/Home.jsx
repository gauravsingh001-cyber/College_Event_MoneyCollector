import React, { useEffect, useState } from 'react'
import API from '../api'
import EventCard from '../components/EventCard'


export default function Home(){
const [events, setEvents] = useState([])
const [total, setTotal] = useState(0)


useEffect(()=>{
API.get('/events').then(r=>setEvents(r.data)).catch(console.error)
API.get('/payments/stats/total').then(r=>setTotal(r.data.total)).catch(console.error)
},[])


return (
<div>
<div className="card">
<h2>Total Collected: ₹{total}</h2>
</div>
<h3>Upcoming Events</h3>
<div className="grid">
{events.map(ev=> <EventCard key={ev._id} event={ev} />)}
</div>
</div>
)
}