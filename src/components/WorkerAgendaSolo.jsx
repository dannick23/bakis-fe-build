import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import {
  fetchBookedTimes,
  fetchSettings,
  fetchRegistrations,
} from "../functions/WorkerFunc";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useParams, useNavigate } from "react-router-dom";
import { useSystem } from "../App";
import Modal from "react-modal";
import { fetchRegistrationData } from "../functions/BackedClient";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";

const localizer = momentLocalizer(moment);
Modal.setAppElement("#root");

const WorkerCalendar = ({ worker }) => {
  const { email } = useParams();
  const { system } = useSystem();
  const [shiftTimes, setShiftTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const authHeader = useAuthHeader();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCalendarData();
  }, [view, email, system, worker]);

  const fetchCalendarData = async () => {
    const workerShiftTimes = await fetchBookedTimes(email, system);

    if (view === Views.DAY) {
      const shiftEvents =
        workerShiftTimes &&
        workerShiftTimes.map((shift) => ({
          start: new Date(shift.timeFrom),
          end: new Date(shift.timeTo),
          title: "Booked",
        }));

      setShiftTimes(shiftEvents);
    } else {
      // For month and week views, create a single event per day
      const uniqueDays = Array.from(
        new Set(
          workerShiftTimes.map((shift) => shift.timeFrom.substring(0, 10))
        )
      );

      const shiftEvents = uniqueDays.map((day) => ({
        start: new Date(`${day}T00:00:00`),
        end: new Date(`${day}T23:59:59`),
        title: "Available",
      }));

      setShiftTimes(shiftEvents);
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    var style = {
      backgroundColor: "#378006",
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "1px solid black",
      fontSize: "0.85em",
    };
    return {
      style: style,
    };
  };
  const handleConfirmDeletion = async () => {
    if (selectedBooking) {
      const { timeFrom, timeTo } = selectedBooking;

      try {
        const response = axios.delete(
          `{process.env.BE_HOST}/registration/${system}/booking/${email}/${moment(
            timeFrom
          ).format("YYYY-MM-DDTHH:mm:ss")}/${moment(timeTo).format(
            "YYYY-MM-DDTHH:mm:ss"
          )}`,
          {
            headers: {
              Authorization: authHeader(),
            },
          }
        );
        setShowModal(false);
        updateDayEvents();
      } catch (error) {
        console.error("There was an error deleting the registration:", error);
      }
    }
  };

  const handleSelectEvent = async (selectedEvent) => {
    // For day view, show a confirmation modal before registering
    if (view === Views.DAY) {
      setSelectedEvent(selectedEvent);
      const startTime = selectedEvent.start;
      const endTime = selectedEvent.end;
      console.log("Showing registration");
      const bookingResponse = await fetchRegistrationData(
        system,
        email,
        moment(startTime).format(),
        moment(endTime).format(),
        authHeader()
      );
      setSelectedBooking(bookingResponse);
      setShowModal(true);
    } else {
      setDate(selectedEvent.start);
      setView(Views.DAY);
    }

    const settings = await fetchSettings(system);
    const shiftLengthInMinutes = settings.defaultIteration;

    // Fetch the worker's shift times for the selected day
    const workerShifts = (await fetchBookedTimes(email, system)).filter(
      (shift) =>
        moment(shift.timeFrom).isSame(selectedEvent.start, "day") ||
        moment(shift.timeTo).isSame(selectedEvent.start, "day")
    );
    const registrations = await fetchRegistrations(
      system,
      email,
      moment(selectedEvent.start).format()
    );

    const dayEvents = [];

    for (const shift of workerShifts) {
      const shiftStart = new Date(shift.timeFrom);
      const shiftEnd = new Date(shift.timeTo);

      let slotStart = shiftStart;

      while (slotStart < shiftEnd) {
        const slotEnd = new Date(
          slotStart.getTime() + shiftLengthInMinutes * 60 * 1000
        );

        if (slotEnd > shiftEnd) {
          break;
        }

        const slotIsBooked = registrations.some((reg) => {
          const regStart = new Date(reg.timeFrom);
          const regEnd = new Date(reg.timeTo);
          return (
            (slotStart >= regStart && slotStart < regEnd) ||
            (slotEnd > regStart && slotEnd <= regEnd)
          );
        });
        const title = `Booked - ${slotStart
          .getHours()
          .toString()
          .padStart(2, "0")}:${slotStart
          .getMinutes()
          .toString()
          .padStart(2, "0")} to ${slotEnd
          .getHours()
          .toString()
          .padStart(2, "0")}:${slotEnd
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        if (slotIsBooked) {
          dayEvents.push({
            start: new Date(slotStart),
            end: new Date(slotEnd),
            title: title,
          });
        }

        slotStart = slotEnd;
      }
    }

    setShiftTimes(dayEvents);
  };
  const updateDayEvents = async (newDate) => {
    const settings = await fetchSettings(system);
    const shiftLengthInMinutes = settings.defaultIteration;

    const workerShifts = (await fetchBookedTimes(email, system)).filter(
      (shift) =>
        moment(shift.timeFrom).isSame(newDate, "day") ||
        moment(shift.timeTo).isSame(newDate, "day")
    );
    const registrations = await fetchRegistrations(
      system,
      email,
      moment(newDate).format()
    );

    const dayEvents = [];

    for (const shift of workerShifts) {
      const shiftStart = new Date(shift.timeFrom);
      const shiftEnd = new Date(shift.timeTo);

      let slotStart = shiftStart;

      while (slotStart < shiftEnd) {
        const slotEnd = new Date(
          slotStart.getTime() + shiftLengthInMinutes * 60 * 1000
        );

        if (slotEnd > shiftEnd) {
          break;
        }

        const slotIsBooked = registrations.some((reg) => {
          const regStart = new Date(reg.timeFrom);
          const regEnd = new Date(reg.timeTo);
          return (
            (slotStart >= regStart && slotStart < regEnd) ||
            (slotEnd > regStart && slotEnd <= regEnd)
          );
        });
        const title = `Booked - ${slotStart
          .getHours()
          .toString()
          .padStart(2, "0")}:${slotStart
          .getMinutes()
          .toString()
          .padStart(2, "0")} to ${slotEnd
          .getHours()
          .toString()
          .padStart(2, "0")}:${slotEnd
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        if (slotIsBooked) {
          dayEvents.push({
            start: new Date(slotStart),
            end: new Date(slotEnd),
            title: title,
          });
        }

        slotStart = slotEnd;
      }
    }

    setShiftTimes(dayEvents);
  };

  const handleDateChange = async (newDate) => {
    setDate(newDate);

    if (view === Views.DAY) {
      await updateDayEvents(newDate);
    } else {
      fetchCalendarData();
    }
  };

  const handleViewChange = async (newView) => {
    setView(newView);

    if (newView === Views.DAY) {
      await handleSelectEvent({ start: date });
    } else {
      fetchCalendarData();
    }
  };
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={shiftTimes}
        startAccessor="start"
        endAccessor="end"
        step={15}
        timeslots={4}
        style={{ height: 500, margin: "50px" }}
        eventPropGetter={eventStyleGetter}
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleDateChange}
        onSelectEvent={handleSelectEvent}
      />
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Registration Confirmation"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "20px",
            width: "500px",
            height: "auto",
          },
        }}
      >
        <h2>Booking</h2>
        <p>{selectedBooking && "first name: " + selectedBooking.firstName}</p>
        <p>{selectedBooking && "last name: " + selectedBooking.lastName}</p>
        <p>{selectedBooking && "time from: " + selectedBooking.timeFrom}</p>
        <p>{selectedBooking && "time to: " + selectedBooking.timeTo}</p>
        <p>
          {selectedBooking &&
            "client phone number: " + selectedBooking.clientPhoneNumber}
        </p>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger mr-2"
            onClick={handleConfirmDeletion}
          >
            Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Back
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default WorkerCalendar;
