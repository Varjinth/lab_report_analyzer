
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowLeftIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function ResultPage() {
    const location = useLocation();
    const { userName, allTests = [] } = location.state || {};

    // Group by category
    const groupedByCategory = allTests.reduce((acc, test) => {
        const category = test.category || "Others";
        if (!acc[category]) acc[category] = [];
        acc[category].push(test);
        return acc;
    }, {});

    const [activeTab, setActiveTab] = useState("outRange");  // Default = "Out of Range"
    const [expandedCategories, setExpandedCategories] = useState([]); // Multiple expanded

    const toggleCategory = (category) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    const handleDownload = async () => {
        const response = await fetch("https://varjinth.pythonanywhere.com/download-pdf/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: userName,
                results: allTests,
            }),
        });

        if (!response.ok) {
            alert("Failed to download PDF.");
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lab_report.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
    };


    return (
        <div
            className="min-h-screen bg-cover bg-center p-6"
            style={{ backgroundColor: "white" }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header with Icons */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl p-6 shadow-md mb-2 flex items-center justify-between relative">
                    <ArrowLeftIcon
                        onClick={() => window.history.back()}
                        className="w-6 h-6 text-white cursor-pointer hover:text-blue-200 absolute left-6"
                        title="Go back"
                    />
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center flex-1">
                        Hi {userName}, here is your detailed report
                    </h1>
                    <ArrowDownTrayIcon
                        onClick={handleDownload}
                        className="w-6 h-6 text-white cursor-pointer hover:text-blue-200 absolute right-6"
                        title="Download report"
                    />
                </div>

                {allTests.length === 0 ? (
                    <div className="bg-white/90 text-center text-gray-700 rounded-b-xl shadow-lg p-10">
                        <p className="text-xl font-semibold">No test results found.</p>
                    </div>
                ) : null}

                <div className="rounded-xl overflow-hidden border border-gray-200">

                    {/* Range Tab Controller (OUTSIDE Accordion) */}
                    <div className="flex justify-center my-4">
                        <button
                            onClick={() => setActiveTab("inRange")}
                            className={`px-6 py-2 rounded-l-lg font-semibold ${activeTab === "inRange"
                                ? "bg-white text-blue-600 shadow"
                                : "bg-blue-100 text-blue-800"
                                }`}
                        >
                            In Range
                        </button>
                        <button
                            onClick={() => setActiveTab("outRange")}
                            className={`px-6 py-2 rounded-r-lg font-semibold ${activeTab === "outRange"
                                ? "bg-white text-red-600 shadow"
                                : "bg-red-100 text-red-800"
                                }`}
                        >
                            Out of Range
                        </button>
                    </div>

                    {/* Accordion Section */}
                    {Object.entries(groupedByCategory).map(([category, tests], i, arr) => {
                        const categoryInRange = tests.filter(t => t.status === "In Range");
                        const categoryOutRange = tests.filter(t => t.status !== "In Range");
                        const isExpanded = expandedCategories.includes(category);
                        const testsToShow = activeTab === "inRange" ? categoryInRange : categoryOutRange;

                        return (
                            <div key={i}>
                                <div className="border-b last:border-none">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 font-semibold text-lg hover:bg-blue-200 transition"
                                    >
                                        <span>{category} ({categoryInRange.length} In Range / {categoryOutRange.length} Out of Range)</span>
                                        {isExpanded ? (
                                            <ChevronUpIcon className="h-5 w-5 text-blue-700" />
                                        ) : (
                                            <ChevronDownIcon className="h-5 w-5 text-blue-700" />
                                        )}
                                    </button>

                                    {/* Accordion Content */}
                                    {/* Accordion Content */}
                                    <div
                                        className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <div className="px-6 pb-6">

                                            {/* Add spacing above grid */}
                                            <div className="mt-4">

                                                {/* Show message if no tests */}
                                                {testsToShow.length === 0 ? (
                                                    <div className="text-center text-gray-500 italic py-6">
                                                        No {activeTab === "inRange" ? "in-range" : "out-of-range"} tests found in this category.
                                                    </div>
                                                ) : (
                                                    // Grid (scroll removed)
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                        {testsToShow.map((test, index) => (
                                                            <div
                                                                key={index}
                                                                className={`p-4 border rounded-lg shadow-sm ${test.status === "In Range" ? "border-green-400" : "border-red-400"
                                                                    }`}
                                                            >
                                                                <h3 className="text-lg font-bold text-gray-800 mb-1">{test.name}</h3>
                                                                <p className="text-sm text-gray-600 mb-1">
                                                                    Ideal:{" "}
                                                                    {test.ref_min != null && test.ref_max != null
                                                                        ? `${test.ref_min} – ${test.ref_max} ${test.unit}`
                                                                        : test.ref_min != null
                                                                            ? `> ${test.ref_min} ${test.unit}`
                                                                            : test.ref_max != null
                                                                                ? `< ${test.ref_max} ${test.unit}`
                                                                                : "-"}
                                                                </p>

                                                                <p
                                                                    className={`text-xl font-bold ${test.status === "In Range" ? "text-green-600" : "text-red-600"
                                                                        }`}
                                                                >
                                                                    {test.value} {test.unit}
                                                                </p>

                                                                {test.ref_min != null && test.ref_max != null && (
                                                                    <div className="w-full bg-gray-200 rounded h-2 mt-2 overflow-hidden">
                                                                        <div
                                                                            className={`h-2 rounded ${test.status === "In Range" ? "bg-green-500" : "bg-red-500"
                                                                                }`}
                                                                            style={{
                                                                                width: `${Math.min(
                                                                                    Math.max(
                                                                                        ((test.value - test.ref_min) /
                                                                                            (test.ref_max - test.ref_min)) *
                                                                                        100,
                                                                                        0
                                                                                    ),
                                                                                    100
                                                                                )}%`,
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Separator between accordions */}
                                {i < arr.length - 1 && (
                                    <div className="border-t border-blue-200 mx-6" />
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}


