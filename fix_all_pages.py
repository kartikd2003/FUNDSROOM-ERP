import os

pages_dir = "e:/KARTIK/PROJECTS/Fundsroom/frontend/src/pages"

# Fix each file directly
files_to_fix = {}

# Customers.jsx - fix the remaining dupes
with open(os.path.join(pages_dir, "Customers.jsx"), "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '{can(PERMISSIONS.CUSTOMER_CREATE) && {can(PERMISSIONS.CUSTOMER_CREATE) && <Link to="/customers/add" className="btn btn-primary">+ Add Customer</Link>}}',
    '{can(PERMISSIONS.CUSTOMER_CREATE) && <Link to="/customers/add" className="btn btn-primary">+ Add Customer</Link>}'
)
content = content.replace(
    '<button className="btn btn-sm btn-success" {can(PERMISSIONS.CUSTOMER_UPDATE) && <button className="btn btn-sm btn-success" {can(PERMISSIONS.CUSTOMER_UPDATE) && <button className="btn btn-sm btn-success" onClick={() => navigate(`/customers/edit/${c.id}`)}>Edit</button>}}',
    '{can(PERMISSIONS.CUSTOMER_UPDATE) && <button className="btn btn-sm btn-success" onClick={() => navigate(`/customers/edit/${c.id}`)}>Edit</button>}'
)
content = content.replace(
    '<button className="btn btn-sm btn-danger" {can(PERMISSIONS.CUSTOMER_DELETE) && <button className="btn btn-sm btn-danger" {can(PERMISSIONS.CUSTOMER_DELETE) && <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Del</button>}}',
    '{can(PERMISSIONS.CUSTOMER_DELETE) && <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Del</button>}'
)
with open(os.path.join(pages_dir, "Customers.jsx"), "w", encoding="utf-8") as f:
    f.write(content)
print("Customers.jsx fixed")

# Categories.jsx - needs complete rewrite of the broken parts
with open(os.path.join(pages_dir, "Categories.jsx"), "r", encoding="utf-8") as f:
    content = f.read()

# Fix the add button area
old_add = "<h1>🏷️ Categories</h1>\n\n          + Add Category\n        </button>)}\n        </button>"
new_add = '<h1>🏷️ Categories</h1>\n        {can(PERMISSIONS.CATEGORY_CREATE) && (\n          <button className="btn btn-primary" onClick={() => { setForm({ name: \'\', description: \'\' }); setModal({ type: \'add\' }); }}>\n            + Add Category\n          </button>\n        )}'
content = content.replace(old_add, new_add)

# Fix edit button
old_edit = '<button className="btn btn-sm btn-primary" onClick={() => {can(PERMISSIONS.CATEGORY_UPDATE) && <button className="btn btn-sm btn-primary" onClick={() => openEdit(c)}>Edit</button>}'
new_edit = '{can(PERMISSIONS.CATEGORY_UPDATE) && <button className="btn btn-sm btn-primary" onClick={() => openEdit(c)}>Edit</button>}'
content = content.replace(old_edit, new_edit)

# Fix delete button
old_del = '<button className="btn btn-sm btn-danger" style={{ marginLeft: 4 }} {can(PERMISSIONS.CATEGORY_DELETE) && <button className="btn btn-sm btn-danger" style={{ marginLeft: 4 }} onClick={() => handleDelete(c.id)}>Delete</button>}'
new_del = '{can(PERMISSIONS.CATEGORY_DELETE) && <button className="btn btn-sm btn-danger" style={{ marginLeft: 4 }} onClick={() => handleDelete(c.id)}>Delete</button>}'
content = content.replace(old_del, new_del)

with open(os.path.join(pages_dir, "Categories.jsx"), "w", encoding="utf-8") as f:
    f.write(content)
print("Categories.jsx fixed")

# Warehouses.jsx - fix similarly
with open(os.path.join(pages_dir, "Warehouses.jsx"), "r", encoding="utf-8") as f:
    content = f.read()

old_add = "<h1>🏭 Warehouses</h1>\n        <button className=\"btn btn-primary\" {can(PERMISSIONS.WAREHOUSE_CREATE) && (<button className=\"btn btn-primary\" onClick={() => { setForm({ name: '', location: '' }); setModal({ type: 'add' }); }}>\n          + Add Warehouse\n        </button>)}\n        </button>"
new_add = '<h1>🏭 Warehouses</h1>\n        {can(PERMISSIONS.WAREHOUSE_CREATE) && (\n          <button className="btn btn-primary" onClick={() => { setForm({ name: \'\', location: \'\' }); setModal({ type: \'add\' }); }}>\n            + Add Warehouse\n          </button>\n        )}'
content = content.replace(old_add, new_add)

old_edit = '<button className="btn btn-sm btn-primary" onClick={() => {can(PERMISSIONS.WAREHOUSE_UPDATE) && <button className="btn btn-sm btn-primary" onClick={() => openEdit(w)}>Edit</button>}'
new_edit = '{can(PERMISSIONS.WAREHOUSE_UPDATE) && <button className="btn btn-sm btn-primary" onClick={() => openEdit(w)}>Edit</button>}'
content = content.replace(old_edit, new_edit)

old_del = '<button className="btn btn-sm btn-danger" style={{ marginLeft: 4 }} {can(PERMISSIONS.WAREHOUSE_DELETE) && <button className="btn btn-sm btn-danger" style={{ marginLeft: 4 }} onClick={() => handleDelete(w.id)}>Delete</button>}'
new_del = '{can(PERMISSIONS.WAREHOUSE_DELETE) && <button className="btn btn-sm btn-danger" style={{ marginLeft: 4 }} onClick={() => handleDelete(w.id)}>Delete</button>}'
content = content.replace(old_del, new_del)

with open(os.path.join(pages_dir, "Warehouses.jsx"), "w", encoding="utf-8") as f:
    f.write(content)
print("Warehouses.jsx fixed")

# Fix InventoryDashboard.jsx formatting
with open(os.path.join(pages_dir, "InventoryDashboard.jsx"), "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace(
    "  const { can } = useAuth();  const [summary, setSummary] = useState(null);",
    "  const { can } = useAuth();\n  const [summary, setSummary] = useState(null);"
)
with open(os.path.join(pages_dir, "InventoryDashboard.jsx"), "w", encoding="utf-8") as f:
    f.write(content)
print("InventoryDashboard.jsx fixed")

# Fix Customers.jsx - fix the bad spacing
with open(os.path.join(pages_dir, "Customers.jsx"), "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace(
    "  const { can } = useAuth();  const navigate = useNavigate();",
    "  const { can } = useAuth();\n  const navigate = useNavigate();"
)
with open(os.path.join(pages_dir, "Customers.jsx"), "w", encoding="utf-8") as f:
    f.write(content)
print("Customers.jsx spacing fixed")

print("\nDone!")
