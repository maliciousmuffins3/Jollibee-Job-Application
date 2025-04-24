import React from "react";
import { Calendar, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import profileSample from '../assets/profileSample.png';

const HistoryCard = ({ status = "Done" }) => {
  const statusColors = {
    Done: "bg-green-600",
    Canceled: "bg-red-600",
    Postponed: "bg-yellow-600",
    Pending: "bg-blue-600",
  };

  return (
      <div className="bg-gray-800 text-white shadow-lg w-96 p-4 rounded-2xl">
        <div>
          <div className="flex items-center space-x-4">
            <img
              src={profileSample}
              alt="Profile"
              className="rounded-full w-16 h-16 border border-gray-500"
            />
            <div>
              <h2 className="text-xl font-semibold">Matthew Roxas</h2>
              <p className="text-gray-400">Applying for: <span className="font-semibold">Software Engineer</span></p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-gray-400 mt-2">
              <Calendar className="w-5 h-5 mr-2" />
              <span>April 10, 2025</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <span className={`px-3 py-1 text-white rounded-full text-sm ${statusColors[status] || "bg-gray-600"}`}>
              {status}
            </span>
            <div className="flex space-x-2">
              {status === "Postponed" && (
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg flex items-center">
                  <RefreshCcw className="w-4 h-4 mr-1" /> Reschedule
                </button>
              )}
              {status === "Canceled" && (
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center">
                  <XCircle className="w-4 h-4 mr-1" /> Canceled
                </button>
              )}
              {status === "Done" && (
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" /> Completed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default HistoryCard;