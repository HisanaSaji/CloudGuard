import React, { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const DateRangeFilter = ({ onDateRangeChange }) => {
  const [selectedOption, setSelectedOption] = useState('today');
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errors, setErrors] = useState({ fromDate: '', toDate: '' });

  // Calculate date ranges
  const today = new Date();
  const getDateString = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // Convert dd-mm-yyyy to yyyy-mm-dd for native date input
  const convertToDateInputFormat = (ddmmyyyy) => {
    if (!ddmmyyyy || ddmmyyyy.length !== 10) return '';
    const [d, m, y] = ddmmyyyy.split('-');
    return `${y}-${m}-${d}`;
  };

  // Convert yyyy-mm-dd from native date input to dd-mm-yyyy
  const convertFromDateInputFormat = (yyyymmdd) => {
    if (!yyyymmdd) return '';
    const [y, m, d] = yyyymmdd.split('-');
    return `${d}-${m}-${y}`;
  };

  const calculateDateRange = (option) => {
    const end = new Date();
    let start = new Date();

    switch (option) {
      case 'today':
        start = new Date(end);
        break;
      case 'yesterday':
        start.setDate(end.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'last7days':
        start.setDate(end.getDate() - 7);
        break;
      case 'last30days':
        start.setDate(end.getDate() - 30);
        break;
      default:
        break;
    }

    return { start: getDateString(start), end: getDateString(end) };
  };

  const handleOptionSelect = (option) => {
    if (option === 'custom') {
      setShowModal(true);
      setErrors({ fromDate: '', toDate: '' });
    } else {
      const { start, end } = calculateDateRange(option);
      setSelectedOption(option);
      onDateRangeChange({ from: start, to: end });
      setIsOpen(false);
    }
  };

  const validateDates = () => {
    const newErrors = { fromDate: '', toDate: '' };

    if (!fromDate.trim()) {
      newErrors.fromDate = 'From Date is required';
    }
    if (!toDate.trim()) {
      newErrors.toDate = 'To Date is required';
    }

    if (fromDate && toDate) {
      // Parse dates in dd-mm-yyyy format
      const parseDate = (dateStr) => {
        const [d, m, y] = dateStr.split('-');
        return new Date(y, m - 1, d);
      };

      const from = parseDate(fromDate);
      const to = parseDate(toDate);

      if (from > to) {
        newErrors.fromDate = 'From Date cannot be after To Date';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleApply = () => {
    if (validateDates()) {
      setSelectedOption('custom');
      onDateRangeChange({ from: fromDate, to: toDate });
      setShowModal(false);
      setIsOpen(false);
      setFromDate('');
      setToDate('');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setFromDate('');
    setToDate('');
    setErrors({ fromDate: '', toDate: '' });
  };

  const getDisplayLabel = () => {
    switch (selectedOption) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'last7days':
        return 'Last 7 Days';
      case 'last30days':
        return 'Last 30 Days';
      case 'custom':
        return 'Custom Range';
      default:
        return 'Today';
    }
  };

  return (
    <>
      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center bg-gray-800/70 hover:bg-gray-800 px-4 py-2 rounded-xl text-sm border border-gray-700 hover:border-gray-600 transition-all duration-200 text-white"
        >
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">{getDisplayLabel()}</span>
          <ChevronDown className={`w-4 h-4 ml-2 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-40">
            <button
              onClick={() => handleOptionSelect('today')}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors duration-150 first:rounded-t-xl text-sm ${selectedOption === 'today' ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-300'}`}
            >
              Today
            </button>
            <button
              onClick={() => handleOptionSelect('yesterday')}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors duration-150 text-sm ${selectedOption === 'yesterday' ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-300'}`}
            >
              Yesterday
            </button>
            <button
              onClick={() => handleOptionSelect('last7days')}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors duration-150 text-sm ${selectedOption === 'last7days' ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-300'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleOptionSelect('last30days')}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors duration-150 text-sm ${selectedOption === 'last30days' ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-300'}`}
            >
              Last 30 Days
            </button>
            <div className="border-t border-gray-700" />
            <button
              onClick={() => handleOptionSelect('custom')}
              className="w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors duration-150 last:rounded-b-xl text-sm text-gray-300"
            >
              Custom Range…
            </button>
          </div>
        )}
      </div>

      {/* Custom Date Range Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Custom Date Range</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date Inputs */}
            <div className="space-y-4 mb-6">
              {/* From Date Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={convertToDateInputFormat(fromDate)}
                    onChange={(e) => {
                      const formatted = convertFromDateInputFormat(e.target.value);
                      setFromDate(formatted);
                      if (errors.fromDate) {
                        setErrors(prev => ({ ...prev, fromDate: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-all duration-200 ${
                      errors.fromDate
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.fromDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.fromDate}</p>
                )}
              </div>

              {/* To Date Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">To Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={convertToDateInputFormat(toDate)}
                    onChange={(e) => {
                      const formatted = convertFromDateInputFormat(e.target.value);
                      setToDate(formatted);
                      if (errors.toDate) {
                        setErrors(prev => ({ ...prev, toDate: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-all duration-200 ${
                      errors.toDate
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.toDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.toDate}</p>
                )}
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors duration-200"
              >
                Apply
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateRangeFilter;
