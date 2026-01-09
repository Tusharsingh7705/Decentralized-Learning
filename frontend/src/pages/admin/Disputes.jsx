import React from "react";

const Disputes = ({ disputes }) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Dispute Resolution</h2>
      <p className="text-gray-600">Manage session disputes and trigger arbitration or contract dispute resolution.</p>
      <div className="mt-4 space-y-4">
        {Array.isArray(disputes) && disputes.map((dispute) => (
          <div key={dispute.id} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Dispute #{dispute.id}</h3>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  dispute.status === "Pending" ? "bg-yellow-400" : "bg-green-400"
                }`}
              >
                {dispute.status}
              </span>
            </div>
            <p className="text-gray-700 mt-2">
              <strong>Session:</strong> {dispute.session}<br />
              <strong>Filed by:</strong> {dispute.user}<br />
              <strong>Against:</strong> {dispute.provider}
            </p>
            {dispute.status === "Pending" && (
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Arbitrate
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                  View Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Disputes;
