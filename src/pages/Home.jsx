import { useEffect, useState } from "react";
import "../assets/css/Table.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaTrashAlt, FaEye, FaAngleDown } from "react-icons/fa";
// import {  } from "react-icons/fa6";


const Home = () => {
    const [user, setUser] = useState([]);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("")
    const [sorting, setSorting] = useState("")
    const [limit, setLimit] = useState(10)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch all users
    async function fetchData() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`);
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Delete user
    async function trash(id) {
        Swal.fire({
            title: "Are you sure?",
            text: "This user will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/user/${id}`);
                Swal.fire("Deleted!", "User has been deleted.", "success");
                fetchData();
            }
        });
    }

    // Fetch single user for edit
    async function SingleUser(id) {
        setEditId(id);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/${id}`);
            reset(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    // Update user
    async function editUser(data) {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/user/${editId}`, data);
            Swal.fire({
                title: "Updated!",
                text: "User updated successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            fetchData();
            reset();

            document.querySelector("#exampleModal .btn-close").click();
        } catch (err) {
            console.log(err);
        }
    }

    const filterData = user
        .filter((user) => {
            return user.username.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()) || user.city.toLowerCase().includes(search.toLowerCase())
        })
        .sort((a, b) => {
            if (sorting == "asc") {
                return a.username.localeCompare(b.username)
            } else if (sorting == "dsc") {
                return b.username.localeCompare(a.username)
            }
        })
    const limitedUsers = limit === "all" ? filterData : filterData.slice(0, limit)

    return (
        <>
            <div className="table-container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="gradient-text">User Management</h2>
                </div>
                <div className="pb-3 row g-2">
                    <div className="col-md-7">
                        <input type="search" placeholder="Search by username, email or city" className="form-control" onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <select name="" id="" className="form-control" onChange={(e) => setSorting(e.target.value)}>
                            <option value="" selected>Sort <FaAngleDown /></option>
                            <option value="asc">A &#8594; Z</option>
                            <option value="dsc">Z &#8592; A</option>
                        </select>
                    </div>
                    <div className="col-md-2 flex-shrink-0 position-relative">
                        <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            Show: {limit === "all" ? "All" : limit} ▼
                        </button>
                        {dropdownOpen && (
                            <div className="border bg-white shadow p-2 rounded position-absolute w-100" style={{ zIndex: 10 }}>
                                {[10, 20, 30].map((num) => (
                                    <div
                                        key={num}
                                        className="dropdown-item p-2 cursor-pointer"
                                        onClick={() => { setLimit(num); setDropdownOpen(false); }}
                                    >
                                        {num}
                                    </div>
                                ))}
                                <div
                                    className="dropdown-item p-2 cursor-pointer"
                                    onClick={() => { setLimit("all"); setDropdownOpen(false); }}
                                >
                                    All
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="table-responsive shadow-sm rounded-4">
                    <table className="table table-hover align-middle">
                        <thead className="table-primary text-center">
                            <tr>
                                <th>#</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {limitedUsers.length > 0 ? (
                                limitedUsers.map((u, index) => (
                                    <tr key={index}>
                                        <td className="fw-semibold">{index + 1}</td>
                                        <td>{u.username}</td>
                                        <td>{u.email}</td>
                                        <td>{u.mobile}</td>
                                        <td>{u.city}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => trash(u.id)}
                                                className="btn btn-outline-danger btn-sm me-2"
                                                title="Delete"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                            <button
                                                className="btn btn-outline-warning btn-sm me-2"
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModal"
                                                onClick={() => SingleUser(u.id)}
                                                title="Edit"
                                            >
                                                <FaUserEdit />
                                            </button>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => navigate(`/single-user/${u.id}`)}
                                                title="View"
                                            >
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Edit */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog">
                    <div className="modal-content rounded-4 shadow-lg border-0">
                        <div className="modal-header bg-primary text-white">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Edit User
                            </h1>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(editUser)}>
                                <label className="form-label mb-2">User Name</label>
                                <input
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: {
                                            value: 3,
                                            message: "Username must be at least 3 characters"
                                        }
                                    })}
                                    className="form-control mb-2"
                                    placeholder="Enter name"
                                />
                                {errors.username && (
                                    <p className="text-danger">{errors.username.message}</p>
                                )}

                                {/* EMAIL */}
                                <label className="form-label mb-2">Email</label>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                                            message: "Invalid email format"
                                        }
                                    })}
                                    className="form-control mb-2"
                                    placeholder="Enter email"
                                />
                                {errors.email && (
                                    <p className="text-danger">{errors.email.message}</p>
                                )}

                                {/* PHONE */}
                                <label className="form-label mb-2">Phone</label>
                                <input
                                    {...register("mobile", {
                                        required: "Phone number is required",
                                        minLength: {
                                            value: 10,
                                            message: "Phone must be exactly 10 digits"
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: "Phone must be exactly 10 digits"
                                        }
                                    })}
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Enter phone"
                                />
                                {errors.mobile && (
                                    <p className="text-danger">{errors.mobile.message}</p>
                                )}

                                {/* CITY */}
                                <label className="form-label mb-2">City</label>
                                <input
                                    {...register("city", {
                                        required: "City is required",
                                        minLength: {
                                            value: 2,
                                            message: "City must be at least 2 characters"
                                        }
                                    })}
                                    className="form-control mb-2"
                                    placeholder="Enter city"
                                />
                                {errors.city && (
                                    <p className="text-danger">{errors.city.message}</p>
                                )}


                                <button className="btn btn-primary w-100 mt-2">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
