import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { notify } from '../notifications';

const Supplier = () => {
  const [supplierData, setSupplierData] = useLocalStorage('supplierData', []);
  const [formData, setFormData] = useState({ name: '', quantity: 1, total_price: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value, 10) || 1 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPurchase = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toLocaleString(),
    };

    setSupplierData([...supplierData, newPurchase]);
    setFormData({ name: '', quantity: 1, total_price: 0 });
    notify('Purchase submitted!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Form Pembelian Supplier</h1>
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
            min="1"
            required
          />
        </div>
        <div>
          <label htmlFor="totalPrice" className="block">
            Total Price:
          </label>
          <input
            type="number"
            id="totalPrice"
            name="total_price"
            value={formData.total_price}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Data Pembelian Supplier</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">ID Pembelian</th>
                <th className="py-2 px-4 border-b">Nama Barang</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Total Price</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {supplierData.map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                  <td className="py-2 px-4 border-b">{item.id}</td>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">{item.quantity}</td>
                  <td className="py-2 px-4 border-b">{item.total_price}</td>
                  <td className="py-2 px-4 border-b">{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Supplier;