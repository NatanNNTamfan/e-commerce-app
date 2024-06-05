import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { notify } from '../notifications';

const Consumer = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    recipientName: '',
    shippingAddress: '',
    note: '',
  });
  const [consumerData, setConsumerData] = useLocalStorage('consumerData', []);
  const [warehouseData] = useLocalStorage('warehouseData', []);
  const [availableItems, setAvailableItems] = useState([]);

  useEffect(() => {
    const uniqueItems = [...new Set(warehouseData.map((item) => item.name))];
    setAvailableItems(uniqueItems);
  }, [warehouseData]);

  const handleAddToCart = () => {
    const existingItemIndex = cartItems.findIndex((item) => item.name === formData.name);

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists in cart
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += formData.quantity;
      setCartItems(updatedCart);
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          name: formData.name,
          quantity: formData.quantity,
        },
      ]);
    }
    setFormData({ ...formData, name: '', quantity: 1 });
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value, 10) || 1 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      notify('Keranjang belanja kosong!', 'error');
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: cartItems,
      timestamp: new Date().toLocaleString(),
      status: 'Pending',
      payment: null,
      discount: null,
      recipientName: formData.recipientName,
      shippingAddress: formData.shippingAddress,
      note: formData.note,
    };

    setConsumerData([...consumerData, newOrder]);
    setCartItems([]);
    setFormData({
      name: '',
      quantity: 1,
      recipientName: '',
      shippingAddress: '',
      note: '',
    });
    notify('Order placed successfully!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Form Pembelian</h1>

      {/* Form and Cart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Form */}
        <div>
          <div className="space-y-4">
            <div>
              <label htmlFor="itemName" className="block">
                Nama Barang:
              </label>
              <select
                id="itemName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2"
                required
              >
                <option value="">Pilih Barang</option>
                {availableItems.map((itemName) => (
                  <option key={itemName} value={itemName}>
                    {itemName}
                  </option>
                ))}
              </select>
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
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>

          {/* Cart Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border-b">Nama Barang</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-100">
                    <td className="py-2 px-4 border-b">{item.name}</td>
                    <td className="py-2 px-4 border-b">{item.quantity}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleRemoveFromCart(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipientName" className="block">
              Nama Penerima:
            </label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="shippingAddress" className="block">
              Alamat Pengiriman:
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="note" className="block">
              Catatan (Opsional):
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Place Order
          </button>
        </form>
      </div>

      {/* Order Table (Removed for brevity) */}
    </div>
  );
};

export default Consumer;