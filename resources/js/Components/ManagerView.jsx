import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

const ManagerView = ({ role, pendingTasks }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [showDisapproveModal, setShowDisapproveModal] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [toggleCleared, setToggleCleared] = useState(false);

    if (role !== "manager") return null;

    const columns = [
        {
            name: "ID",
            selector: (_, index) => index + 1,
            width: "60px",
            sortable: true,
        },
        {
            name: "Employee",
            selector: (row) => row.check_in?.user?.name || "—",
            sortable: true,
        },
        {
            name: "Task",
            selector: (row) => row.description,
        },
        {
            name: "Date",
            selector: (row) =>
                row.date
                    ? new Date(row.date).toISOString().slice(0, 10)
                    : "—",
            sortable: true,
        },
    ];

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
        console.log("Selected Rows: ", state.selectedRows);
    };

    const selectedTaskIds = selectedRows.map((r) => r.id);

    const handleApproveSelected = () => {
        if (!selectedTaskIds.length) return alert("Select tasks to approve.");

        router.post(
            route("tasks.approve.bulk"),
            { task_ids: selectedTaskIds },
            {
                onSuccess: () => {
                    setSelectedRows([]);
                    setToggleCleared(!toggleCleared);
                },
            },
        );
    };

    const handleDisapproveSelected = () => {
        if (!selectedTaskIds.length)
            return alert("Select tasks to disapprove.");
        if (!remarks) return alert("Enter remarks to disapprove.");

        router.post(
            route("tasks.disapprove.bulk"),
            {
                task_ids: selectedTaskIds,
                remarks,
            },
            {
                onSuccess: () => {
                    setSelectedRows([]);
                    setToggleCleared(!toggleCleared);
                },
            },
        );

        setShowDisapproveModal(false);
        setRemarks("");
    };

    return (
        <div>
            {pendingTasks.length > 0 ? (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Pending Task Lists
                    </h2>

                    <DataTable
                        columns={columns}
                        data={pendingTasks}
                        selectableRows
                        onSelectedRowsChange={handleRowSelected}
                        pagination
                        highlightOnHover
                        selectableRowsHighlight
                        persistTableHead
                        clearSelectedRows={toggleCleared}
                    />

                    <div className="flex space-x-2 mt-4">
                        <button
                            onClick={handleApproveSelected}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => {
                                if (selectedTaskIds.length === 0) {
                                    alert(
                                        "Please select at least one task to disapprove.",
                                    );
                                    return;
                                }
                                setShowDisapproveModal(true);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Disapprove
                        </button>
                    </div>

                    {showDisapproveModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    Disapprove Tasks
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Enter remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    className="border px-3 py-2 w-full rounded mb-4"
                                />

                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() =>
                                            setShowDisapproveModal(false)
                                        }
                                        className="px-3 py-1 bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleDisapproveSelected}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Disapprove
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>No pending tasks.</p>
            )}
        </div>
    );
};

export default ManagerView;
