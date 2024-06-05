import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { notify } from '../notifications';

const Warehouse = () => {
  const [warehouseData, setWarehouseData] = useLocalStorage('warehouseData', []);
  const [formData, setFormData] = useState({ name: '', quantity: 0 });
  const [editingItem, setEditingItem] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem !== null) {
      handleUpdateItem(editingItem, formData);
    } else {
      const existingItemIndex = warehouseData.findIndex(
        (item) => item.name.toLowerCase() === formData.name.toLowerCase()
      );
      if (existingItemIndex !== -1) {
        notify('Item already exists!', 'error');
        return;
      }
      handleAddItem(formData);
    }
  };

  const handleAddItem = (newItem) => {
    setWarehouseData([...warehouseData, newItem]);
    setFormData({ name: '', quantity: 0 });
    notify('Item added!');
  };

  const handleDeleteItem = (index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedData = warehouseData.filter((_, i) => i !== index);
      setWarehouseData(updatedData);
      notify('Item deleted!');
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
    notify('Item updated!');
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', quantity: 0 });
    setEditingItem(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manajemen Stok</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block">
            Nama Barang:
          </label>
          <input
            type="text"
            id="itemName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="itemQuantity" className="block">
            Quantity:
          </label>
          <input
            type="number"
            id="itemQuantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <div className="flex space-x-2">
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
      <div className="mt-4">
        <h2 className="text-xl font-bold">Data Stok</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Item</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouseData.map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">{item.quantity}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEditItem(item, index)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(index)}
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
      </div>
    </div>
  );
};

export default Warehouse;