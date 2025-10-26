'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../utils/auth'
import { Layout } from '../components/Layout'
import axios from 'axios'


type Activity = {
    id: number
    user_id: number
    action: 'login' | 'logout' | 'search'
    timestamp: string
    metadata?: any
    user?: { first_name: string, last_name: string, email: string }
}

export default function Dashboard() {
    const { token } = useAuth()
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [filters, setFilters] = useState({ startDate: '', endDate: '', name: '', email: '', actions: [] as string[] })
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);


    useEffect(() => {
        if (token) {
            fetchActivities()

        }
    }, [token, page, limit])


    async function fetchActivities() {
        setLoading(true)
        try {
            const params: any = { page, limit }
            if (filters.startDate) params.startDate = localDateToUTCRange(filters.startDate)?.start;
            if (filters.endDate) params.endDate = localDateToUTCRange(filters.endDate)?.end;
            if (filters.name) params.name = filters.name
            if (filters.email) params.email = filters.email
            if (filters.actions.length) params.actions = filters.actions.join(',')
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/activities`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                params,
            })
            setActivities(res.data.data || res.data);
            setHasNextPage(res.data.meta.hasNextPage || false);
            setHasPrevPage(res.data.meta.hasPrevPage || false);
            setPage(res.data.meta.page || 1);
        } catch (err) {
            console.error(err)
        } finally { setLoading(false) }
    }

    function localDateToUTCRange(dateStr: string) {
        if (!dateStr) return null
        const date = new Date(dateStr)
        const tzOffset = date.getTimezoneOffset() // phút
        let res;
        if (tzOffset < 0) {
            res = new Date(date.getTime() + tzOffset * 60 * 1000);
        } else {
            res = new Date(date.getTime() - tzOffset * 60 * 1000);
        }

        const startDate = new Date(res);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(res);
        endDate.setHours(23, 59, 59, 999);

        return {
            start: startDate.toISOString(),
            end: endDate.toISOString()
        }
    }


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchActivities()
    }

    return (
        <Layout>
            <div className="card">
                <h2 style={{ fontSize: 18, marginBottom: 12 }}>Activity Dashboard</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    <input type="date" className="input" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                    <input type="date" className="input" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                    <input placeholder="Name" className="input" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
                    <input placeholder="Email" className="input" value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} />
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <label style={{ fontSize: 13 }}>Actions:</label>
                        <label><input type="checkbox" onChange={e => {
                            const arr = filters.actions.slice()
                            if (e.target.checked) arr.push('login')
                            else { const i = arr.indexOf('login'); if (i >= 0) arr.splice(i, 1) }
                            setFilters({ ...filters, actions: arr })
                        }} /> Login</label>
                        <label><input type="checkbox" onChange={e => {
                            const arr = filters.actions.slice()
                            if (e.target.checked) arr.push('logout')
                            else { const i = arr.indexOf('logout'); if (i >= 0) arr.splice(i, 1) }
                            setFilters({ ...filters, actions: arr })
                        }} /> Logout</label>
                        <label><input type="checkbox" onChange={e => {
                            const arr = filters.actions.slice()
                            if (e.target.checked) arr.push('search')
                            else { const i = arr.indexOf('search'); if (i >= 0) arr.splice(i, 1) }
                            setFilters({ ...filters, actions: arr })
                        }} /> Search</label>
                        <button className="button" style={{ marginLeft: 8 }}>Apply</button>
                    </div>
                </form>


                <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Action</th>
                                <th>Time</th>
                                <th>Metadata</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5}>Loading...</td></tr>
                            ) : activities.length === 0 ? (
                                <tr><td colSpan={5}>No activities</td></tr>
                            ) : activities.map(act => (
                                <tr key={act.id}>
                                    <td>{act.user?.first_name} {act.user?.last_name}</td>
                                    <td>{act.user?.email}</td>
                                    <td>{act.action}</td>
                                    <td>{new Date(act.timestamp).toLocaleString()}</td>
                                    <td>{act.metadata ? JSON.stringify(act.metadata) : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="pager">
                        <button
                            className="button secondary"
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={!hasPrevPage}
                            style={{ marginRight: '10px' }}
                        >
                            Prev
                        </button>
                        <div className="text-muted">Page {page}</div>


                        <button
                            className="button secondary"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!hasNextPage}
                            style={{ marginLeft: '10px' }}
                        >
                            Next
                        </button>
                    </div>
                    <div>
                        <select value={limit} onChange={e => setLimit(Number(e.target.value))} className="input">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

        </Layout>
    )

}