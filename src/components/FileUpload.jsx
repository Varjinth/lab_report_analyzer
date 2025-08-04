import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline"; // You can use any icon or logo


export default function UploadPage() {
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file || !name) return alert("Please fill in all fields");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);

        fetch("https://varjinth.pythonanywhere.com/analyze-report/", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {

                navigate("/result", {
                    state: {
                        userName: name,
                        allTests: data.results,
                    },
                });
            });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "admin123") {
            navigate("/myadmin");
        } else {
            setLoginError("Invalid credentials");
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center grid grid-cols-1 md:grid-cols-2 items-center p-8"
            style={{
                backgroundImage: "url('background.jpg')",
            }}
        >
            {/* 🔒 Login icon */}
            <LockClosedIcon
                onClick={() => setShowLogin(true)}
                className="w-8 h-8 text-white absolute top-6 right-6 cursor-pointer hover:text-blue-300 z-50"
                title="Admin Login"
            />

            {/* 🌐 Left side content */}
            <div className="flex items-center justify-center h-full p-4">
                <div className="bg-gradient-to-br from-white/90 via-blue-100 backdrop-blur-md shadow-2xl rounded-3xl p-10 max-w-md border border-blue-200">
                    <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
                        Analyze Your Lab Report
                    </h2>
                    <p className="text-gray-700 text-md leading-relaxed">
                        Discover what your lab test reveals about your overall health and wellness.
                    </p>
                    <p className="text-gray-700 text-md leading-relaxed">
                        Our smart analyzer highlights results using color-coded indicators, so you can easily understand what’s within range — and what needs attention.
                    </p>
                    <p className="text-gray-700 text-md leading-relaxed">
                        Ideal for tracking fitness goals, making lifestyle changes, or sharing insights with your coach or healthcare professional.
                    </p>
                </div>
            </div>

            {/* 📤 Right side upload form */}
            <div className="flex items-center justify-center h-full p-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-br from-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 w-full max-w-md"
                >
                    <h1 className="text-2xl font-semibold text-center mb-2">Upload Report</h1>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Upload your medical PDF report to see results
                    </p>

                    <label className="block text-sm mb-2 font-medium">Name</label>
                    <input
                        type="text"
                        placeholder="Enter Your Good Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label className="block text-sm mb-2 font-medium">Attach Document</label>
                    <div className="border border-dashed border-gray-400 p-6 text-center rounded-md mb-4 bg-white">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-input"
                        />
                        <label htmlFor="file-input" className="cursor-pointer text-blue-500">
                            {file ? file.name : "Drag and drop or click to select a PDF file"}
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-lg"
                    >
                        Upload
                    </button>
                </form>
            </div>

            {/* 🪟 Modal Login Form */}
            {showLogin && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
                        <button
                            onClick={() => {
                                setShowLogin(false);
                                setUsername("");
                                setPassword("");
                                setLoginError("");
                            }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold text-center mb-4">Admin Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {loginError && (
                                <p className="text-sm text-red-600 mb-2 text-center">{loginError}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-lg"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

