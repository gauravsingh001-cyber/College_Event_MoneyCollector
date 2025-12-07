import React, { useState } from 'react'
import API from '../api'


export default function CreateEvent(){
const [form, setForm] = useState({ title:'', description:'', date:'', price:0, organiser: { name:'', email:'', phone:'' } })
const [result, setResult] = useState(null)


async function handleCreate(e){
e.preventDefault()
const payload = {
title: form.title,
description: form.description,
date: form.date,
price: Number(form.price),
organiser: form.organiser
}
try{
const r = await API.post('/events', payload)
setResult(r.data)
}catch(err){ console.error(err); alert('Error creating event') }
}


return (
<div>
<div className="card">
<h3>Create Event</h3>
<form onSubmit={handleCreate}>
<div className="form-row"><label>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
<div className="form-row"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
<div className="form-row"><label>Date</label><input type="datetime-local" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
<div className="form-row"><label>Price (₹)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
<div className="form-row"><label>Organiser name</label><input value={form.organiser.name} onChange={e=>setForm({...form,organiser:{...form.organiser,name:e.target.value}})} /></div>
<div className="form-row"><label>Organiser email</label><input value={form.organiser.email} onChange={e=>setForm({...form,organiser:{...form.organiser,email:e.target.value}})} /></div>
<div className="form-row"><label>Organiser phone</label><input value={form.organiser.phone} onChange={e=>setForm({...form,organiser:{...form.organiser,phone:e.target.value}})} /></div>
<button className="button" type="submit">Create</button>
</form>
</div>


{result && (
<div className="card" style={{marginTop:12}}>
<h4>Event created</h4>
<p>Share link: <a href={result.shareUrl} target="_blank">{result.shareUrl}</a></p>
<p>QR: <img src={result.qrUrl} alt="qr" style={{width:150}}/></p>
</div>
)}
</div>
)
}