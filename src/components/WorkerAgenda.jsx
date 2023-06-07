// import React, { useState, useEffect } from "react";
// import { Calendar, momentLocalizer, Views } from "react-big-calendar";
// import moment from "moment";
// import {
//   fetchShiftTimes,
//   fetchSettings,
//   fetchRegistrations,
// } from "../functions/WorkerFunc";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSystem } from "../App";
// import Modal from "react-modal";
// import { createRegistration, fetchUserData } from "../functions/BackedClient";

// const localizer = momentLocalizer(moment);
// Modal.setAppElement("#root");

// const WorkerAgenda = ({ worker }) => {
//   const { email } = useParams();
//   const { system } = useSystem();
//   const [shiftTimes, setShiftTimes] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [view, setView] = useState(Views.MONTH);
//   const [date, setDate] = useState(new Date());
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCalendarData();
//   }, [view, email, system, worker]);
//   const fetchCalendarData = async () => {
//     const workerShiftTimes = await fetchShiftTimes(email, system); //should be reservation times

//     if (view === Views.DAY) {
//       const shiftEvents =
//         workerShiftTimes &&
//         workerShiftTimes.map((shift) => {
//           const isBooked = checkIfTimeIsBooked(shift.timeFrom, shift.timeTo);
//           if (isBooked) {
//             return {
//               start: new Date(shift.timeFrom),
//               end: new Date(shift.timeTo),
//               title: "Booked",
//             };
//           }
//         });

//       setShiftTimes(shiftEvents);
//     } else {
//       // For month and week views, create a single event per day
//       const uniqueDays = Array.from(
//         new Set(
//           workerShiftTimes.map((shift) => shift.timeFrom.substring(0, 10))
//         )
//       );

//       const shiftEvents = uniqueDays.map((day) => ({
//         start: new Date(`${day}T00:00:00`),
//         end: new Date(`${day}T23:59:59`),
//         title: "Available",
//       }));

//       setShiftTimes(shiftEvents);
//     }
//   };
//   // This function checks if the given time slot is booked.
//   // 'timeFrom' and 'timeTo' should be in ISO format.
//   const checkIfTimeIsBooked = (timeFrom, timeTo) => {
//     const from = new Date(timeFrom);
//     const to = new Date(timeTo);
//     for (let booking of bookings) {
//       const bookingFrom = new Date(booking.timeFrom);
//       const bookingTo = new Date(booking.timeTo);
//       if (bookingFrom < to && bookingTo > from) {
//         return true;
//       }
//     }
//     return false;
//   };

//   const checkIfDayIsBooked = (day) => {
//     const dayStart = new Date(`${day}T00:00:00Z`);
//     const dayEnd = new Date(`${day}T23:59:59Z`);

//     for (let booking of bookings) {
//       const bookingFrom = new Date(booking.timeFrom);
//       const bookingTo = new Date(booking.timeTo);

//       if (bookingFrom < dayEnd && bookingTo > dayStart) {
//         return true;
//       }
//     }

//     return false;
//   };
//   const handleSelectEvent = async (selectedEvent) => {
//     if (view === Views.DAY) {
//       setSelectedEvent(selectedEvent);
//       setShowModal(true);
//     } else {
//       setDate(selectedEvent.start);
//       setView(Views.DAY);
//     }

//     const settings = await fetchSettings(system);
//     const shiftLengthInMinutes = settings.defaultIteration;

//     const workerShifts = (await fetchShiftTimes(email, system)).filter(
//       (shift) =>
//         moment(shift.timeFrom).isSame(selectedEvent.start, "day") ||
//         moment(shift.timeTo).isSame(selectedEvent.start, "day")
//     );
//     const registrations = await fetchRegistrations(
//       system,
//       email,
//       moment(selectedEvent.start).format()
//     );

//     const dayEvents = [];

//     for (const shift of workerShifts) {
//       const shiftStart = new Date(shift.timeFrom);
//       const shiftEnd = new Date(shift.timeTo);

//       let slotStart = shiftStart;

//       while (slotStart < shiftEnd) {
//         const slotEnd = new Date(
//           slotStart.getTime() + shiftLengthInMinutes * 60 * 1000
//         );

//         if (slotEnd > shiftEnd) {
//           break;
//         }

