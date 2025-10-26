import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../utils/auth'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout() // Gọi API logout và xóa token
        } finally {
            router.push('/login') // Sau khi logout xong thì chuyển sang trang login
        }
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
            <header style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div
                    style={{
                        maxWidth: '1000px',
                        margin: '0 auto',
                        padding: '10px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>Activity Tracker</div>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link href="/dashboard">Dashboard</Link>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '14px' }}>
                                    {user.first_name} {user.last_name}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        fontSize: '14px',
                                        color: '#c0392b',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login">Login</Link>
                        )}
                    </nav>
                </div>
            </header>
            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px' }}>{children}</main>
        </div>
    )
}
