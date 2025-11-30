import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, X } from 'lucide-react';

const Book_model = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentType, setAppointmentType] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [noWorkDays, setNoWorkDays] = useState([]);
  const [notAvailableDates, setNotAvailableDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Appointment types
  const appointmentTypes = [
    { value: 'document-review', label: 'Document Review (45 minutes)' },
    { value: 'consultation', label: 'Consultation (30 minutes)' },
    { value: 'follow-up', label: 'Follow-up (20 minutes)' },
  ];

  // Helper to format date as YYYY-MM-DD
  const formatDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Fetch no-work-days from backend
  useEffect(() => {
    let mounted = true;
    async function fetchNoWorkDays() {
      try {
        // Replace with your actual API call
        // const res = await api.get('/noworkdays');
        // if (mounted) setNoWorkDays(res.data || []);
        
        // Demo data matching your API format (dates as YYYY-MM-DD strings)
        if (mounted) {
          setNoWorkDays([
            { date: '2025-12-01', isRecurring: false, reason: 'Holiday' },
            { date: '2025-12-15', isRecurring: false, reason: 'Office closed' },
            { date: '2025-12-25', isRecurring: false, reason: 'Christmas' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load noWorkDays', err);
        if (mounted) setNoWorkDays([]);
      }
    }
    fetchNoWorkDays();
    return () => { mounted = false; };
  }, []);

  // Fetch booked slots when date is selected
  useEffect(() => {
    if (!selectedDate) return;
    
    async function fetchBookedSlots() {
      try {
        const formattedDate = formatDate(selectedDate);
        // Simulated API call - replace with your actual API
        const res = await api.get(`/appointments/date/${formattedDate}`);
        const slots = res.data.map(apt => apt.timeSlot);
        setBookedSlots(slots);
        
        // Demo data
        setBookedSlots(['09:00 AM', '02:00 PM']);
      } catch (err) {
        console.error('Failed to load booked slots', err);
        setBookedSlots([]);
      }
    }
    fetchBookedSlots();
  }, [selectedDate]);

  // Recompute blocked dates when month or noWorkDays change
  useEffect(() => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    const blocked = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      d.setHours(0, 0, 0, 0); // Reset time for accurate comparison
      const dateStr = formatDate(d);

      // Block past dates (dates before today)
      if (d < today) {
        blocked.push(day);
        continue;
      }

      // Check if this date exists in noWorkDays array
      // Since your API returns dates as "YYYY-MM-DD" strings, we just check if the date matches
      const isBlocked = noWorkDays.some(nw => nw.date === dateStr);

      if (isBlocked) {
        blocked.push(day);
      }
    }

    setNotAvailableDates(blocked);
  }, [currentDate, noWorkDays]);

  // Time slots
  const getTimeSlots = () => [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDateDisplay = (date) => {
    if (!date) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const selectDate = (day) => {
    // Only allow selection if the date is NOT in the notAvailableDates array
    if (!notAvailableDates.includes(day)) {
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

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTimeSlot || !appointmentType) return;

    const payload = {
      date: formatDate(selectedDate),
      timeSlot: selectedTimeSlot,
      notes: additionalNotes,
      appointmentType,
      userId: '692cb332a4ba90e0b2dcb02f'
    };

    try {
      // Replace with your actual API call
      // const result = await createAppointment(payload);
      console.log('Booking appointment:', payload);
      alert('Appointment booked successfully!');
      setSelectedDate(null);
      setAppointmentType('');
      setSelectedTimeSlot('');
      setAdditionalNotes('');
      onClose();
    } catch (error) {
      const msg = error.message;
      alert('Error booking appointment: ' + msg);
    }
  };

  // Generate calendar days
  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isAvailable = !notAvailableDates.includes(day);
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
            ${!isAvailable ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
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
                    {formatDateDisplay(selectedDate)}
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
                      {getTimeSlots().map(time => {
                        const isBooked = bookedSlots.includes(time);
                        return (
                          <button
                            key={time}
                            onClick={() => !isBooked && setSelectedTimeSlot(time)}
                            disabled={isBooked}
                            className={`px-4 py-3 rounded-lg border flex items-center justify-center gap-2 transition-colors
                              ${isBooked ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : ''}
                              ${!isBooked && selectedTimeSlot === time 
                                ? 'bg-emerald-700 text-white border-emerald-700' 
                                : ''}
                              ${!isBooked && selectedTimeSlot !== time
                                ? 'bg-white border-gray-300 hover:border-emerald-500 text-gray-700'
                                : ''}
                            `}
                          >
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{time}</span>
                          </button>
                        );
                      })}
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

// Demo wrapper to test the component
export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800"
      >
        Open Booking Calendar
      </button>
      <Book_model isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}