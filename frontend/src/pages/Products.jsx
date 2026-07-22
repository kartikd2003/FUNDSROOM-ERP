import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function Products() {
  const { can } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stockModal, setStockModal] = useState(null);
  const [stockQty, setStockQty] = useState('');
  const [stockReason, setStockReason] = useState('');
  const [imageModal, setImageModal] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, order };
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      if (warehouseId) params.warehouseId = warehouseId;
      if (stockStatus) params.stockStatus = stockStatus;
      const res = await axios.get('/api/products', { params });
      const d = res.data;
      setProducts(d.data || []);
      setTotalRecords(d.totalRecords || 0);
      setTotalPages(d.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, whRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/warehouses')
        ]);
        setCategories(catRes.data.data || []);
        setWarehouses(whRes.data.data || []);
      } catch (err) { console.error(err); }
    };
    fetchMeta();
  }, []);

  useEffect(() => { fetchProducts(); }, [page, limit, sortBy, order]);

  const handleSearch = () => { setPage(1); fetchProducts(); };
  const handleFilter = () => { setPage(1); fetchProducts(); };
  const handleClear = () => {
    setSearch(''); setCategoryId(''); setWarehouseId('');
    setStockStatus(''); setPage(1); setSortBy('createdAt'); setOrder('desc');
  };

  const handleStockIn = async (id) => {
    try {
      await axios.post(`/api/products/${id}/stock/in`, {
        quantity: parseInt(stockQty), warehouseId: 1, reason: stockReason, userId: 1
      });
      setMessage('Stock added successfully');
      setStockModal(null); setStockQty(''); setStockReason('');
      fetchProducts();
    } catch (err) { setMessage(err.response?.data?.message || 'Error'); }
  };

  const handleStockOut = async (id) => {
    try {
      await axios.post(`/api/products/${id}/stock/out`, {
        quantity: parseInt(stockQty), warehouseId: 1, reason: stockReason, userId: 1
      });
      setMessage('Stock removed successfully');
      setStockModal(null); setStockQty(''); setStockReason('');
      fetchProducts();
    } catch (err) { setMessage(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setMessage('Product deleted');
      fetchProducts();
    } catch (err) { setMessage(err.response?.data?.message || 'Error'); }
  };

  const handleImageUpload = async (id) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      await axios.post(`/api/products/${id}/image`, formData);
      setMessage('Image uploaded successfully');
      setImageModal(null); setSelectedFile(null);
      fetchProducts();
    } catch (err) { setMessage(err.response?.data?.message || 'Error'); }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get('/api/products/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) { setMessage('Export failed'); }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/products/import', formData);
      setMessage(`Import: ${res.data.data.imported} imported, ${res.data.data.failed} failed`);
    } catch (err) { setMessage(err.response?.data?.message || 'Import failed'); }
    e.target.value = '';
  };

  const formatCurrency = (val) => '₹' + Number(val).toLocaleString('en-IN');
  const totalPagesArr = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);

  return (
    <div>
      <div className="page-header">
        <h1>📦 Products</h1>
        <div className="header-actions">
          {can(PERMISSIONS.PRODUCT_CREATE) && (
            <Link to="/products/add" className="btn btn-primary">+ Add Product</Link>
          )}
          {can(PERMISSIONS.PRODUCT_EXPORT) && (
            <button className="btn btn-outline" onClick={handleExport}>Export CSV</button>
          )}
          {can(PERMISSIONS.PRODUCT_IMPORT) && (
            <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
              Import CSV
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
            </label>
          )}
        </div>
      </div>

      {message && <div className={`alert ${message.includes('Error') || message.includes('failed') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

      {/* Filters */}
      <div className="filters-bar">
        <input className="search-input" placeholder="Search by name, SKU or category..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
          <option value="">All Warehouses</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
          <option value="">All Stock</option>
          <option value="LOW">Low Stock</option>
          <option value="OUT">Out of Stock</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="productName">Name</option>
          <option value="unitPrice">Price</option>
          <option value="currentStock">Stock</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={handleFilter}>Apply</button>
        <button className="btn btn-outline btn-sm" onClick={handleClear}>Clear</button>
      </div>

      {/* Per Page */}
      <div className="per-page" style={{ marginBottom: '12px' }}>
        <span>Show:</span>
        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>per page</span>
        <span style={{ marginLeft: 'auto', color: '#888' }}>{totalRecords} products found</span>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Warehouse</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>No products found</td></tr>
            ) : products.map(p => (
              <tr key={p.id}>
                <td>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.productName} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 4, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>
                  )}
                </td>
                <td><strong>{p.productName}</strong></td>
                <td style={{ color: '#888' }}>{p.sku}</td>
                <td>{p.category?.name || '-'}</td>
                <td>{p.warehouse?.name || '-'}</td>
                <td>{formatCurrency(p.unitPrice)}</td>
                <td>
                  <span className={`badge ${p.currentStock <= p.minimumStock ? 'badge-danger' : p.currentStock === 0 ? 'badge-warning' : 'badge-success'}`}>
                    {p.currentStock}
                  </span>
                </td>
                <td>{p.minimumStock}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {can(PERMISSIONS.PRODUCT_UPDATE) && (
                      <Link to={`/products/edit/${p.id}`} className="btn btn-sm btn-primary">Edit</Link>
                    )}
                    {can(PERMISSIONS.INVENTORY_STOCK_IN) && (
                      <button className="btn btn-sm btn-success" onClick={() => setStockModal({ id: p.id, type: 'in' })}>IN</button>
                    )}
                    {can(PERMISSIONS.INVENTORY_STOCK_OUT) && (
                      <button className="btn btn-sm btn-warning" onClick={() => setStockModal({ id: p.id, type: 'out' })}>OUT</button>
                    )}
                    {can(PERMISSIONS.PRODUCT_UPLOAD_IMAGE) && (
                      <button className="btn btn-sm btn-outline" onClick={() => setImageModal(p.id)}>📷</button>
                    )}
                    {can(PERMISSIONS.PRODUCT_DELETE) && (
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Del</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        {totalPagesArr.map(p => (
          <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
        ))}
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        <span className="page-info">Page {page} of {totalPages || 1}</span>
      </div>

      {/* Stock Modal */}
      {stockModal && (
        <div className="modal-overlay" onClick={() => setStockModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{stockModal.type === 'in' ? '📥 Stock IN' : '📤 Stock OUT'}</h2>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" min="1" value={stockQty} onChange={e => setStockQty(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <input value={stockReason} onChange={e => setStockReason(e.target.value)} placeholder="e.g. Purchase, Sale" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setStockModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => stockModal.type === 'in' ? handleStockIn(stockModal.id) : handleStockOut(stockModal.id)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModal && (
        <div className="modal-overlay" onClick={() => setImageModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>📷 Upload Image</h2>
            <div className="form-group">
              <label>Product Image (JPG/PNG)</label>
              <input type="file" accept="image/jpeg,image/png" onChange={e => setSelectedFile(e.target.files[0])} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setImageModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleImageUpload(imageModal)} disabled={!selectedFile}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
