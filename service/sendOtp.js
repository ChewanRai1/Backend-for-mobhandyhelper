const axios = require("axios");

const sendOtp = async (phone, otp) => {
  let isSent = false;

  // third party service provider
  const url = "https://api.managepoint.co/api/sms/send";

  // required payload
  const payload = {
    apiKey: "a3101759-a794-4e74-8d66-fa19c22dee87",
    to: phone,
    message: `Your OTP for Verification is ${otp}`,
  };

  try {
    const res = await axios.post(url, payload);
    if (res.status == 200) {
      isSent = true;
    }
  } catch (error) {
    console.log("OTP Sending Fail : ", error.message);
  }

  return isSent;
};

module.exports = sendOtp;
