import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function Customers() {

  const { can } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [message, setMessage] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy: 'createdAt', order: 'desc' };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.customerType = typeFilter;
      const res = await api.get('/api/customers', { params });
      const d = res.data;
      setCustomers(d.customers || []);
      setTotal(d.pagination?.total || 0);
      setTotalPages(d.pagination?.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, typeFilter]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleSearch = () => { setPage(1); };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/api/customers/${id}`);
      setMessage('Customer deleted successfully');
      fetchCustomers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error deleting customer');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/api/customers/${id}/status`, { status });
      setMessage(`Status updated to ${status}`);
      fetchCustomers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating status');
    }
  };

  const statusBadge = (status) => {
    const map = {
      LEAD: 'badge-warning',
      ACTIVE: 'badge-success',
      INACTIVE: 'badge-danger'
    };
    return `badge ${map[status] || 'badge-info'}`;
  };

  const typeBadge = (type) => {
    const map = {
      RETAIL: 'RETAIL',
      WHOLESALE: 'WHOLESALE',
      DISTRIBUTOR: 'DISTRIBUTOR'
    };
    return map[type] || type;
  };

  const totalPagesArr = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);

  return (
    <div>
      <div className="page-header">
        <h1>👥 Customers</h1>
        <div className="header-actions">
          {can(PERMISSIONS.CUSTOMER_CREATE) && <Link to="/customers/add" className="btn btn-primary">+ Add Customer</Link>}
        </div>
      </div>
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="Search by name, business, mobile or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="LEAD">Lead</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="RETAIL">Retail</option>
          <option value="WHOLESALE">Wholesale</option>
          <option value="DISTRIBUTOR">Distributor</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={() => { setPage(1); }}>Apply</button>
        <button className="btn btn-outline btn-sm" onClick={() => {
          setSearch(''); setStatusFilter(''); setTypeFilter(''); setPage(1);
        }}>Clear</button>
      </div>

      <div className="per-page" style={{ marginBottom: '12px' }}>
        <span>Show:</span>
        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>per page</span>
        <span style={{ marginLeft: 'auto', color: '#888' }}>{total} customers found</span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Business</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Follow-Up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>No customers found</td></tr>
            ) : customers.map(c => (
              <tr key={c.id}>
                <td>
                  <Link to={`/customers/${c.id}`} style={{ fontWeight: 600, color: '#3b82f6', textDecoration: 'none' }}>
                    {c.customerName}
                  </Link>
                </td>
                <td>{c.businessName}</td>
                <td>{c.mobile}</td>
                <td>{c.email || '-'}</td>
                <td><span className={`badge badge-info`}>{typeBadge(c.customerType)}</span></td>
                <td><span className={statusBadge(c.status)}>{c.status}</span></td>
                <td>{c.followUpDate ? new Date(c.followUpDate).toLocaleDateString() : '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button className="btn btn-sm btn-primary" onClick={() => navigate(`/customers/${c.id}`)}>View</button>
                    {can(PERMISSIONS.CUSTOMER_UPDATE) && <button className="btn btn-sm btn-success" onClick={() => navigate(`/customers/edit/${c.id}`)}>Edit</button>}
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      style={{ padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #d1d5db' }}
                    >
                      <option value="LEAD">Lead</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    {can(PERMISSIONS.CUSTOMER_DELETE) && <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Del</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        {totalPagesArr.map(p => (
          <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
        ))}
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        <span className="page-info">Page {page} of {totalPages || 1}</span>
      </div>
    </div>  
  );
}

