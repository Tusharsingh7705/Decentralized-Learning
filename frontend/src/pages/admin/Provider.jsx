import React from "react";
import ProviderReviewPanel from "./ProviderReviewPanel";

const Provider = () => {
  return (
    <div className="mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Provider Verification & Review</h2>
        <p className="text-gray-600 mt-2">Review provider profiles, verify documents, and manage verification status.</p>
      </div>
      <ProviderReviewPanel />
    </div>
  );
};

export default Provider;
