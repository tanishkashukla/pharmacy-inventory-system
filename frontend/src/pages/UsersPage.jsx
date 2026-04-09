import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import userService from '../services/userService'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Pharmacist', password: '' })
  const [selectedUserId, setSelectedUserId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await userService.fetchUsers()
      setUsers(response.data)
    } catch (e) {
      toast.error('Failed to load users')
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email || formData.phone.length !== 10) {
      toast.error('Please fill required fields (Phone: 10 digits)')
      return
    }

    setLoading(true)
    try {
      if (selectedUserId) {
        await userService.updateUser(selectedUserId, formData)
        toast.success('User updated successfully')
      } else {
        await userService.addUser(formData)
        toast.success('User added successfully')
      }
      fetchUsers()
      handleReset()
    } catch (e) {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await userService.deleteUser(id)
      toast.success('User removed')
      fetchUsers()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', role: 'Pharmacist', password: '' })
    setSelectedUserId('')
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-700'
      case 'Pharmacist': return 'bg-blue-100 text-blue-700'
      default: return 'bg-teal-100 text-teal-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          {selectedUserId ? 'Modify User Access' : 'Register New User'}
        </h3>
        <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={e => e.preventDefault()}>
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone (10 digits)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <select name="role" value={formData.role} onChange={handleInputChange} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
            <option>Admin</option>
            <option>Pharmacist</option>
            <option>Inventory Manager</option>
          </select>
          <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Password" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <div className="flex gap-2 lg:col-span-1">
            <Button variant="primary" onClick={handleSave} disabled={loading}>{selectedUserId ? 'Update' : 'Add User'}</Button>
            <Button variant="outline" onClick={handleReset}>Reset</Button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <input 
          placeholder="Search by name or role..." 
          className="w-full max-w-sm rounded-xl border border-slate-300 px-4 py-2 shadow-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <button onClick={() => { setSelectedUserId(user.id); setFormData(user); }} className="text-brand-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredUsers.length && <p className="py-6 text-center text-slate-400">No users found.</p>}
        </div>
      </div>
    </div>
  )
}

export default UsersPage
