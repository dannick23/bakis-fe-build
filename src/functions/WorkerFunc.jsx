import axios from "axios";

export const fetchWorkersFromServer = async (system) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/system/${system}/all-workers`
    );
    if (response.status === 200) {
      console.log("Workers fetched successfully");
      return response.data;
    } else {
      console.error(`Error occurred: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return null;
  }
};

export const fetchShiftTimes = async (email, system) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/registration/${system}/worker-shift/${email}`
    );
    if (response.status === 200) {
      console.log("Workers shifts fetched successfully");
      return response.data;
    } else {
      console.error(`Error occurred: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return null;
  }
};

export const fetchBookedTimes = async (email, system) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/registration/${system}/worker-booked-shift/${email}`
    );
    if (response.status === 200) {
      console.log("Workers booked shifts fetched successfully");
      return response.data;
    } else {
      console.error(`Error occurred: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return null;
  }
};
export const fetchAppointments = async (email, system) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/registration/${system}/all-registrations/${email}`
    );
    if (response.status === 200) {
      console.log("Worker's registrations fetched successfully");
      return response.data;
    } else {
      console.error(`Error occurred: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return null;
  }
};
export const fetchSettings = async (system) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/system/${system}/get-settings`
    );
    if (response.status === 200) {
      console.log("System settings fetched successfully");
      return response.data;
    } else {
      console.error(`Error occurred: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return null;
  }
};
export const fetchRegistrations = async (system, email, day) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/registration/${system}/all-registrations/${email}/${day}`
    );
    if (response.status === 200) {
      console.log("Day registrations fetched successfully");
      if (
        response.data === null ||
        response.data === undefined ||
        response.data === "null" ||
        response.data === "undefined"
      ) {
        return [];
      }
      return response.data;
    } else {
      console.error(`Error occurred: ${response.status}`);
      return null || [];
    }
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return null || [];
  }
};
