import { useState } from "react";
import SearchBarHeader from "../components/SearchBarHeader";
import HistoryCard from "../components/HistoryCard";
import { Calendar } from "lucide-react";
import ScheduleCard from "../components/ScheduleCard";

function ScheduleMeeting() {
  return (
    <button className="btn btn-warning text-white flex items-center gap-2">
      <Calendar size={18} /> Schedule a Meeting
    </button>
  );
}

function AppointmentSchedule() {
  const [activeTab, setActiveTab] = useState("schedule"); // "schedule" or "history"

  return (
    <>
      <SearchBarHeader>
        <ScheduleMeeting />
      </SearchBarHeader>

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-4 p-4 border-b">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 font-semibold ${activeTab === "schedule" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
        >
          Schedule
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-semibold ${activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
        >
          History
        </button>
      </div>

      {/* Conditionally Render Cards Based on Active Tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-5">
        {activeTab === "history"
          ? // Render History Cards
            Array(4)
              .fill(null)
              .map((_, i) => <HistoryCard key={i} />)
          : // Render Schedule Cards
            Array(4)
              .fill(null)
              .map((_, i) => <ScheduleCard key={i} />)}
      </div>
    </>
  );
}

export default AppointmentSchedule;
