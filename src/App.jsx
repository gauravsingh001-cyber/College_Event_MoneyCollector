import React from 'react'
import { Outlet, Link } from 'react-router-dom'


export default function App(){
return (
<div className="container">
<header className="header">
<h1>College Events Payments</h1>
<nav>
<Link to="/">Home</Link>
<Link to="/create">Create Event</Link>
</nav>
</header>
<main>
<Outlet />
</main>
<footer className="footer">Made for college events — simple & secure</footer>
</div>
)
}