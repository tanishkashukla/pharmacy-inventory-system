import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import UserHistoryDrawer from '../components/UserHistoryDrawer'
import userService from '../services/userService'

const emptyForm = () => ({
  name: '',
  email: '',
  phone: '',
  role: 'Pharmacist',
})

function UsersPage() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [apiPassword, setApiPassword] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyUser, setHistoryUser] = useState(null)

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

    const existing = selectedUserId ? users.find((u) => u.id === selectedUserId) : null
    const password =
      selectedUserId && !apiPassword ? (existing?.password ?? '') : apiPassword
    const payload = { ...formData, password }

    setLoading(true)
    try {
      if (selectedUserId) {
        await userService.updateUser(selectedUserId, payload)
        toast.success('User updated successfully')
      } else {
        await userService.addUser(payload)
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
    setFormData(emptyForm())
    setApiPassword('')
    setSelectedUserId('')
  }

  const handleEditClick = (e, user) => {
    e.stopPropagation()
    setSelectedUserId(user.id)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    })
    setApiPassword(user.password ?? '')
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700'
      case 'Pharmacist':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-teal-100 text-teal-700'
    }
  }

  return (
    <div className="space-y-6">
      {historyUser && <UserHistoryDrawer user={historyUser} onClose={() => setHistoryUser(null)} />}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-lg font-semibold text-slate-800">
          {selectedUserId ? 'Modify user access' : 'Register new user'}
        </h3>
        <p className="mb-6 text-sm text-slate-500">Name, email, phone, and role only.</p>

        <form className="mx-auto max-w-3xl space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="user-name" className="text-xs font-semibold uppercase text-slate-400">
                Full name
              </label>
              <input
                id="user-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Jane Doe"
                autoComplete="name"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="user-email" className="text-xs font-semibold uppercase text-slate-400">
                Email
              </label>
              <input
                id="user-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@pharmacy.com"
                autoComplete="email"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="user-phone" className="text-xs font-semibold uppercase text-slate-400">
                Phone
              </label>
              <input
                id="user-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="user-role" className="text-xs font-semibold uppercase text-slate-400">
                Role
              </label>
              <select
                id="user-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option>Admin</option>
                <option>Pharmacist</option>
                <option>Inventory Manager</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {selectedUserId ? 'Update' : 'Add user'}
            </Button>
            <Button variant="outline" type="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <input
          placeholder="Search by name or role…"
          className="w-full max-w-sm rounded-xl border border-slate-300 px-4 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setHistoryUser(user)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setHistoryUser(user)
                    }
                  }}
                  className="cursor-pointer border-t border-slate-100 outline-none transition hover:bg-brand-50/40 focus-visible:bg-brand-50/60"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => handleEditClick(e, user)}
                      className="text-brand-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(user.id)
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
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
