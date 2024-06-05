import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { notify } from '../notifications';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Cashier = () => {
  const [consumerData, setConsumerData] = useLocalStorage('consumerData', []);
  const [warehouseData, setWarehouseData] = useLocalStorage('warehouseData', []);
  const [stockRequests, setStockRequests] = useLocalStorage('stockRequests', []);

  const handleValidatePayment = (index, paymentData) => {
    const order = consumerData[index];

    // Check if all items in the order have enough stock
    const insufficientStockItems = order.items.filter((orderItem) => {
      const requestedItem = warehouseData.find((item) => item.name === orderItem.name);
      return !requestedItem || requestedItem.quantity < orderItem.quantity;
    });

    if (insufficientStockItems.length > 0) {
      notify(
        `Stok tidak cukup untuk item: ${insufficientStockItems
          .map((item) => item.name)
          .join(', ')}. Silahkan request stok.`,
        'error'
      );
      return;
    }

    // Update consumer data with payment and validated status
    setConsumerData((prevData) =>
      prevData.map((item, i) =>
        i === index
          ? {
              ...item,
              payment: parseFloat(paymentData.amount) || 0, // Update payment
              discount: parseFloat(paymentData.discount) || 0, // Update discount
              status: 'Validated',
            }
          : item
      )
    );

    // Update warehouse stock for each item in the order
    setWarehouseData((prevData) => {
      return prevData.map((item) => {
        const orderItem = order.items.find((orderItem) => orderItem.name === item.name);
        if (orderItem) {
          return { ...item, quantity: item.quantity - orderItem.quantity };
        }
        return item;
      });
    });

    notify('Payment validated!');
  };

  const handleRequestStock = (itemName, quantity) => {
    const newRequest = {
      id: Date.now(),
      itemName,
      quantity,
      status: 'Pending',
    };
    setStockRequests([...stockRequests, newRequest]);
    notify('Request stok telah dikirim!');
  };

  const handlePaySupplier = (requestId) => {
    const requestIndex = stockRequests.findIndex((req) => req.id === requestId);
    if (requestIndex === -1) {
      notify('Request tidak ditemukan!', 'error');
      return;
    }

    const updatedRequests = [...stockRequests];
    updatedRequests[requestIndex].status = 'Paid';
    setStockRequests(updatedRequests);

    const request = updatedRequests[requestIndex];
    setWarehouseData((prevData) => {
      const itemIndex = prevData.findIndex((item) => item.name === request.itemName);
      if (itemIndex !== -1) {
        const updatedData = [...prevData];
        updatedData[itemIndex].quantity += request.quantity;
        return updatedData;
      } else {
        // Handle case where item doesn't exist in warehouse (maybe add it?)
        return prevData;
      }
    });

    notify('Pembayaran ke supplier berhasil!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Validasi Transaksi</h1>
      <TransactionList data={consumerData} onValidate={handleValidatePayment} />
      <div className="mt-4">
        <h2 className="text-xl font-bold">Data Stok Barang</h2>
        <StockTable data={warehouseData} onRequestStock={handleRequestStock} />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Request Stok</h2>
        <StockRequestTable requests={stockRequests} onPaySupplier={handlePaySupplier} />
      </div>
    </div>
  );
};

const TransactionList = ({ data, onValidate }) => {
  const [paymentInput, setPaymentInput] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handlePaymentChange = (index, field, value) => {
    setPaymentInput((prevInput) => ({
      ...prevInput,
      [index]: { ...(prevInput[index] || {}), [field]: value },
    }));
  };

  const handleValidate = (index) => {
    onValidate(index, paymentInput[index] || {});
    setPaymentInput((prevInput) => {
      const { [index]: _, ...rest } = prevInput;
      return rest;
    });
  };

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
            <th className="py-2 px-4 border-b">Action</th>
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
              <td className="py-2 px-4 border-b">
                {item.status === 'Pending' && (
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Nominal"
                      onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                      className="border rounded px-2 w-24"
                    />
                    <input
                      type="number"
                      placeholder="Diskon"
                      onChange={(e) => handlePaymentChange(index, 'discount', e.target.value)}
                      className="border rounded px-2 w-20"
                    />
                    <button
                      onClick={() => handleValidate(index)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Validate
                    </button>
                  </div>
                )}
                {item.status !== 'Pending' && <span>Sudah diproses</span>}
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            maxWidth: '500px',
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          },
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

const StockTable = ({ data, onRequestStock }) => {
  const [requestQuantity, setRequestQuantity] = useState({});

  const handleQuantityChange = (itemName, value) => {
    setRequestQuantity((prev) => ({ ...prev, [itemName]: parseInt(value, 10) || 0 }));
  };

  const handleRequest = (itemName) => {
    onRequestStock(itemName, requestQuantity[itemName] || 0);
    setRequestQuantity((prev) => {
      const { [itemName]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Nama Barang</th>
            <th className="py-2 px-4 border-b">Stok Tersedia</th>
            <th className="py-2 px-4 border-b">Request Stok</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.name} className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">{item.quantity}</td>
              <td className="py-2 px-4 border-b">
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    placeholder="Jumlah"
                    onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                    className="border rounded px-2 py-1 w-24"
                  />
                  <button
                    onClick={() => handleRequest(item.name)}
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Request
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StockRequestTable = ({ requests, onPaySupplier }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">ID Request</th>
            <th className="py-2 px-4 border-b">Nama Barang</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4 border-b">{request.id}</td>
              <td className="py-2 px-4 border-b">{request.itemName}</td>
              <td className="py-2 px-4 border-b">{request.quantity}</td>
              <td className="py-2 px-4 border-b">{request.status}</td>
              <td className="py-2 px-4 border-b">
                {request.status === 'Pending' && (
                  <button
                    onClick={() => onPaySupplier(request.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Bayar Supplier
                  </button>
                )}
                {request.status !== 'Pending' && <span>Sudah diproses</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cashier;
