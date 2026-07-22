import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function AuditLogs() {

  const { can } = useAuth();  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (actionFilter) params.action = actionFilter;
      const res = await api.get('/api/audit', { params });
      setLogs(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [actionFilter]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBadgeClass = (action) => {
    switch(action) {
      case 'CREATE': return 'badge-success';
      case 'UPDATE': return 'badge-info';
      case 'DELETE': return 'badge-danger';
      case 'STOCK_UPDATE': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📝 Audit Logs</h1>
      </div>

      <div className="filters-bar">
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="STOCK_UPDATE">STOCK UPDATE</option>
        </select>
      </div>

      {loading ? <div className="loading">Loading audit logs...</div> : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>Product ID</th>
                <th>Old Value</th>
                <th>New Value</th>
                <th>User ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No audit logs found</td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td><span className={`badge ${getBadgeClass(log.action)}`}>{log.action}</span></td>
                  <td>{log.productId || '-'}</td>
                  <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12 }}>
                    {log.oldValue ? JSON.stringify(log.oldValue).substring(0, 60) : '-'}
                  </td>
                  <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12 }}>
                    {log.newValue ? JSON.stringify(log.newValue).substring(0, 60) : '-'}
                  </td>
                  <td>{log.userId || '-'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


