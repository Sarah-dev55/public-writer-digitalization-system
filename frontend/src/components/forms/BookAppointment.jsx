import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, X } from 'lucide-react';

// ==================== FILE 1: components/forms/BookAppointment.jsx ====================

const Book_model = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentType, setAppointmentType] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Appointment types
  const appointmentTypes = [
    { value: 'document-review', label: 'Document Review (45 minutes)' },
    { value: 'consultation', label: 'Consultation (30 minutes)' },
    { value: 'follow-up', label: 'Follow-up (20 minutes)' },
  ];

  // Available dates (21 and 27 are available)
  const availableDates = [21, 27];

  // Time slots based on selected date
  const getTimeSlots = (date) => {
    if (!date) return [];
    return [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (date) => {
    if (!date) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const selectDate = (day) => {
    if (availableDates.includes(day)) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(newDate);
      setAppointmentType('');
      setSelectedTimeSlot('');
      setAdditionalNotes('');
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const handleConfirm = () => {
    alert('Appointment confirmed!');
    onClose();
    // Reset form
    setSelectedDate(null);
    setAppointmentType('');
    setSelectedTimeSlot('');
    setAdditionalNotes('');
  };

  // Generate calendar days
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isAvailable = availableDates.includes(day);
      const isSelected = selectedDate && selectedDate.getDate() === day && 
                         selectedDate.getMonth() === currentDate.getMonth();
      const isTodayDate = isToday(day);

      days.push(
        <button
          key={day}
          onClick={() => selectDate(day)}
          disabled={!isAvailable}
          className={`h-10 w-full rounded-lg flex items-center justify-center text-sm font-medium transition-colors
            ${isSelected ? 'bg-emerald-700 text-white' : ''}
            ${!isSelected && isAvailable ? 'hover:bg-emerald-50 text-gray-700' : ''}
            ${!isAvailable ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
            ${isTodayDate && !isSelected ? 'border-2 border-gray-900' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const showSummary = selectedDate && appointmentType && selectedTimeSlot;

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-hidden relative max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Calendar Section */}
          <div className="p-8 border-r border-gray-200">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleString('default', { month: 'long' })}
                </h2>
                <p className="text-gray-600">{currentDate.getFullYear()}</p>
              </div>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-600 h-8 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-gray-700">Legend:</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-900 rounded"></div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span className="text-sm text-gray-600">Unavailable</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 bg-gray-50 overflow-y-auto max-h-[90vh]">
            {!selectedDate ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Calendar className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">Select a date to view available time slots</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Date
                  </label>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatDate(selectedDate)}
                  </div>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="">Select appointment type</option>
                    {appointmentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Time Slots */}
                {appointmentType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {getTimeSlots(selectedDate).map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`px-4 py-3 rounded-lg border flex items-center justify-center gap-2 transition-colors
                            ${selectedTimeSlot === time 
                              ? 'bg-emerald-700 text-white border-emerald-700' 
                              : 'bg-white border-gray-300 hover:border-emerald-500 text-gray-700'
                            }
                          `}
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{time}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {appointmentType && selectedTimeSlot && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Any specific topics or documents you want to discuss..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      rows={3}
                    />
                  </div>
                )}

                {/* Appointment Summary */}
                {showSummary && (
                  <div className="bg-emerald-50 rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-gray-900 mb-3">Appointment Summary:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-24">Type:</span>
                        <span className="text-gray-900">
                          {appointmentTypes.find(t => t.value === appointmentType)?.label.split('(')[0].trim()}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-24">Date:</span>
                        <span className="text-gray-900">
                          {selectedDate.getMonth() + 1}/{selectedDate.getDate()}/{selectedDate.getFullYear()}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-24">Time:</span>
                        <span className="text-gray-900">{selectedTimeSlot}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-700 w-24">Duration:</span>
                        <span className="text-gray-900">
                          {appointmentTypes.find(t => t.value === appointmentType)?.label.match(/\(([^)]+)\)/)[1]}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Button */}
                {showSummary && (
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book_model;