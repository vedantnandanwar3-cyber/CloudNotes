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
    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [username, setUsername] = useState("");

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
                    content
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
        setIsEditing(true);

    };

    // ---------------- UPDATE NOTE ----------------
    const updateNote = async () => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/notes/${editingId}`,
                {
                    title,
                    content
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

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.detail || "Failed to update note"
            );

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

                        className="logout-btn"

                        onClick={logout}

                    >

                        Logout

                    </button>

                </div>

            </div>

            <input
                type="text"
                placeholder="🔍 Search notes..."
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

                <div className="form-buttons">

                    <button
                        onClick={isEditing ? updateNote : createNote}
                        disabled={
                            creating ||
                            !title.trim() ||
                            !content.trim()
                        }
                    >
                        {creating
                            ? "Creating..."
                            : isEditing
                                ? "Update Note"
                                : "Add Note"}
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

                    <h2>📝</h2>

                    <h3>No Notes Yet</h3>

                    <p>Create your first note to get started.</p>

                </div>

            ) : (

                notes.map((note) => (

                    <NoteCard
                        key={note.id}
                        note={note}
                        onDelete={deleteNote}
                        onEdit={startEditing}
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