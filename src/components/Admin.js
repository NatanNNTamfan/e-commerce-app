import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Modal from 'react-modal';

Modal.setAppElement('#root');

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
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Data User</h2>
        <UserList data={users} />
      </div>
    </div>
  );
};


const TransactionList = ({ data }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

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
                  onClick={() => handleOpenModal(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Lihat Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={selectedOrder !== null}
        onRequestClose={handleCloseModal}
        contentLabel="Detail Pesanan"
        className="modal"
        overlayClassName="overlay"
        style={{
          overlay: {
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            position: 'absolute', // Important for centering
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Center with transform
            width: '50%',
            maxWidth: '500px',
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <h2 className="text-xl font-bold mb-4">Detail Pesanan</h2>
        {selectedOrder && (
          <div>
            <p>
              <strong>ID Pesanan:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Nama Penerima:</strong> {selectedOrder.recipientName}
            </p>
            <p>
              <strong>Alamat Pengiriman:</strong> {selectedOrder.shippingAddress}
            </p>
            <p>
              <strong>Catatan:</strong> {selectedOrder.note || '-'}
            </p>
            <h3 className="text-lg font-bold mt-4">Items:</h3>
            <ul>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item) => (
                  <li key={item.name}>
                    - {item.name} (Qty: {item.quantity})
                  </li>
                ))
              ) : (
                <li>Tidak ada item</li>
              )}
            </ul>
          </div>
        )}
        <button
          onClick={handleCloseModal}
          className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
        >
          Tutup
        </button>
      </Modal>
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

const UserList = ({ data }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Password</th>
              <th className="py-2 px-4 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.username} className="odd:bg-white even:bg-gray-100">
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.password}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default Admin;
