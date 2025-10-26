'use client'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../utils/auth'


export default function Signup() {
    const { signup } = useAuth()
    const router = useRouter()
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', confirm_password: '' })
    const [errors, setErrors] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)


    function validate() {
        if (!form.first_name || !form.last_name || !form.email || !form.password || !form.confirm_password) return 'All fields are required.'
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Email is invalid.'
        if (form.password.length < 8) return 'Password must be at least 8 characters.'
        if (form.password !== form.confirm_password) return "Passwords don't match."
        return null
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const v = validate()
        if (v) return setErrors(v)
        setLoading(true)
        try {
            await signup({ first_name: form.first_name, last_name: form.last_name, email: form.email, password: form.password })
            router.push('/login')
        } catch (err: any) {
            setErrors(err?.response?.data?.message || 'Signup failed')
        } finally { setLoading(false) }
    }


    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div className="card">
                    <h2 style={{ fontSize: 20, marginBottom: 12 }}>Sign up</h2>
                    {errors && <div style={{ color: '#b91c1c', marginBottom: 8 }}>{errors}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-row"><input className="input" placeholder="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
                        <div className="form-row"><input className="input" placeholder="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
                        <div className="form-row"><input className="input" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                        <div className="form-row"><input className="input" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                        <div className="form-row"><input className="input" placeholder="Confirm password" type="password" value={form.confirm_password} onChange={e => setForm({ ...form, confirm_password: e.target.value })} /></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button className="button" disabled={loading}>{loading ? 'Signing...' : 'Sign up'}</button>
                            <a style={{ fontSize: 13 }} href="/login">Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}