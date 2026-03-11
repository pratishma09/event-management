import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

const EmployeeView = ({ role, checkIn, canSubmitTasks, tasks }) => {
    const [employeeTasks, setEmployeeTasks] = useState([]);
    const [submittedTasks, setSubmittedTasks] = useState(tasks || []);
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [editDescription, setEditDescription] = useState("");

    const addTaskField = () =>
        setEmployeeTasks([
            ...employeeTasks,
            { description: "", completed: false },
        ]);

    const updateTask = (index, value) => {
        const updated = [...employeeTasks];
        updated[index].description = value;
        setEmployeeTasks(updated);
    };

    const submitTasks = () => {
        if (employeeTasks.length === 0) return alert("Add at least one task.");

        router.post(
            route("checkin.tasks.store"),
            {
                tasks: employeeTasks.map((task) => ({
                    description: task.description,
                })),
            },
            {
                onSuccess: (page) => {
                    const tasks = page.props.tasks;
                    console.log(tasks);
                    setSubmittedTasks(page.props.tasks || []);
                    setEmployeeTasks([]);
                    setShowTaskModal(false);
                },
            },
        );
    };

    const handleCheckIn = () => {
        setCheckingIn(true);

        router.post(
            route("checkin.store"),
            {},
            {
                onFinish: () => {
                    setCheckingIn(false);
                    setShowCheckInModal(false);
                },
            },
        );
    };

    const updateTaskDescription = () => {
        if (!editDescription) return alert("Description cannot be empty.");

        router.post(
            route("tasks.update", editingTask.id),
            {
                description: editDescription,
            },
            {
                onSuccess: () => {
                    setSubmittedTasks((prev) =>
                        prev.map((task) =>
                            task.id === editingTask.id
                                ? {
                                      ...task,
                                      description: editDescription,
                                      remarks: null,
                                      manager_status: "pending",
                                  }
                                : task,
                        ),
                    );

                    setEditingTask(null);
                    setEditDescription("");
                },
            },
        );
    };

    const handleCheckOut = () => {
        router.post(route("checkout.store"));
    };

    const columns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            width: "70px",
        },
        {
            name: "Task Info",
            selector: (row) => row.description,
            sortable: true,
        },
        {
            name: "Date",
            selector: (row) =>
                row.date
                    ? new Date(row.date).toISOString().slice(0, 10)
                    : "—",
            sortable: true,
        },
        {
            name: "Remarks",
            selector: (row) => row.remarks || "—",
            sortable: true,
        },
        {
    name: "Status",
    cell: (row) => {
        const statusColor = row.completed
            ? "bg-green-50 text-green-800"
            : "bg-yellow-50 text-yellow-800";

        return (
            <select
                value={row.completed ? "yes" : "no"}
                className={`px-3 py-1 rounded text-xs border ${statusColor} border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    row.manager_status !== "approved" ? "cursor-not-allowed opacity-70" : ""
                }`}
                disabled={row.manager_status !== "approved"}
                onChange={(e) => {
                    const completed = e.target.value === "yes";

                    // Optimistic UI update
                    setSubmittedTasks((prev) =>
                        prev.map((t) =>
                            t.id === row.id ? { ...t, completed } : t
                        )
                    );

                    router.post(route("tasks.complete", row.id), { completed });
                }}
            >
                <option value="no">Incomplete</option>
                <option value="yes">Complete</option>
            </select>
        );
    },
    center: true,
},
        {
            name: "Manager Approval",
            sortable: true,
            cell: (row) => {
                const status = row.manager_status;

                let color = "bg-gray-200 text-gray-800";

                if (status === "approved") {
                    color = "bg-green-100 text-green-700";
                } else if (status === "pending") {
                    color = "bg-yellow-100 text-yellow-700";
                } else if (status === "disapproved") {
                    color = "bg-red-100 text-red-700";
                }

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${color}`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            name: "Actions",
            cell: (row) => {
                if (row.manager_status=="approved") return "—";

                return (
                    <button
                        onClick={() => {
                            setEditingTask(row);
                            setEditDescription(row.description);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Task"
                    >
                        <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M15.9087 3.87352C16.4681 3.31421 17.2266 3 18.0176 3C18.4093 3 18.7971 3.07714 19.1589 3.22702C19.5208 3.3769 19.8495 3.59658 20.1265 3.87352C20.4034 4.15046 20.6231 4.47924 20.773 4.84108C20.9229 5.20292 21 5.59074 21 5.98239C21 6.37404 20.9229 6.76186 20.773 7.1237C20.6231 7.48554 20.4034 7.81432 20.1265 8.09126L19.0231 9.19466C18.6326 9.58519 17.9994 9.58519 17.6089 9.19467L14.8053 6.39114C14.4148 6.00062 14.4148 5.36745 14.8053 4.97693L15.9087 3.87352ZM13.3911 7.80536C13.0006 7.41483 12.3674 7.41483 11.9769 7.80536L5.01084 14.7714C4.37004 15.4122 3.91545 16.2151 3.69566 17.0943L3.02986 19.7575C2.94467 20.0982 3.04452 20.4587 3.2929 20.7071C3.54128 20.9555 3.90177 21.0553 4.24254 20.9701L6.90572 20.3043C7.78488 20.0846 8.58778 19.63 9.22857 18.9892L16.1946 12.0231C16.5852 11.6326 16.5852 10.9994 16.1946 10.6089L13.3911 7.80536Z"
                                    fill="currentColor"
                                ></path>{" "}
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12 20C12 19.4477 12.4477 19 13 19L20 19C20.5523 19 21 19.4477 21 20C21 20.5523 20.5523 21 20 21L13 21C12.4477 21 12 20.5523 12 20Z"
                                    fill="currentColor"
                                ></path>{" "}
                            </g>
                        </svg>
                    </button>
                );
            },
            center: true,
        },
    ];

    return (
        <>
            {role === "employee" && (
                <div>
                    <div className="mb-6">
                        {checkIn ? (
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-green-600 font-medium">
                                    Checked in today at{" "}
                                    {new Date(
                                        checkIn.check_in_time,
                                    ).toLocaleTimeString()}
                                </p>

                                {checkIn &&
                                    checkIn.check_in_time &&
                                    !checkIn.check_out_time && (
                                        <button
                                            onClick={handleCheckOut}
                                            className="px-4 py-2 bg-red-500 text-white rounded"
                                        >
                                            Check Out
                                        </button>
                                    )}

                                {checkIn.check_out_time && (
                                    <span className="text-blue-600 font-medium">
                                        Checked out at{" "}
                                        {new Date(
                                            checkIn.check_out_time,
                                        ).toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div>
                                <p className="text-red-600 font-medium mb-2">
                                    You haven’t checked in today.
                                </p>

                                <button
                                    onClick={() => setShowCheckInModal(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Check In
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Manager status */}

                    {checkIn && status && (
                        <div className="mb-6">
                            <p>
                                Manager Status:{" "}
                                <span
                                    className={
                                        status === "approved"
                                            ? "text-green-600"
                                            : manager_status === "disapproved"
                                              ? "text-red-600"
                                              : "text-yellow-600"
                                    }
                                >
                                    {status.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    )}

                    {checkIn &&
                        checkIn.check_in_time &&
                        canSubmitTasks &&
                        !checkIn.check_out_time && (
                            <div className="mb-6">
                                <button
                                    onClick={() => {
                                        setEmployeeTasks([{ description: "" }]);
                                        setShowTaskModal(true);
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    + Add Tasks
                                </button>
                            </div>
                        )}

                    {submittedTasks.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">
                                Submitted Tasks
                            </h2>

                            <DataTable
                                columns={columns}
                                data={submittedTasks}
                                pagination
                                highlightOnHover
                                striped
                                responsive
                                persistTableHead
                            />
                        </div>
                    )}

                    {editingTask && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 w-[450px] shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    Edit Task
                                </h3>

                                <textarea
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                    className="border w-full px-3 py-2 rounded mb-4"
                                    rows="3"
                                />

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setEditingTask(null)}
                                        className="px-3 py-1 bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={updateTaskDescription}
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Resubmit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showTaskModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    Add Tasks
                                </h3>

                                {employeeTasks.map((task, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 mb-3"
                                    >
                                        <input
                                            type="text"
                                            value={task.description}
                                            placeholder="Task description"
                                            onChange={(e) =>
                                                updateTask(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            className="border px-2 py-1 flex-1"
                                        />
                                    </div>
                                ))}

                                <button
                                    onClick={addTaskField}
                                    className="px-3 py-1 bg-blue-500 text-white rounded mb-4"
                                >
                                    + Add Another Task
                                </button>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setShowTaskModal(false)}
                                        className="px-3 py-1 bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={submitTasks}
                                        className="px-4 py-2 bg-green-500 text-white rounded"
                                    >
                                        Submit Tasks
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showCheckInModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    Confirm Check-In
                                </h3>

                                <p className="mb-4">
                                    Click below to check in for today.
                                </p>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() =>
                                            setShowCheckInModal(false)
                                        }
                                        className="px-3 py-1 bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleCheckIn}
                                        disabled={checkingIn}
                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                    >
                                        {checkingIn
                                            ? "Checking in..."
                                            : "Check In"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default EmployeeView;
