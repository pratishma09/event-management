import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ManagerView from "@/Components/ManagerView";
import EmployeeView from "@/Components/EmployeeView";

const Dashboard = ({
    role,
    checkIn,
    tasks,
    canSubmitTasks,
    pendingTasks,
}) => {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <EmployeeView
                    role={role}
                    checkIn={checkIn}
                    tasks={tasks}
                    canSubmitTasks={canSubmitTasks}
                />
                <ManagerView role={role} pendingTasks={pendingTasks} />
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;
