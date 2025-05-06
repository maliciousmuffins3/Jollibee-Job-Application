import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function AvailablePositions() {
  const [positions, setPositions] = useState([]);
  const [role, setRole] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all available positions
  const fetchPositions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/available_position/show-positions");
      setPositions(response.data);
    } catch (error) {
      console.error("Error fetching positions", error);
      toast.error("Failed to fetch positions.");
    }
  };

  // Add a new position
  const addPosition = async () => {
    if (!role || !requirements) {
      toast.error("Please provide both role and requirements.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/available_position/add-position", {
        role,
        requirements,
      });
      toast.success("Position added successfully!");
      setRole("");
      setRequirements("");
      setIsModalOpen(false);
      fetchPositions(); // Refresh the list of positions
    } catch (error) {
      console.error("Error adding position", error);
      toast.error("Failed to add position.");
    }
  };

  // Remove a position
  const removePosition = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/available_position/remove-position?id=${id}`);
      toast.success("Position removed successfully!");
      fetchPositions(); // Refresh the list of positions
    } catch (error) {
      console.error("Error removing position", error);
      toast.error("Failed to remove position.");
    }
  };

  // Close modal function
  const closeModal = () => setIsModalOpen(false);

  // Use effect to fetch positions on component mount
  useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-6">Available Positions</h1>

      {/* Button to open the modal */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Add New Position
        </button>
      </div>

      {/* Available Positions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {positions.map((position) => (
          <div
            key={position.id}
            className="bg-gray-800 text-white p-4 rounded-lg shadow-xl transition-all hover:shadow-2xl transform hover:scale-105"
          >
            <h3 className="text-lg font-semibold">{position.role}</h3>
            <p className="text-sm mt-2">{position.requirements}</p>
            <div className="mt-4 flex justify-between gap-4">
              <button
                className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700"
                onClick={() => removePosition(position.id)}
              >
                Remove
              </button>
              <button
                className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700"
                onClick={async () => {
                  const res = await axios.get(
                    `http://localhost:5000/available_position/get-position?id=${position.id}`
                  );
                  const data = res.data;
                  alert(`Role: ${data.role}\nRequirements: ${data.requirements}`);
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding new position */}
      {isModalOpen && (
        <div
          onClick={closeModal} // Close modal if clicking outside
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 "
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal when inside
            className="bg-gray-800 text-white rounded-lg p-6 w-full sm:w-96 shadow-lg animate__animated animate__fadeIn"
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-lg"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Add New Position</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input input-bordered w-full mt-1 py-2 px-3 rounded-md shadow-sm dark:text-white"
                placeholder="Enter role"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Requirements</label>
              <input
                type="text"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="input input-bordered w-full mt-1 py-2 px-3 rounded-md shadow-sm dark:text-white"
                placeholder="Enter requirements"
                
              />
            </div>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addPosition}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Add Position
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailablePositions;
