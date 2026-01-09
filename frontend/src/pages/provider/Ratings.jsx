import React from "react";

const Ratings = ({ averageRating, reviews }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Ratings & Reviews ⭐</h2>

    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <div className="flex items-center mb-4">
        <span className="text-6xl font-extrabold text-yellow-500 mr-4">
          {averageRating}
        </span>
        <div>
          <div className="flex text-2xl text-yellow-500">
            {"⭐".repeat(Math.round(averageRating))}
            {"☆".repeat(5 - Math.round(averageRating))}
          </div>
          <p className="text-sm text-gray-500">based on 45 verified reviews</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        On-chain proof (Last Rating): **0x...aBc9** -{" "}
        <a href="#" className="text-indigo-600 hover:underline">
          View Transaction 🔗
        </a>
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="border-b pb-3 last:border-b-0">
            <p className="font-semibold text-gray-800">
              {review.learner}: "{review.comment}" ({review.rating}/5)
            </p>
            <p className="text-xs text-gray-500 mt-1">Date: {review.date}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Ratings;
