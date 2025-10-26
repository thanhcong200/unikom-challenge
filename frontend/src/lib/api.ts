import axios from 'axios'


const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'


export const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
})


export function setAuthToken(token: string | null) {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete api.defaults.headers.common['Authorization']
}