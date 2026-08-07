import "./Dashboard.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function Dashboard() {

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [color, setColor] = useState("#ffffff");
    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [username, setUsername] = useState("");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });


    // ---------------- FETCH NOTES ----------------
const fetchNotes = async () => {

    setLoading(true);

    try {

        const token = localStorage.getItem("token");

        const response = await api.get(
            `/notes?page=${page}&limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        setNotes(response.data.notes);
        setTotalPages(response.data.total_pages);

        setLoading(false);

    } catch (error) {

        console.log(error);

        setLoading(false);
    }

};

const fetchUser = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.get("/me", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        setUsername(response.data.user.sub);

    } catch (error) {

        console.log(error);

    }

};

const searchNotes = async (query) => {

    try {

        const token = localStorage.getItem("token");

        if (query.trim() === "") {
            fetchNotes();
            return;
        }

        const response = await api.get(
            `/notes/search?q=${query}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setNotes(response.data);

    } catch (error) {

        console.log(error);

    }

};

    // ---------------- CREATE NOTE ----------------
    const createNote = async () => {

        setCreating(true);

        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/notes",
                {
                    title,
                    content,
                    color
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchNotes();

            setTitle("");
            setContent("");
            setColor("#ffffff");

            toast.success("Note created successfully 🎉");
            setCreating(false);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.detail || "Failed to create note"
            );

            setCreating(false);

        }

    };

    // ---------------- DELETE NOTE ----------------
    
    const deleteNote = async (id) => {

        const result = await Swal.fire({

            title: "Delete Note?",

            text: "You won't be able to recover this note!",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#d33",

            cancelButtonColor: "#3085d6",

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel"

        });

        if (!result.isConfirmed) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await api.delete(`/notes/${id}`, {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            await fetchNotes();

            toast.success("Note deleted successfully 🗑️");

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.detail || "Failed to delete note"
            );

        }

    };

    // ---------------- START EDITING ----------------
    const startEditing = (note) => {

        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setColor(note.color);
        setIsEditing(true);

    };

    // ---------------- UPDATE NOTE ----------------
    const updateNote = async () => {

        setUpdating(true);

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/notes/${editingId}`,
                {
                    title,
                    content, 
                    color

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchNotes();

            setTitle("");
            setContent("");

            setEditingId(null);
            setIsEditing(false);

            toast.success("Note updated successfully ✏️");
            setUpdating(false);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.detail || "Failed to update note"
            );
            setUpdating(false);

        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    // ---------------- LOAD NOTES ----------------
    useEffect(() => {

        fetchNotes();

        fetchUser();

    }, [page]);

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }

    }, [darkMode]);

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">

                <h1 className="dashboard-title">

                    ☁️ CloudNotes

                </h1>

                <div className="header-right">

                    <span className="welcome-user">
                        👋 {username}
                    </span>

                    <button
                        className="theme-btn"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

            <input
                className="search-input"
                type="text"
                placeholder="🔍 Search your notes..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    searchNotes(e.target.value);
                }}
            />

            <div className="note-form">

                {isEditing && (
                    <h3 className="editing-text">
                        ✏️ Editing Note
                    </h3>
                )}

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Write your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="color-picker">

                    <p>🎨 Choose Note Color</p>

                    <div className="colors">

                        <button
                            className={`color-btn ${
                                color === "#ffffff" ? "selected" : ""
                            }`}
                            style={{ backgroundColor: "#ffffff" }}
                            onClick={() => setColor("#ffffff")}
                        ></button>

                        <button
                            className={`color-btn ${
                                color === "#FFF9C4" ? "selected" : ""
                            }`}
                            style={{ backgroundColor: "#FFF9C4" }}
                            onClick={() => setColor("#FFF9C4")}
                        ></button>

                        <button
                            className={`color-btn ${
                                color === "#C8E6C9" ? "selected" : ""
                            }`}
                            style={{ backgroundColor: "#C8E6C9" }}
                            onClick={() => setColor("#C8E6C9")}
                        ></button>

                        <button
                            className={`color-btn ${
                                color === "#BBDEFB" ? "selected" : ""
                            }`}
                            style={{ backgroundColor: "#BBDEFB" }}
                            onClick={() => setColor("#BBDEFB")}
                        ></button>

                        <button
                            className={`color-btn ${
                                color === "#F8BBD0" ? "selected" : ""
                            }`}
                            style={{ backgroundColor: "#F8BBD0" }}
                            onClick={() => setColor("#F8BBD0")}
                        ></button>

                        <button
                            className={`color-btn ${
                                color === "#E1BEE7" ? "selected" : ""
                            }`}
                            style={{ backgroundColor: "#E1BEE7" }}
                            onClick={() => setColor("#E1BEE7")}
                        ></button>

                    </div>

                </div>
                <div className="form-buttons">

                    <button
                        onClick={isEditing ? updateNote : createNote}
                        disabled={
                            creating ||
                            !title.trim() ||
                            !content.trim()
                        }
                    >
                        {isEditing
                            ? updating
                                ? "Updating..."
                                : "Update Note"
                            : creating
                                ? "Creating..."
                                : "Add Note"

                        }
                    </button>

                    {isEditing && (
                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setIsEditing(false);
                                setEditingId(null);
                                setTitle("");
                                setContent("");
                            }}
                        >
                            Cancel
                        </button>
                    )}

                </div>

            </div>

            {loading ? (

                <h2 className="loading-text">
                    Loading Notes...
                </h2>

            ) : notes.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        {search.trim() ? "🔍" : "📝"}
                    </h2>

                    <h3>
                        {search.trim()
                            ? "No matching notes found"
                            : "No Notes Yet"}
                    </h3>

                    <p>
                        {search.trim()
                            ? "Try another keyword."
                            : "Create your first note to get started."}
                    </p>

                </div>
    

            ) : (

                notes.map((note) => (

                    <NoteCard
                        key={note.id}
                        note={note}
                        onDelete={deleteNote}
                        onEdit={startEditing}
                        fetchNotes={fetchNotes}
                    />

                ))

            )}

            <div className="pagination">

                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    ⬅ Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Next ➡
                </button>

            </div>

        </div>
    );
}

export default Dashboard;