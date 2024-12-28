import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Components/FirebaseProvider/FirebaseProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PageTitle from "../../Components/PageTitle/PageTitle";
import Aos from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import moment from "moment";
import { Link } from "react-router-dom";
import ReviewModal from "../Cart/reviewModal";
 // Ensure this is correctly imported

const Bookings = () => {
  const { user } = useContext(AuthContext); // Get user context
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
    Aos.refresh();
  }, []);

  useEffect(() => {
    if (user?.email) {
      const url = `https://assignment-11-server-umber-nine.vercel.app/bookings?email=${user.email}`;
      
      axios.get(url, { withCredentials: true })
        .then((res) => setBookings(res.data))
        .catch(err => console.error('Error fetching bookings:', err));
    }
  }, [user]);

  // Handle cancellation with SweetAlert confirmation
  const handleCancel = (id, checkInDate) => {
    const cancellationDeadline = moment(checkInDate).subtract(1, "days"); // 1 day before check-in date
    const currentDate = moment();

    // Check if within cancellation period
    if (currentDate.isBefore(cancellationDeadline)) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const deleteUrl = `https://assignment-11-server-umber-nine.vercel.app/booking/cancle/${id}`;

          axios.delete(deleteUrl)
            .then((response) => {
              if (response.data.deletedCount > 0) {
                toast.success("Deleted successfully");
                const remaining = bookings.filter((booking) => booking._id !== id);
                setBookings(remaining);
              }
            })
            .catch((error) => {
              console.error("Error deleting booking:", error);
              toast.error("An error occurred while deleting the booking.");
            });
        } else {
          Swal.fire("Cancelled", "Your booking is safe", "error");
        }
      });
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

  // Format the date into a more readable format
  const formatDate = (isoDate) => {
    return moment(isoDate).format("MM/DD/YYYY");
  };

  return (
    <div className="min-h-[calc(100vh-327px)]">
      <PageTitle title="Bookings" />
      <div
        className="hero h-[450px]"
        style={{
          backgroundImage:
            "url(https://i.ibb.co/Kzmm40K/pexels-quang-nguyen-vinh-222549-14036250.jpg)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-white font-marcellus" data-aos="fade-right">
              Your Bookings Here
            </h1>
            <p className="mb-5 text-white font-jost" data-aos="fade-left">
              A luxury boutique hotel in the heart of wine country
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto my-8">
        <h2 className="text-3xl font-bold mb-6">Your Bookings</h2>
        <div className="divider divider-secondary"></div>

        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto min-w-full border-collapse block md:table">
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
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border border-gray-300 md:border-none block md:table-row">
                    <td className="block md:table-cell p-2">
                      <img src={booking.image} alt={booking.type} className="w-24 h-24 object-cover" />
                    </td>
                    <td className="block md:table-cell p-2">{booking.type}</td>
                    <td className="block md:table-cell p-2">{formatDate(booking.checkInDate)}</td>
                    <td className="block md:table-cell p-2">{formatDate(booking.checkOutDate)}</td>
                    <td className="block md:table-cell p-2">${booking.pricePerNight}</td>
                    <td className="block md:table-cell p-2">${booking.totalCost}</td>
                    <td className="block md:table-cell p-2">{booking.numRooms}</td>
                    <td className="block md:table-cell p-2">{booking.numAdults}</td>
                    <td className="block md:table-cell p-2">
                      <div className="flex flex-col gap-2 ">
                        {/* Review Modal Button */}
                        <ReviewModal booking={booking} />

                        <button
                          onClick={() => handleCancel(booking._id, booking.checkInDate)}
                          className="btn btn-sm bg-red-600 text-white"
                        >
                          Cancel
                        </button>
                        <Link to={`/update/${booking.room_id}`}>
                          <button className="w-full btn btn-sm bg-secondary text-white">
                            Update
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No bookings found</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Bookings;
