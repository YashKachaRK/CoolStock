import React, { useState } from "react";
import Slidebar from "../../components/Slidebar";
import { menuItems } from "../admin/SLidebar_Data";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      email: "amit@gmail.com",
      phone: "9876543210",
      role: "Salesman",
      salary: 30000,
      status: "Active",
    },
    {
      id: 2,
      name: "Neha Singh",
      email: "neha@gmail.com",
      phone: "9876512345",
      role: "Salesman",
      salary: 18000,
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    salary: "",
    password: "",
  });

  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Add employee
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmployee = {
      id: employees.length + 1,
      ...formData,
      salary: Number(formData.salary),
      status: "Active",
    };

    setEmployees([...employees, newEmployee]);

    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      salary: "",
      password: "",
    });
  };

  // Delete employee
  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  // Open Edit Modal
  const handleEdit = (emp) => {
    setEditData(emp);
    setShowModal(true);
  };

  // Update Employee
  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedEmployees = employees.map((emp) =>
      emp.id === editData.id ? editData : emp
    );

    setEmployees(updatedEmployees);
    setShowModal(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Slidebar title="Admin Panel" menuItems={menuItems} sidebarWidth="w-60">
        <div className="p-4 md:p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Employee Management
            </h1>
            <p className="text-gray-500 mt-1">
              Add and manage employees professionally
            </p>
          </div>

          {/* Add Employee Form */}
          <div className="bg-white p-6 rounded-2xl shadow mb-10">
            <h2 className="text-xl font-semibold mb-6">Add New Employee</h2>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
              <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <InputField label="Salary" name="salary" type="number" value={formData.salary} onChange={handleChange} />
              <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />

              <div>
                <label className="block mb-2 font-medium">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="Manager">Salesman</option>
              
                </select>
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition shadow">
                  + Add Employee
                </button>
              </div>
            </form>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="px-6">Name</th>
                  <th className="px-6">Email</th>
                  <th className="px-6">Phone</th>
                  <th className="px-6">Role</th>
                  <th className="px-6">Salary</th>
                  <th className="px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-semibold">{emp.id}</td>
                    <td className="px-6">{emp.name}</td>
                    <td className="px-6">{emp.email}</td>
                    <td className="px-6">{emp.phone}</td>
                    <td className="px-6">{emp.role}</td>
                    <td className="px-6 font-semibold text-indigo-600">
                      ₹{emp.salary}
                    </td>
                    <td className="px-6 text-center space-x-3">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= EDIT MODAL ================= */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative animate-fadeIn">

                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                >
                  ✕
                </button>

                <h2 className="text-xl font-bold mb-6">Edit Employee</h2>

                <form onSubmit={handleUpdate} className="grid gap-4">
                  <InputField label="Name" name="name" value={editData.name} onChange={handleEditChange} />
                  <InputField label="Email" name="email" value={editData.email} onChange={handleEditChange} />
                  <InputField label="Phone" name="phone" value={editData.phone} onChange={handleEditChange} />
                  <InputField label="Salary" name="salary" type="number" value={editData.salary} onChange={handleEditChange} />

                  <button className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition mt-4">
                    Update Employee
                  </button>
                </form>

              </div>
            </div>
          )}

        </div>
      </Slidebar>
    </div>
  );
}

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-gray-600 font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

export default EmployeeManagement;
