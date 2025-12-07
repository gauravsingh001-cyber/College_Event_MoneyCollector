import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import EventPage from './pages/EventPage'
import CreateEvent from './pages/CreateEvent'
import AdminDashboard from './pages/AdminDashboard'
import './styles.css'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<Routes>
<Route path="/" element={<App />}>
<Route index element={<Home />} />
<Route path="event/:slug" element={<EventPage />} />
<Route path="create" element={<CreateEvent />} />
<Route path="admin/:eventId" element={<AdminDashboard />} />
</Route>
</Routes>
</BrowserRouter>
</React.StrictMode>
)