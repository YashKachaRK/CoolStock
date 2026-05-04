const Application = require("../models/Application");
const emailService = require("../utils/emailService");

// add data
exports.addApplication = async (req , res)=> {
  try {
    const {full_name , email , phone , role , description} = req.body;
    
    const newApp = new Application({ full_name, email, phone, role, description });
    await newApp.save();
    
    // ── Trigger Email: Application Received ──
    if (email) {
      emailService.sendApplicationReceived(newApp);
    }

    res.json({message :"Added" });
  } catch (err) {
    res.status(500).send(err);
  }
};
