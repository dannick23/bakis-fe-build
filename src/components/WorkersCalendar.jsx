import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import {
  fetchShiftTimes,
  fetchSettings,
  fetchRegistrations,
} from "../functions/WorkerFunc";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useParams, useNavigate } from "react-router-dom";
import { useSystem } from "../App";
import Modal from "react-modal";
import { createRegistration, fetchUserData } from "../functions/BackedClient";
import { useAuthHeader } from "react-auth-kit";

const localizer = momentLocalizer(moment);
Modal.setAppElement("#root");

const WorkerCalendar = ({ worker }) => {
  const { email } = useParams();
  const { system, user } = useSystem();
  const [shiftTimes, setShiftTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const util = require("util");

  useEffect(() => {
    fetchCalendarData();
  }, [view, system, worker, user]);

  const fetchCalendarData = async () => {
    const workerShiftTimes = await fetchShiftTimes(email, system);

    if (view === Views.DAY) {
      const shiftEvents =
        workerShiftTimes &&
        workerShiftTimes.map((shift) => ({
          start: new Date(shift.timeFrom),
          end: new Date(shift.timeTo),
          title: "Available",
        }));

      setShiftTimes(shiftEvents);
    } else {
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
  const handleConfirmRegistration = async () => {
    if (selectedEvent) {
      const startTime = selectedEvent.start;
      const endTime = selectedEvent.end;

      console.log("Registering for time slot from", startTime, "to", endTime);
      console.log(
        util.inspect(authHeader(), false, null, true /* enable colors */)
      );
      const userResponse = await fetchUserData(
        user && user.email,
        system,
        authHeader()
      );
      const response = await createRegistration(
        userResponse,
        email,
        system,
        moment(startTime).format("YYYY-MM-DDTHH:mm:ss"),
        moment(endTime).format("YYYY-MM-DDTHH:mm:ss"),
        authHeader()
      );
      if (response !== null && response !== undefined) {
        navigate(`/${system}/home`);
      } else {
        navigate(`/${system}/login`);
      }
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleSelectEvent = async (selectedEvent) => {
    if (view === Views.DAY) {
      setSelectedEvent(selectedEvent);
      setShowModal(true);
    } else {
      setDate(selectedEvent.start);
      setView(Views.DAY);
    }

    const settings = await fetchSettings(system);
    const shiftLengthInMinutes = settings.defaultIteration;

    const workerShifts = (await fetchShiftTimes(email, system)).filter(
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

        const slotIsFree = !registrations.some((reg) => {
          const regStart = new Date(reg.timeFrom);
          const regEnd = new Date(reg.timeTo);
          return (
            (slotStart >= regStart && slotStart < regEnd) ||
            (slotEnd > regStart && slotEnd <= regEnd)
          );
        });
        const title = `Available - ${slotStart
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
        if (slotIsFree) {
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

    const workerShifts = (await fetchShiftTimes(email, system)).filter(
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

        const slotIsFree = !registrations.some((reg) => {
          const regStart = new Date(reg.timeFrom);
          const regEnd = new Date(reg.timeTo);
          return (
            (slotStart >= regStart && slotStart < regEnd) ||
            (slotEnd > regStart && slotEnd <= regEnd)
          );
        });
        const title = `Available - ${slotStart
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
        if (slotIsFree) {
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
        <h2>Confirmation</h2>
        <p>Are you sure you want to register for this time slot?{"\n"}</p>
        <p>
          {selectedEvent
            ? moment(selectedEvent.start).format("HH:mm") +
              " - " +
              moment(selectedEvent.end).format("HH:mm")
            : ""}
          ?
        </p>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary mr-2"
            onClick={handleConfirmRegistration}
          >
            Yes
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default WorkerCalendar;
