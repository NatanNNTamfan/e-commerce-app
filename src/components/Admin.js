import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const Admin = () => {
  const [warehouseData, setWarehouseData] = useLocalStorage('warehouseData', []);
  const [consumerData] = useLocalStorage('consumerData', []);
  const [users, setUsers] = useLocalStorage('users', []);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'consumer' });
  const [formData, setFormData] = useState({ name: '', quantity: 0 });
  const [editingItem, setEditingItem] = useState(null);

  const handleAddUser = () => {
    const userExists = users.find((user) => user.username === newUser.username);
    if (userExists) {
      alert('Username sudah terpakai!');
      return;
    }

    setUsers([...users, newUser]);
    setNewUser({ username: '', password: '', role: 'consumer' });
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddStock = (newItem) => {
    const existingItemIndex = warehouseData.findIndex(
      (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
    );
    if (existingItemIndex !== -1) {
      const updatedData = [...warehouseData];
      updatedData[existingItemIndex].quantity += newItem.quantity;
      setWarehouseData(updatedData);
    } else {
      setWarehouseData([...warehouseData, newItem]);
    }
  };

  const handleDeleteItem = (index) => {
    if (window.confirm('Yakin ingin menghapus item ini?')) {
      const updatedData = warehouseData.filter((_, i) => i !== index);
      setWarehouseData(updatedData);
    }
  };

  const handleEditItem = (item, index) => {
    setFormData({ name: item.name, quantity: item.quantity });
    setEditingItem(index);
  };

  const handleUpdateItem = (index, updatedItem) => {
    const updatedData = warehouseData.map((item, i) =>
      i === index ? { ...updatedItem, quantity: parseInt(updatedItem.quantity) } : item
    );
    setWarehouseData(updatedData);
    setFormData({ name: '', quantity: 0 });
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', quantity: 0 });
    setEditingItem(null);
  };

  const handleChangeStock = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value });
  };

  const handleSubmitStock = (e) => {
    e.preventDefault();
    if (editingItem !== null) {
      handleUpdateItem(editingItem, formData);
    } else {
      handleAddStock(formData);
      setFormData({ name: '', quantity: 0 });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>

      {/* Tambah User Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Tambah User</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleChangeUser}
            className="border rounded px-2 py-1 flex-grow"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChangeUser}
            className="border rounded px-2 py-1"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleChangeUser}
            className="border rounded px-2 py-1"
          >
            <option value="consumer">Consumer</option>
            <option value="cashier">Cashier</option>
            <option value="warehouse">Warehouse</option>
            <option value="supplier">Supplier</option>
          </select>
          <button onClick={handleAddUser} className="bg-blue-500 text-white px-4 py-2 rounded">
            Tambah
          </button>
        </div>
      </div>

      {/* Data Transaksi Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Data Transaksi</h2>
        <TransactionList data={consumerData} />
      </div>

      {/* Data Stok Gudang Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">Data Stok Gudang</h2>
        <form onSubmit={handleSubmitStock} className="mb-4 space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              name="name"
              placeholder="Nama Barang"
              value={formData.name}
              onChange={handleChangeStock}
              className="border rounded px-2 py-1 flex-grow"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChangeStock}
              className="border rounded px-2 py-1"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {editingItem !== null ? 'Update Item' : 'Add Item'}
            </button>
            {editingItem !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <StockList data={warehouseData} onDelete={handleDeleteItem} onEdit={handleEditItem} />
      </div>
    </div>
  );
};

const TransactionList = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">ID Pesanan</th>
            <th className="py-2 px-4 border-b">Timestamp</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Nominal Pembayaran</th>
            <th className="py-2 px-4 border-b">Diskon</th>
            <th className="py-2 px-4 border-b">Detail Pesanan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4 border-b">{item.id}</td>
              <td className="py-2 px-4 border-b">{item.timestamp}</td>
              <td className="py-2 px-4 border-b">{item.status}</td>
              <td className="py-2 px-4 border-b">{item.payment || ''}</td>
              <td className="py-2 px-4 border-b">{item.discount || ''}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => {
                    // Check if items exist before mapping
                    const itemsDetail = item.items
                      ? item.items
                          .map((item) => `- ${item.name} (Qty: ${item.quantity})`)
                          .join('\n')
                      : 'Tidak ada item';
                    alert(
                      `Detail Pesanan:\n\nID Pesanan: ${item.id}\nNama Penerima: ${
                        item.recipientName
                      }\nAlamat Pengiriman: ${item.shippingAddress}\nCatatan: ${
                        item.note || '-'
                      }\n\nItems:\n${itemsDetail}`
                    );
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Lihat Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StockList = ({ data, onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Nama Barang</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">{item.quantity}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onEdit(item, index)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;