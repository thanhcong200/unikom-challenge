'use client'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../utils/auth'


export default function Login() {
    const { login } = useAuth()
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '', remember: false })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)


    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await login(form.email, form.password, form.remember)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Invalid credentials')
        } finally { setLoading(false) }
    }


    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div className="card">
                    <h2 style={{ fontSize: 20, marginBottom: 12 }}>Login</h2>
                    {error && <div style={{ color: '#b91c1c', marginBottom: 8 }}>{error}</div>}
                    <form onSubmit={submit}>
                        <div className="form-row"><input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                        <div className="form-row"><input className="input" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                        <div className="form-row"><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} /> Remember me</label></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button className="button" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                            <a style={{ fontSize: 13 }} href="/signup">Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}