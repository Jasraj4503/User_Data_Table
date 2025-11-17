import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

const User_Form = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: {errors} } = useForm();

    const addData = async (data) => {
        try {
            if (!id) {
                await axios.post(`${import.meta.env.VITE_API_URL}/user`, data);
                Swal.fire({
                    title: "Success!",
                    text: "User added successfully!",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => navigate("/"));
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/user/${id}`, data);
                Swal.fire({
                    title: "Success!",
                    text: "User updated successfully!",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => navigate("/"));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const SingleUser = async () => {
        if (id) {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/${id}`);
            reset(res.data);
        }
    };

    useEffect(() => {
        if (id) SingleUser();
    }, [id, reset]);


    return (
        <div className="col-lg-6 m-auto mt-5 shadow p-5 rounded-3 modern-form glass-effect">
            <h1 className="text-capitalize text-center mb-4 gradient-text">
                {id ? "Edit User" : "Add User"}
            </h1>
            <form onSubmit={handleSubmit(addData)}>

                {/* USERNAME */}
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

                {/* SUBMIT BUTTON */}
                <button
                    className={`btn ${id ? "btn-warning" : "btn-primary"} w-100 text-capitalize my-3`}
                >
                    {id ? "Update User" : "Add User"}
                </button>

            </form>

        </div>
    );
};

export default User_Form;
