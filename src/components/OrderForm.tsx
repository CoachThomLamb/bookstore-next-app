'use client';

import { useState } from 'react';
import { Book } from '@/lib/books';
import { submitOrder } from '@/app/actions/orderActions';

interface OrderFormProps {
  books: Book[];
}

interface OrderItem extends Book {
  quantity: number;
  itemTotal: number;
}

interface OrderInfo {
  groupName: string;
  contactPerson: string;
  email: string;
  phone: string;
  shippingAddress: string;
  notes: string;
  orderedBooks: OrderItem[];
  orderTotal: number;
}

export default function OrderForm({ books }: OrderFormProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(books.map(book => [book.code, 0]))
  );
  const [showModal, setShowModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleQuantityChange = (code: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [code]: Math.max(0, value)
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Collect ordered books
    const orderedBooks: OrderItem[] = [];
    let orderTotal = 0;
    
    books.forEach(book => {
      const quantity = quantities[book.code];
      if (quantity > 0) {
        const itemTotal = book.priceValue * quantity;
        orderTotal += itemTotal;
        orderedBooks.push({
          ...book,
          quantity,
          itemTotal
        });
      }
    });
    
    if (orderedBooks.length === 0) {
      alert('Please select at least one book to order.');
      return;
    }
    
    const info: OrderInfo = {
      groupName: formData.get('groupName') as string,
      contactPerson: formData.get('contactPerson') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || 'Not provided',
      shippingAddress: formData.get('shippingAddress') as string,
      notes: (formData.get('notes') as string) || 'None',
      orderedBooks,
      orderTotal
    };
    
    setOrderInfo(info);
    setShowModal(true);
  };

  const confirmOrder = async () => {
    if (!orderInfo) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const result = await submitOrder(orderInfo);
      
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message });
        setShowModal(false);
        
        // Reset form after successful submission
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setSubmitMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setSubmitMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success/Error Message */}
      {submitMessage && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitMessage.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <p className="font-semibold">
            {submitMessage.type === 'success' ? '✓ Success!' : '✗ Error'}
          </p>
          <p>{submitMessage.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="groupName" className="block font-bold text-gray-700 mb-2">
              Group Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="contactPerson" className="block font-bold text-gray-700 mb-2">
              Contact Person <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-bold text-gray-700 mb-2">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-bold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="shippingAddress" className="block font-bold text-gray-700 mb-2">
              Shipping Address <span className="text-red-600">*</span>
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block font-bold text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white text-gray-900"
            />
          </div>
        </div>

        {/* Book List */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Books</h2>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            {/* Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 font-bold grid grid-cols-[100px_1fr_100px_100px] gap-4 text-gray-800">
              <div>Code</div>
              <div>Title</div>
              <div>Price</div>
              <div>Quantity</div>
            </div>
            
            {/* Book Items */}
            <div>
              {books.map((book, index) => (
                <div
                  key={book.code}
                  className={`px-4 py-3 border-b border-gray-200 last:border-b-0 grid grid-cols-[100px_1fr_100px_100px] gap-4 items-center text-gray-800 ${
                    index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div>{book.code}</div>
                  <div>{book.title}</div>
                  <div>{book.price}</div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      value={quantities[book.code]}
                      onChange={(e) => handleQuantityChange(book.code, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center bg-white text-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mx-auto block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-48"
        >
          Submit Order
        </button>
      </form>

      {/* Order Summary Modal */}
      {showModal && orderInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="font-bold text-lg border-b pb-2 mb-4 text-gray-800">Customer Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Group Name:</strong> {orderInfo.groupName}</p>
                <p><strong>Contact Person:</strong> {orderInfo.contactPerson}</p>
                <p><strong>Email:</strong> {orderInfo.email}</p>
                <p><strong>Phone:</strong> {orderInfo.phone}</p>
                <p><strong>Shipping Address:</strong> {orderInfo.shippingAddress}</p>
                <p><strong>Special Instructions:</strong> {orderInfo.notes}</p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="mb-6">
              <h3 className="font-bold text-lg border-b pb-2 mb-4 text-gray-800">Ordered Items</h3>
              <div className="mb-4">
                <div className="grid grid-cols-[80px_1fr_80px_60px_80px] gap-2 font-bold border-b-2 pb-2 text-sm text-gray-800">
                  <div>Code</div>
                  <div>Title</div>
                  <div>Price</div>
                  <div>Qty</div>
                  <div className="text-right">Subtotal</div>
                </div>
                {orderInfo.orderedBooks.map((book) => (
                  <div
                    key={book.code}
                    className="grid grid-cols-[80px_1fr_80px_60px_80px] gap-2 border-b py-2 text-sm text-gray-700"
                  >
                    <div>{book.code}</div>
                    <div>{book.title}</div>
                    <div>{book.price}</div>
                    <div>{book.quantity}</div>
                    <div className="text-right">${book.itemTotal.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="text-right font-bold text-lg text-gray-800">
                Total: ${orderInfo.orderTotal.toFixed(2)}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="px-5 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit Order
              </button>
              <button
                onClick={confirmOrder}
                disabled={isSubmitting}
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
