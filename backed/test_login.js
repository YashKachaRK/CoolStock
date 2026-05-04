const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post("http://localhost:5000/loginStaff", {
      email: "admin@coolstock.com",
      password: "password123",
      role: "Admin"
    });
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log("ERROR:", err.response ? err.response.data : err.message);
  }
}
testLogin();
