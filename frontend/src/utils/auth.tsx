'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'


const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'


type User = {
    id: number
    first_name: string
    last_name: string
    email: string
}


type AuthContextType = {
    user: User | null
    token: string | null
    login: (email: string, password: string, remember?: boolean) => Promise<void>
    signup: (payload: any) => Promise<void>
    logout: () => Promise<void>
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (t) {
            setToken(t)
            axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
            axios.get(`${API_BASE}/auth/me`)
                .then(res => setUser(res.data))
                .catch(() => {
                    setToken(null)
                    localStorage.removeItem('token')
                    sessionStorage.removeItem('token')
                })
        }
    }, [])

    const login = async (email: string, password: string, remember = false) => {
        const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
        const t = res.data?.data?.access_token
        setToken(t)
        if (remember) {
            localStorage.setItem('token', t)
        }
        else {
            sessionStorage.setItem('token', t)
        }
        const me = await axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${t}` } })
        setUser(me.data)
    }


    const signup = async (payload: any) => {
        await axios.post(`${API_BASE}/auth/signup`, payload)
    }


    const logout = async () => {
        try {
            if (token) {
                await axios.post(`${API_BASE}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
            }
        } finally {
            setUser(null)
            setToken(null)
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
        }
    }


    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export const localDateToUTCRange = (dateStr: string) => {
    const offset = new Date().getTimezoneOffset()
    const start = new Date(dateStr)
    start.setMinutes(start.getMinutes() - offset)
    const end = new Date(dateStr)
    end.setHours(23, 59, 59, 999)
    end.setMinutes(end.getMinutes() - offset)
    console.log(start.toString(), end.toString())
    return { start: start.toISOString(), end: end.toISOString() }
}