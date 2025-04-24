import React from "react";
import { Calendar, Clock, FileText, XCircle, RefreshCcw } from "lucide-react";
import "daisyui";
import profileSample from '../assets/profileSample.png';

const ScheduleCard = () => {
  return (
      <div className="bg-gray-800 text-white shadow-lg w-full max-w-sm p-4 rounded-2xl">
        <div className="flex items-center space-x-4">
          <img
            src={profileSample}
            alt="Profile"
            className="rounded-full w-16 h-16 border border-gray-500"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">Matthew Roxas</h2>
            <p className="text-gray-400 truncate">Age: 19</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-300 truncate">
            Applying for: <span className="font-semibold">Software Engineer</span>
          </p>
          <div className="flex items-center text-gray-400 mt-2">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="truncate">April 10, 2025</span>
          </div>
          <div className="flex items-center text-gray-400 mt-2">
            <Clock className="w-5 h-5 mr-2" />
            <span className="truncate">11:00 AM - 12:00 PM</span>
          </div>
        </div>
        {/* Button Layout Container */}
        <div className="mt-6 space-y-4">
          <button className="btn btn-primary text-white flex items-center w-full">
            <FileText className="w-4 h-4 mr-2" /> View Resume
          </button>
          {/* Button Flex Container for Reschedule & Cancel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="btn btn-warning text-white flex items-center w-full">
              <RefreshCcw className="w-4 h-4 mr-1" /> Reschedule
            </button>
            <button className="btn btn-error text-white flex items-center w-full">
              <XCircle className="w-4 h-4 mr-1" /> Cancel
            </button>
          </div>
        </div>
      </div>
  );
};

export default ScheduleCard;
