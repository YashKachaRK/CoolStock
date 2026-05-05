const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");

exports.addStaff = async (req, res) => {
  try {
    const { name, role, email, phone, password, status } = req.body;

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      name,
      role,
      email,
      phone,
      password: hashPassword,
      status
    });

    await newStaff.save();
    res.send("Staff Added Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.staff = async (req, res) => {
  try {
    const staffList = await Staff.find().select('-password');
    res.json(staffList.map(s => ({ ...s.toObject(), id: s._id })));
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone } = req.body;

    await Staff.findByIdAndUpdate(id, { name, role, email, phone });
    res.send("Updated Successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    res.send("delete");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting staff");
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Staff.findByIdAndUpdate(id, { status });
    res.send("Status updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating status");
  }
};

exports.getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-password');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ ...staff.toObject(), id: staff._id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching staff profile');
  }
};

exports.updateStaffProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    await Staff.findByIdAndUpdate(id, { name, phone });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating staff profile');
  }
};