//         const slotIsFree = !registrations.some((reg) => {
//           const regStart = new Date(reg.timeFrom);
//           const regEnd = new Date(reg.timeTo);
//           return (
//             (slotStart >= regStart && slotStart < regEnd) ||
//             (slotEnd > regStart && slotEnd <= regEnd)
//           );
//         });
//         const title = `${!slotIsFree && "Booked"} - ${slotStart
//           .getHours()
//           .toString()
//           .padStart(2, "0")}:${slotStart
//           .getMinutes()
//           .toString()
//           .padStart(2, "0")} to ${slotEnd
//           .getHours()
//           .toString()
//           .padStart(2, "0")}:${slotEnd
//           .getMinutes()
//           .toString()
//           .padStart(2, "0")}`;
//         if (!slotIsFree) {
//           dayEvents.push({
//             start: new Date(slotStart),
//             end: new Date(slotEnd),
//             title: title,
//           });
//         }

//         slotStart = slotEnd;
//       }
//     }

//     setShiftTimes(dayEvents);
//   };
//   const updateDayEvents = async (newDate) => {
//     const settings = await fetchSettings(system);
//     const shiftLengthInMinutes = settings.defaultIteration;

//     // Fetch the worker's shift times for the selected day
//     const workerShifts = (await fetchShiftTimes(email, system)).filter(
//       (shift) =>
//         moment(shift.timeFrom).isSame(newDate, "day") ||
//         moment(shift.timeTo).isSame(newDate, "day")
//     );
//     const registrations = await fetchRegistrations(system, email, newDate);

//     const dayEvents = [];

//     for (const shift of workerShifts) {
//       const shiftStart = new Date(shift.timeFrom);
//       const shiftEnd = new Date(shift.timeTo);

//       let slotStart = shiftStart;

//       while (slotStart < shiftEnd) {
//         const slotEnd = new Date(
//           slotStart.getTime() + shiftLengthInMinutes * 60 * 1000
//         );

//         if (slotEnd > shiftEnd) {
//           break;
//         }

//         const slotIsFree = !registrations.some((reg) => {
//           const regStart = new Date(reg.timeFrom);
//           const regEnd = new Date(reg.timeTo);
//           return (
//             (slotStart >= regStart && slotStart < regEnd) ||
//             (slotEnd > regStart && slotEnd <= regEnd)
//           );
//         });
//         const title = `Booked - ${slotStart
//           .getHours()
//           .toString()
//           .padStart(2, "0")}:${slotStart
//           .getMinutes()
//           .toString()
//           .padStart(2, "0")} to ${slotEnd
//           .getHours()
//           .toString()
//           .padStart(2, "0")}:${slotEnd
//           .getMinutes()
//           .toString()
//           .padStart(2, "0")}`;
//         if (!slotIsFree) {
//           dayEvents.push({
//             start: new Date(slotStart),
//             end: new Date(slotEnd),
//             title: title,
//           });
//         }

//         slotStart = slotEnd;
//       }
//     }

//     setShiftTimes(dayEvents);
//   };
//   return (
//     <div>
//       <Calendar
//         localizer={localizer}
//         events={shiftTimes}
//         startAccessor="start"
//         endAccessor="end"
//         step={15}
//         timeslots={4}
//         style={{ height: 500, margin: "50px" }}
//         eventPropGetter={eventStyleGetter}
//         view={view}
//         onView={handleViewChange}
//         date={date}
//         onNavigate={handleDateChange}
//         onSelectEvent={handleSelectEvent}
//       />
//       <Modal
//         isOpen={showModal}
//         onRequestClose={() => setShowModal(false)}
//         contentLabel="Registration Confirmation"
//         style={{
//           overlay: {
//             backgroundColor: "rgba(0, 0, 0, 0.5)", // This will give the overlay a semi-transparent black background
//           },
//           content: {
//             top: "50%",
//             left: "50%",
//             right: "auto",
//             bottom: "auto",
//             marginRight: "-50%",
//             transform: "translate(-50%, -50%)",
//             backgroundColor: "#fff",
//             border: "1px solid #ccc",
//             borderRadius: "4px",
//             padding: "20px",
//             width: "500px",
//             height: "auto",
//           },
//         }}
//       >
//         <h2>Confirmation</h2>
//         <p>Are you sure you want to register for this time slot?{"\n"}</p>
//         <p>
//           {selectedEvent
//             ? moment(selectedEvent.start).format("HH:mm") +
//               " - " +
//               moment(selectedEvent.end).format("HH:mm")
//             : ""}
//           ?
//         </p>
//         <div className="d-flex justify-content-end">
//           <button
//             className="btn btn-primary mr-2"
//             onClick={handleConfirmRegistration}
//           >
//             Yes
//           </button>
//           <button
//             className="btn btn-secondary"
//             onClick={() => setShowModal(false)}
//           >
//             No
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default WorkerAgenda;
