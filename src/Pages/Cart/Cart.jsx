import PropTypes from "prop-types";
import ReviewModal from "./reviewModal";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";

const Cart = ({ booking, handleCancel }) => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
    Aos.refresh();
  }, []);

  // Ensure booking is available
  if (!booking) {
    return <div>No booking details available.</div>; // Fallback if booking is undefined
  }

  const {
    _id,
    checkInDate,
    checkOutDate,
    numRooms,
    numAdults,
    totalCost,
    type,
    image,
    pricePerNight,
    room_id,
  } = booking;

  // Function to format ISO date string into a readable date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(); // Formats date in user's local time zone
  };

  const handleDelete = (_id, checkInDate) => {
    const cancellationDeadline = moment(checkInDate).subtract(1, "days"); // 1 day before check-in date
    const currentDate = moment();

    // Check if it's within 1 day of check-in
    if (currentDate.isBefore(cancellationDeadline)) {
      handleCancel(_id); // Proceed with cancellation if before deadline
    } else {
      toast.error("Cannot cancel within 1 day of check-in date.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Your Bookings</h2>

      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group">
          <tr className="border border-gray-300 md:border-none block md:table-row">
            <th className="block md:table-cell p-2">Room Image</th>
            <th className="block md:table-cell p-2">Room Type</th>
            <th className="block md:table-cell p-2">Check-in Date</th>
            <th className="block md:table-cell p-2">Check-out Date</th>
            <th className="block md:table-cell p-2">Price/Night</th>
            <th className="block md:table-cell p-2">Total Cost</th>
            <th className="block md:table-cell p-2">Num Rooms</th>
            <th className="block md:table-cell p-2">Num Adults</th>
            <th className="block md:table-cell p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          <tr key={_id} className="block md:table-row">
            <td className="block md:table-cell p-2">
              <img
                src={image}
                alt={type}
                className="w-24 h-24 object-cover"
              />
            </td>
            <td className="block md:table-cell p-2">{type}</td>
            <td className="block md:table-cell p-2">{formatDate(checkInDate)}</td>
            <td className="block md:table-cell p-2">{formatDate(checkOutDate)}</td>
            <td className="block md:table-cell p-2">${pricePerNight}</td>
            <td className="block md:table-cell p-2">${totalCost}</td>
            <td className="block md:table-cell p-2">{numRooms}</td>
            <td className="block md:table-cell p-2">{numAdults}</td>
            <td className="block md:table-cell p-2">
              <div className="flex flex-col gap-2">
                <ReviewModal booking={booking} />
                <button
                  onClick={() => handleDelete(_id, checkInDate)}
                  className="btn btn-sm bg-red-600 text-white"
                >
                  Cancel
                </button>
                <Link to={`/update/${room_id}`}>
                  <button className="btn btn-sm bg-secondary text-white">
                    Update
                  </button>
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Cart.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    checkInDate: PropTypes.string.isRequired,
    checkOutDate: PropTypes.string.isRequired,
    numRooms: PropTypes.number.isRequired,
    numAdults: PropTypes.number.isRequired,
    totalCost: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    pricePerNight: PropTypes.number.isRequired,
    room_id: PropTypes.string.isRequired,
  }).isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default Cart;
