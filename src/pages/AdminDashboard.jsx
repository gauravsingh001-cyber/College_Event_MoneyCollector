import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api'


export default function AdminDashboard(){
const { eventId } = useParams()
const [payments, setPayments] = useState([])
const [total, setTotal] = useState(0)


useEffect(()=>{
if(!eventId) return
API.get(`/payments/event/${eventId}`).then(r=>setPayments(r.data)).catch(console.error)
API.get(`/payments/stats/total?eventId=${eventId}`).then(r=>setTotal(r.data.total)).catch(console.error)
},[eventId])


return (
<div>
<div className="card">
<h3>Admin Dashboard</h3>
<p>Total collected: ₹{total}</p>
</div>
<div>
{payments.map(p=> (
<div key={p._id} className="card">
<p><strong>{p.payerName}</strong> — ₹{p.amount} — {p.status}</p>
<p>Mobile: {p.mobile} | Roll: {p.rollNo || '-'}</p>
<p>Address: {p.address}</p>
</div>
))}
</div>
</div>
)
}