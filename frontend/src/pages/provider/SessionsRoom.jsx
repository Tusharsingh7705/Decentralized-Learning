// SessionsRoom.jsx
import React from "react";

const SessionsRoom = ({ sessions }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">
      Sessions & Booking 🗓️
    </h2>

    {/* Calendar for Availability */}
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h3 className="text-xl font-semibold mb-4">Set Your Availability</h3>
      <div className="h-64 flex items-center justify-center border border-dashed rounded-lg text-gray-400">
        React Calendar Component Placeholder
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Drag and drop to block out unavailable times. Your schedule is
        automatically synced with learners.
      </p>
    </div>

    {/* Bookings List */}
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Upcoming Bookings</h3>
      <ul className="space-y-4">
        {sessions
          .filter((s) => s.status === "upcoming")
          .map((session) => (
            <li
              key={session.id}
              className="flex justify-between items-center p-4 border rounded-lg bg-indigo-50"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Session with <strong>{session.learner}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Time: <strong>{session.time}</strong>
                </p>
              </div>
              <button
                className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                /* Logic for WebRTC launch */
              >
                Start Session
              </button>
            </li>
          ))}
      </ul>
    </div>
  </div>
);

export default SessionsRoom;
