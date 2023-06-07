import axios from "axios";

export async function submitData(data, system) {
  try {
    const response = await axios.post(
      `{process.env.BE_HOST}/user/${system}/new`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Request failed!");
  }
}
