import React from 'react'

// ## Analytics
  const AnalyticsSection = () => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Analytics 📊</h2>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Sessions', value: 98, color: 'bg-teal-50' },
          { label: 'Avg. Duration', value: '45 min', color: 'bg-fuchsia-50' },
          { label: 'Completion Rate', value: '95%', color: 'bg-orange-50' },
        ].map((item, index) => (
          <div key={index} className={`p-5 rounded-xl shadow-md ${item.color}`}>
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Earnings Trends (Recharts)</h3>
          <div className="h-64 flex items-center justify-center border border-dashed rounded-lg text-gray-400">
            Earnings Line Chart Component Placeholder
          </div>
          <p className="mt-4 text-sm text-gray-600">
            This chart visualizes your earnings over time, helping you identify seasonal trends or
            growth patterns.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Booking Trends (Recharts)</h3>
          <div className="h-64 flex items-center justify-center border border-dashed rounded-lg text-gray-400">
            Booking Bar Chart Component Placeholder
          </div>
          <p className="mt-4 text-sm text-gray-600">
            See your busiest days and hours to better manage your schedule and availability.
          </p>
        </div>
      </div>
    </div>
  );
export default AnalyticsSection;