import React from "react";

const Earnings = ({ formatCurrency }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Earnings & Payments 💰</h2>

    {/* Earnings Summary */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[
        { label: "Total Earned", value: formatCurrency(3500.0), color: "bg-green-50" },
        { label: "This Month", value: formatCurrency(750.0), color: "bg-blue-50" },
        { label: "Pending (Escrow)", value: formatCurrency(300.0), color: "bg-yellow-50" },
        { label: "Released", value: formatCurrency(3200.0), color: "bg-purple-50" },
      ].map((item, index) => (
        <div key={index} className={`p-5 rounded-xl shadow-md ${item.color}`}>
          <p className="text-sm font-medium text-gray-600">{item.label}</p>
          <p className="text-2xl font-extrabold text-gray-800 mt-1">{item.value}</p>
        </div>
      ))}
    </div>

    {/* Withdraw and Escrow */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Withdraw Funds</h3>
        <p className="mb-4 text-gray-600">
          Available to withdraw:{" "}
          <span className="font-bold text-green-700">{formatCurrency(300.0)}</span>
        </p>
        <button className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150">
          Withdraw via Smart Contract `release()`
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Note: Withdrawals are processed instantly via the smart contract to your linked wallet.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Escrow Tracking</h3>
        <p className="mb-4 text-gray-600">
          Funds are held securely in escrow until the session is completed.
        </p>
        <ul className="text-sm space-y-2">
          <li>
            Session ID <strong>#123</strong>: Learner A, {formatCurrency(50.0)},{" "}
            <span className="font-bold text-yellow-600">Pending</span>
          </li>
          <li>
            Session ID <strong>#122</strong>: Learner B, {formatCurrency(75.0)},{" "}
            <span className="font-bold text-yellow-600">Pending</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default Earnings;
