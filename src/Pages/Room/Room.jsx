import { FaCircle, FaRegClock } from "react-icons/fa";
import RoomCard from "./RoomCard";
import { TiPlus } from "react-icons/ti";
import PriceFilter from "./PriceFilter";
import { useEffect, useState } from "react";
import PageTitle from "../../Components/PageTitle/PageTitle";

import Aos from "aos";
import "aos/dist/aos.css";
import axios from 'axios'; // Missing import for axios

const Room = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  // Add state for error handling
  const [error, setError] = useState(null); // Added error state

  const [rooms, setRooms] = useState([]);

  const fetchRooms = async (minPrice, maxPrice) => {
    try {
      const response = await fetch(
        `https://assignment-11-server-umber-nine.vercel.app/rooms?minPrice=${
          minPrice || ""
        }&maxPrice=${maxPrice || ""}`
      );
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        console.error("Failed to fetch rooms:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms(); // Fetch all rooms initially
  }, []);

  const handleFilterChange = async (minPrice, maxPrice) => {
    fetchRooms(minPrice, maxPrice); // Fetch rooms with filter
  };

  const [review, setReview] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://assignment-11-server-umber-nine.vercel.app/reviews`);
        setReview(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };
    fetchData();
  }, []);


  // console.log(review)

  return (
    <div className="mb-14">
      <PageTitle title="Room"></PageTitle>
      {/* Hero Section */}
      <div
        className="hero h-[550px]"
        style={{
          backgroundImage:
            "url(https://i.ibb.co/FwrrV3D/pexels-jvdm-1457842.jpg)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md text-white space-y-5">
            <p data-aos="fade-right" className=" font-roboto font-semibold">
              OUR ACCOMMODATIONS
            </p>
            <p data-aos="fade-left" className=" font-marcellus text-7xl">
              Stay With Us
            </p>
            <p data-aos="fade-up" className=" font-roboto">
              Spend your comfortable holiday in the heart of the beautiful Napa
              Valley.
            </p>
          </div>
        </div>
      </div>
      {/* Room Selection Section */}
      <div>
        <div className=" my-10 lg:w-1/2 mx-auto text-center space-y-5">
          <p data-aos="fade-up" className=" font-roboto">
            WELCOME TO COZYSTAY LODGE
          </p>
          <p data-aos="fade-up" className=" font-marcellus text-5xl">
            Select Your Cozy Room
          </p>
          <p data-aos="fade-up" className=" font-marcellus">
            In a new setting composed of exceptional hotels chalets, nestled in
            a forest of pine trees, the CozyStay Lodge is expanding into a
            harmonious and refined unit that affirms it’s purpose: to sublimate
            the stay of its guests by a tailor-made service.
          </p>
          <div className="flex flex-col justify-center items-center mt-5 w-full font-roboto lg:flex-row">
            <p data-aos="fade-right" className="flex items-center gap-4">
              <span className="text-xl text-secondary">
                <FaRegClock />
              </span>
              CHECK IN: 3:00 PM
            </p>
            <div className="divider lg:divider-horizontal divider-secondary"></div>
            <p data-aos="fade-left" className="flex items-center gap-4">
              <span className="text-xl text-secondary">
                <FaRegClock />
              </span>
              CHECK OUT: 12:00 PM
            </p>
          </div>
        </div>
      </div>

   
  <h1 className="font-semibold text-3xl text-center">Our Hotel's Total Reviews: {review.length}</h1>

      {/* Price Filter and Room Cards */}
      <div className="container mx-auto grid grid-cols-1 gap-10 my-10">
        <PriceFilter onFilterChange={handleFilterChange}></PriceFilter>
        {rooms.map((room, index) => {
          const alternateLayout = index % 2 === 0;
          return (
            <RoomCard
              key={room._id}
              room={room}
              alternateLayout={alternateLayout}
            />
          );
        })}
      </div>



      {/* Complimentary Amenities */}
      <div className="lg:flex justify-between items-center lg:h-[650px]">
        <div className="lg:w-1/2  bg-primary lg:h-full text-left lg:p-24 text-white lg:space-y-6">
          <p data-aos="fade-right" className=" font-roboto font-medium text-center lg:text-left">
            COZY & COMFORTABLE STAY EXPERIENCE
          </p>
          <p data-aos="fade-right" className=" font-marcellus text-2xl text-center lg:text-left lg:text-5xl">
            Complimentary Amenities In Your Suite
          </p>
          <p data-aos="fade-right" className=" font-jost text-center lg:text-left">
            All rooms have a bathroom with bathtub and/or shower, cable
            television/radio, free WIFI and mini bar. In addition, all rooms are
            equipped with a Nespresso coffee machine. Most rooms are carpeted,
            some have parquet flooring.
          </p>
          <ul data-aos="fade-right" className=" grid grid-cols-2 justify-center">
            {/* List Amenities */}
            <li className="flex items-center gap-2">
              <span className=" text-secondary">
                <TiPlus />
              </span>
              Free-standing Shower
            </li>
            {/* More amenities */}
          </ul>
        </div>
        <div className="lg:w-1/2 ">
          <img
            className="lg:h-[650px] lg:w-full"
            src="https://i.ibb.co/Zf4Pxg9/pexels-talksintheam-2263510.jpg"
            alt=""
          />
        </div>
      </div>

      {/* Reservation Info */}
      <div className="container mx-auto lg:flex justify-center gap-10 my-16">
        <div className="lg:w-1/2  space-y-5">
          <p data-aos="fade-right" className=" font-jost text-primary ">
            START YOUR COMFORTABLE STAY
          </p>
          <p data-aos="fade-right" className=" font-marcellus text-4xl">
            Hotel Rates, Information & Reservation Policies
          </p>
          <p data-aos="fade-right" className=" font-jost">
            Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
            Rhoncus ut, imperdiet a, venenatis vitae, justo. Cras dapibus.
            Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
          </p>
        </div>
        <div data-aos="fade-right" className="lg:w-1/2  space-y-5 text-lg">
          <p className="flex items-center gap-2 font-jost">
            <span className=" text-secondary text-sm">
              <FaCircle />
            </span>
            We are happy to arrange late check-ins, but please note that this
            must be pre-arranged with management.
          </p>
          {/* More info */}
        </div>
      </div>
    </div>
  );
};

export default Room;
