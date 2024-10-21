import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DummyPaymentGateway = () => {
  const [processing, setProcessing] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadAvailable, setDownloadAvailable] = useState(false); // To control when to show download
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a 5-second delay before showing the payment form
    const timer = setTimeout(() => setProcessing(false), 5000);
    return () => clearTimeout(timer);
  }, []);

    // Retrieve donation details from localStorage
    const donationDetails = JSON.parse(localStorage.getItem('donationDetails'));
    const { donor_id, ngo_id, donation_amount } = donationDetails;
  
    const receiptContent = () => {
    // You can customize this with real transaction data
    return `Transaction Receipt\n\nDonor ID: ${donor_id}\nNGO ID: ${ngo_id}\nDonation Amount: Rs.${donation_amount}\nDate: ${new Date().toLocaleDateString()}\n\nThank you for your donation!`;
    };

  // const downloadReceipt = () => {
  //   const content = receiptContent();
  //   const blob = new Blob([content], { type: "text/plain" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "TransactionReceiptMaNGO.txt";
  //   link.click();
  //   URL.revokeObjectURL(url); // Clean up the URL
  
  const downloadInvoice = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/generate-invoice', {
        donor_id,
        ngo_id,
        donation_amount
      });

      // Create a blob from the base64 PDF response
      const blob = new Blob([Uint8Array.from(atob(response.data.pdf), c => c.charCodeAt(0))], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'TransactionInvoiceMaNGO.pdf';
      link.click();
      URL.revokeObjectURL(url);

      // Redirect after downloading the invoice
      setTimeout(() => {
        navigate('/dashboard/contributor');
      }, 2000); // Delay for user to see the invoice being downloaded
    } catch (err) {
      console.error('Error generating invoice:', err);
      alert('Error generating invoice');
    }
  };

    const skipDownload = () => {
        // Skip the receipt download and go to dashboard
        navigate("/dashboard/contributor");
    };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing delay
    setTimeout(async () => {
      setProcessing(false);
      setPaymentSuccess(true); // Show success tick animation

      setDownloadAvailable(true); // Show download button after the transaction

      if (donationDetails) {
        try {
          // Finalize donation by submitting to the backend
          const response = await axios.post('http://localhost:4000/api/donate', {
            donor_id,
            ngo_id,
            donation_amount,
          });
          console.log('Donation successful:', response.data);
          alert('Transaction Successful');
          setTimeout(() => navigate('/dashboard/contributor'), 10000); // Redirect after 10 seconds
        } catch (err) {
          console.error(
            'Error submitting donation after payment:',
            err.response ? err.response.data : err.message
          );
        }
      }
    }, 3000); // 3-second delay for payment processing simulation
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
      {processing ? (
        <div className="flex flex-col items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
          </svg>
          <span className="text-white mt-4">Processing...</span>
        </div>
      ) : paymentSuccess ? (
        <div className="flex flex-col items-center">
          <svg className="h-16 w-16 text-green-500" 
            viewBox="0 0 1024 1024" 
            fill="currentColor"
          >
        <path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm0 960C264.6 960 64 759.4 64 512S264.6 64 512 64s448 200.6 448 448-200.6 448-448 448zm250.7-597.3l-292.6 292.6c-6.2 6.2-14.3 9.3-22.6 9.3s-16.4-3.1-22.6-9.3l-146.3-146.3c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l123.7 123.7 270.3-270.3c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z" />
        </svg>
          <h2 className="text-3xl font-bold text-white mt-4">Transaction Successful!</h2>
          
          {/* Display Download and Skip Buttons at the top */}
          {downloadAvailable && (
              <div className="mb-4 flex justify-center gap-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={downloadInvoice}
                >
                  Download Receipt
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
                  onClick={skipDownload}
                >
                  No, Thanks
                </button>
              </div>
            )}
        </div>
      ) : (
        <form
          onSubmit={handlePayment}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg relative"
        >
          <h2 className="text-3xl font-bold mb-4">Payment Gateway</h2>

          {/* Payment Method Options */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Select Payment Method</label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_debit"
                  onChange={() => setSelectedMethod('credit_debit')}
                  className="mr-2"
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="netbanking"
                  onChange={() => setSelectedMethod('netbanking')}
                  className="mr-2"
                />
                <span>Netbanking</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  onChange={() => setSelectedMethod('upi')}
                  className="mr-2"
                />
                <span>UPI</span>
              </label>
            </div>
          </div>

          {/* Conditionally Render Form Based on Payment Method */}
          {selectedMethod === 'credit_debit' && (
            <div>
              <div className="mb-4">
                <label className="block text-lg mb-2">Card Number</label>
                <input type="text" className="w-full border p-2 rounded-md" required />
              </div>
              <div className="mb-4">
                <label className="block text-lg mb-2">Expiration Date</label>
                <input type="text" className="w-full border p-2 rounded-md" placeholder="MM/YY" required />
              </div>
              <div className="mb-4">
                <label className="block text-lg mb-2">CVV</label>
                <input type="text" className="w-full border p-2 rounded-md" required />
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="mb-4">
              <label className="block text-lg mb-2">Bank Name</label>
              <input type="text" className="w-full border p-2 rounded-md" required />
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div className="mb-4">
              <label className="block text-lg mb-2">UPI ID</label>
              <input type="text" className="w-full border p-2 rounded-md" required />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md"
          >
            Pay Now
          </button>
        </form>
      )}
    </div>
  );
};

export default DummyPaymentGateway;
