import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function AdminPage() {
  const [testList, setTestList] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTest, setCurrentTest] = useState({});


  useEffect(() => {
    fetch("https://varjinth.pythonanywhere.com/tests/") // Replace with your actual backend URL
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tests");
        }
        return res.json();
      })
      .then((data) => {
        setTestList(data); // data should be an array of test objects
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tests:", error);
        // setLoading(false);
      });
  }, []);

  const openModal = (test = null) => {
    setEditMode(!!test);
    setCurrentTest(
      test || {
        test_name: null,
        category: null,
        unit: null,
        ref_min: null,
        ref_max: null,
        possible_names: null,
      }
    );
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTest((prev) => ({ ...prev, [name]: value }));
  };

  const saveTest = () => {
    // Basic validation
    if (!currentTest.test_name || currentTest.test_name.trim() === "") {
      return alert("Test name is required.");
    }

    // Check if ref_min and ref_max are both provided
    const refMin = currentTest.ref_min;
    const refMax = currentTest.ref_max;

    if (refMin !== null && refMin !== "" && refMax !== null && refMax !== "") {
      const min = parseFloat(refMin);
      const max = parseFloat(refMax);

      if (isNaN(min) || isNaN(max)) {
        return alert("Reference Min and Max must be valid numbers.");
      }

      if (min >= max) {
        return alert("Reference Max must be greater than Reference Min.");
      }
    }

    // Proceed with saving
    const url = editMode
      ? `https://varjinth.pythonanywhere.com/tests/${currentTest.id}/`
      : "https://varjinth.pythonanywhere.com/tests/";

    const method = editMode ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentTest),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to save test");
        }
        return res.json();
      })
      .then((data) => {
        if (editMode) {
          setTestList((prev) =>
            prev.map((t) => (t.id === data.id ? data : t))
          );
        } else {
          setTestList((prev) => [...prev, data]);
        }
        closeModal();
      })
      .catch((error) => {
        console.error("Save error:", error);
        alert("Something went wrong while saving. Check console.");
      });
  };



  const deleteTest = (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      fetch(`https://varjinth.pythonanywhere.com/tests/${id}/`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete test");
          }
          setTestList((prev) => prev.filter((t) => t.id !== id));
        })
        .catch((error) => {
          console.error("Delete error:", error);
          alert("Something went wrong while deleting. Check console.");
        });
    }
  };


  return (
    <div className="min-h-screen bg-cover bg-center p-6" style={{ backgroundImage: "url('background.jpg')" }}>
      <div className="max-w-6xl mx-auto">

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl p-6 shadow-md mb-4 flex items-center justify-between relative">
          {/* Back Icon on the Left */}
          <ArrowLeftIcon
            className="w-6 h-6 cursor-pointer hover:text-blue-200 absolute left-6"
            onClick={() => window.history.back()}
            title="Go back"
          />

          {/* Centered Title */}
          <h1 className="text-3xl font-bold mx-auto text-center">Hi Admin</h1>

          {/* Invisible spacer to maintain symmetry */}
          <div className="w-6 h-6 invisible"></div>
        </div>


        <div className="bg-white/90 backdrop-blur-md rounded-b-xl shadow-lg p-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => openModal()}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              Add Test
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Test Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Unit</th>
                  <th className="px-4 py-2 text-left">Ref Min</th>
                  <th className="px-4 py-2 text-left">Ref Max</th>
                  <th className="px-4 py-2 text-left">Possible Names</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testList.map((test) => (
                  <tr key={test.id}>
                    <td className="px-4 py-2">{test.test_name}</td>
                    <td className="px-4 py-2">{test.category}</td>
                    <td className="px-4 py-2">{test.unit}</td>
                    <td className="px-4 py-2">{test.ref_min}</td>
                    <td className="px-4 py-2">{test.ref_max}</td>
                    <td className="px-4 py-2">{test.possible_names}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => openModal(test)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="w-5 h-5 inline" />
                      </button>
                      <button
                        onClick={() => deleteTest(test.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">
                {editMode ? "Edit Test" : "Add Test"}
              </h2>
              <div className="space-y-3">
                {["test_name", "category", "unit", "ref_min", "ref_max", "possible_names"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    value={currentTest[field] || ""}
                    onChange={handleChange}
                    placeholder={field.replace(/_/g, " ").toUpperCase()}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
                  Cancel
                </button>
                <button onClick={saveTest} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
