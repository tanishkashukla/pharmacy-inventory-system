import { useState, useEffect } from 'react'
import Button from '../components/Button'
import userService from '../services/userService'

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await userService.fetchUsers()
      setUsers(res.data)
    } catch (e) {
      console.error('Failed to load users for demo login')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulated match for Viva presentation
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (matchedUser) {
      onLogin(matchedUser)
    } else {
      // Fallback for demo roles if user not in DB yet
      if (email.includes('admin')) onLogin({ role: 'Admin', id: 'admin', name: 'Admin', email })
      else if (email.includes('buyer')) onLogin({ role: 'Buyer', id: 'buyer', name: 'Buyer', email })
      else onLogin({ role: 'Inventory Manager', id: 'manager', name: 'Manager', email })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold text-white">Rx</div>
          <h1 className="text-2xl font-bold text-slate-800">Pharmacy Inventory</h1>
          <p className="text-slate-500">Sign in to manage your stock</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" 
              placeholder="admin@pharma.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" 
              placeholder="••••••••"
            />
          </div>
          <Button variant="primary" type="submit" className="w-full py-3">Login</Button>
        </form>
        
        <div className="mt-8 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          <p className="font-semibold uppercase text-slate-400">Demo Login Details:</p>
          <ul className="mt-2 space-y-1">
            <li>Manager: manager@pharma.com</li>
            <li>Buyer: buyer@pharma.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
