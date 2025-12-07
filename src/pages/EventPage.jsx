import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api'


function loadScript(src) {
return new Promise((resolve) => {
const script = document.createElement('script')
script.src = src
script.onload = () => resolve(true)
script.onerror = () => resolve(false)
document.body.appendChild(script)
})
}


export default function EventPage(){
const { slug } = useParams()
const [event, setEvent] = useState(null)
const [form, setForm] = useState({ payerName:'', mobile:'', address:'', rollNo:'' })
const [loading, setLoading] = useState(false)


useEffect(()=>{
API.get(`/events/${slug}`).then(r=>setEvent(r.data)).catch(()=>{})
},[slug])


async function handlePay(e){
e.preventDefault()
if(!event) return
setLoading(true)
try{
    const orderRes = await API.post(`/payments/order/${event._id}`, form)
const { orderId, amount, key, paymentId } = orderRes.data

const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
if(!ok){ alert('Razorpay SDK failed to load'); setLoading(false); return }

const options = {
key,
amount,
currency: 'INR',
name: event.title,
description: event.description || 'Event payment',
order_id: orderId,
prefill: { name: form.payerName, contact: form.mobile },
handler: async function(response){
// response has razorpay_payment_id, razorpay_order_id, razorpay_signature
try{
await API.post(`/payments/confirm/${paymentId}`, response)
alert('Payment successful — recorded')
window.location.reload()
}catch(err){ console.error(err); alert('Server verification failed') }
},
modal: { ondismiss: function(){ console.log('Checkout closed') } }
}


const rzp = new window.Razorpay(options)
rzp.open()


}catch(err){ console.error(err); alert('Error creating payment') }
setLoading(false)
}


if(!event) return <div>Loading...</div>
return (
<div>
<div className="card">
<h2>{event.title}</h2>
<p>{event.description}</p>
<p>Date: {event.date ? new Date(event.date).toLocaleString() : 'N/A'}</p>
<p>Price: ₹{event.price}</p>
</div>
<div className="card">
<h3>Pay for this event</h3>
<form onSubmit={handlePay}>
<div className="form-row"><label>Name</label><input value={form.payerName} onChange={e=>setForm({...form,payerName:e.target.value})} required/></div>
<div className="form-row"><label>Mobile</label><input value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} required/></div>
<div className="form-row"><label>Address</label><textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
<div className="form-row"><label>Roll No (if student)</label><input value={form.rollNo} onChange={e=>setForm({...form,rollNo:e.target.value})} /></div>
<button className="button" type="submit" disabled={loading}>{loading ? 'Processing...' : `Pay ₹${event.price}`}</button>
</form>
</div>
</div>
)
}