import axios from "axios";

const util = require("util");
export const fetchImageIds = async (system) => {
  try {
    console.log(
      util.inspect(system, false, null, SVGComponentTransferFunctionElement)
    );
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/system/${system}/get-all-images`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log("Images fetched successfully");
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

export const fetchUserData = async (email, system, authHeader) => {
  try {
    console.log("Inside fethcUserData");
    console.log(util.inspect(authHeader, false, null, true));
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/user/${system}/get-user-details/${email}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    if (response.status === 200) {
      console.log("User fetched successfully");
      return response.data;
    } else {
      console.log(util.inspect(response.data, false, null, true));
      return null;
    }
  } catch (error) {
    console.log(util.inspect(error.response, false, null, true));
    return null;
  }
};

export const createRegistration = async (
  data,
  email,
  system,
  timeFrom,
  timeTo,
  authHeader
) => {
  try {
    console.log(util.inspect(data, false, null, true));
    const response = await axios.post(
      `https://bakis-be.herokuapp.com/registration/${system}/new`,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        description: data.description,
        timeFrom: timeFrom,
        timeTo: timeTo,
        clientPhoneNumber: data.phoneNumber,
        userEmail: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );
    if (response.status === 200) {
      console.log("The registration for visit was successful");
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

export const uploadFile = async (formData, system, authHeader) => {
  try {
    const response = await axios.post(
      `https://bakis-be.herokuapp.com/system/${system}/add-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: authHeader,
        },
      }
    );
    console.log("File uploaded successfully.");
    return response;
  } catch (error) {
    console.error("Error uploading file: ", error);
  }
};

export const fetchAboutUs = async (system) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/system/${system}/get-about-us`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log("About-us fetched successfully");
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

export const fetchContactUs = async (system) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/system/${system}/get-contact-us`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log("Contact-us fetched successfully");
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

export const fetchDescription = async (system) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/system/${system}/get-description`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log("Description fetched successfully");
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

export const fetchRegistrationData = async (
  system,
  email,
  from,
  to,
  authHeader
) => {
  try {
    const response = await axios.get(
      `https://bakis-be.herokuapp.com/registration/${system}/booking/${email}/${from}/${to}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );
    if (response.status === 200) {
      console.log("Description fetched successfully");
      console.log(util.inspect(response.data, false, null, true));
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
