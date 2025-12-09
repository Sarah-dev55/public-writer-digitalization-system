import React, { useState, useMemo } from 'react';

export default function AvailabilityCalendar({ availability = [], onToggleDay = () => {} }) {
  // availability: array of { _id, date: 'YYYY-MM-DD', isRecurring, reason }
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = useMemo(() => {
    // first day of month (weekday)
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const prevDays = first; // number of leading slots from prev month
    const arr = [];
    // prev month placeholders
    for (let i = 0; i < prevDays; i++) arr.push({ date: null, prevMonth: true });
    for (let d = 1; d <= total; d++) arr.push({ date: d, prevMonth: false });
    return arr;
  }, [year, month]);

  // map availability dates to a Set of YYYY-MM-DD strings for quick lookup
  const availableSet = useMemo(() => {
    const s = new Set();
    availability.forEach((a) => {
      if (a && a.date) s.add(a.date);
    });
    return s;
  }, [availability]);

  const toggleDay = (day) => {
    if (!day) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isCurrentlyUnavailable = availableSet.has(dateStr);
    // Toggle: if unavailable, make available (remove); if available, make unavailable (add)
    onToggleDay(dateStr, !isCurrentlyUnavailable);
  };

  const isUnavailable = (day) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availableSet.has(dateStr);
  };

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const monthLabel = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Block Unavailable Dates</h3>
          <p className="text-sm text-gray-500">Click dates to toggle availability</p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-lg font-semibold text-gray-900 min-w-40 text-center">{monthLabel}</h4>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-600 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {daysInMonth.map((slot, idx) => {
            const day = slot.date;
            const unavail = day && isUnavailable(day);
            const isToday =
              day &&
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <button
                key={idx}
                onClick={() => toggleDay(day)}
                disabled={!day}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                  transition-all duration-200 cursor-pointer
                  ${!day ? 'text-gray-200 cursor-not-allowed' : ''}
                  ${day && !unavail ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : ''}
                  ${unavail ? 'bg-red-500 text-white border border-red-600 hover:bg-red-600' : ''}
                  ${isToday ? 'ring-2 ring-[#31493d]' : ''}
                `}
                title={day ? `${monthLabel} ${day}${isToday ? ' (Today)' : ''}` : ''}
              >
                {day || ''}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="border-t border-gray-200 pt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-50 border border-green-200" />
            <span className="text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span className="text-gray-700">Unavailable (Blocked)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border-2 border-[#31493d]" />
            <span className="text-gray-700">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
