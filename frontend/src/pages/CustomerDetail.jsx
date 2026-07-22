import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function CustomerDetail() {
    const { can } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [followUpNote, setFollowUpNote] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { fetchCustomer(); }, [id]);

    const fetchCustomer = async () => {
        try {
            const res = await axios.get('/api/customers/' + id + '/details');
            setCustomer(res.data.data);
        } catch (err) {
            setMessage('Failed to load customer details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFollowUp = async (e) => {
        e.preventDefault();
        if (!followUpNote.trim()) return;
        setSubmitting(true);
        try {
            const payload = { note: followUpNote };
            if (followUpDate) payload.followUpDate = followUpDate;
            await axios.post('/api/customers/' + id + '/followup', payload);
            setFollowUpNote('');
            setFollowUpDate('');
            setMessage('Follow-up added successfully');
            fetchCustomer();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to add follow-up');
        } finally {
            setSubmitting(false);
        }
    };

    const statusBadge = (status) => {
        const map = { LEAD: 'badge-warning', ACTIVE: 'badge-success', INACTIVE: 'badge-danger' };
        return 'badge ' + (map[status] || 'badge-info');
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!customer) return <div className="loading">Customer not found</div>;

    return (
        <div>
            <div className="page-header">
                <h1>{customer.customerName}</h1>
                <div className="header-actions">
                    <Link to="/customers" className="btn btn-outline">
                        Back to List
                    </Link>

                    {can(PERMISSIONS.CUSTOMER_UPDATE) && (
                        <Link
                            to={"/customers/edit/" + customer.id}
                            className="btn btn-primary"
                        >
                            Edit
                        </Link>
                    )}
                </div>
            </div>

            <div className="info-cards">
                <div className="table-container">
                    <h3>Customer Information</h3>
                    <table>
                        <tbody>
                            <tr><td>Full Name</td><td>{customer.customerName}</td></tr>
                            <tr><td>Business Name</td><td>{customer.businessName}</td></tr>
                            <tr><td>Mobile</td><td>{customer.mobile}</td></tr>
                            <tr><td>Email</td><td>{customer.email || '-'}</td></tr>
                            <tr><td>GST Number</td><td>{customer.gstNumber || '-'}</td></tr>
                            <tr><td>Type</td><td><span className="badge badge-info">{customer.customerType}</span></td></tr>
                            <tr><td>Status</td><td><span className={statusBadge(customer.status)}>{customer.status}</span></td></tr>
                            <tr><td>Follow-Up Date</td><td>{customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : '-'}</td></tr>
                            <tr><td>Address</td><td>{customer.address}</td></tr>
                            <tr><td>Notes</td><td>{customer.notes || '-'}</td></tr>
                            <tr><td>Created</td><td>{new Date(customer.createdAt).toLocaleDateString()}</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="table-container">
                    <h3>Add Follow-Up</h3>
                    <form onSubmit={handleAddFollowUp}>
                        <div className="form-group">
                            <label>Follow-Up Note *</label>
                            <textarea value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} rows={4} required minLength={5} />
                        </div>
                        <div className="form-group">
                            <label>Next Follow-Up Date</label>
                            <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting || !followUpNote.trim()}>
                            {submitting ? 'Saving...' : 'Add Follow-Up'}
                        </button>
                    </form>
                </div>


                <div className="followup-section">
                    <h3>Follow-Up History</h3>

                    {customer.followUps && customer.followUps.length > 0 ? (
                        <div className="activity-list">
                            {customer.followUps.map((f) => (
                                <div key={f.id} className="activity-item">
                                    <div className="activity-icon blue">#</div>

                                    <div className="activity-content">
                                        <p>{f.note}</p>

                                        <small>
                                            Added by{" "}
                                            {f.createdBy?.fullName ||
                                                f.createdBy?.email ||
                                                "Unknown"}{" "}
                                            on {new Date(f.createdAt).toLocaleString()}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p
                            style={{
                                padding: "20px 0",
                                textAlign: "center",
                                color: "#888",
                            }}
                        >
                            No follow-ups recorded yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
