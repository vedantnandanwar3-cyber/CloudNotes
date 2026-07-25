import "./Dashboard.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";

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

    // ---------------- FETCH NOTES ----------------
const fetchNotes = async () => {

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

        // 👇 Debug output
        console.log("Full Response:", response.data);
        console.table(response.data.notes);

        setNotes(response.data.notes);
        setTotalPages(response.data.total_pages);

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

            fetchNotes();

            setTitle("");
            setContent("");

        } catch (error) {

            console.log(error);

        }

    };

    // ---------------- DELETE NOTE ----------------
    const deleteNote = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await api.delete(`/notes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchNotes();

        } catch (error) {

            console.log(error);

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

            fetchNotes();

            setTitle("");
            setContent("");

            setEditingId(null);
            setIsEditing(false);

        } catch (error) {

            console.log(error);

        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    // ---------------- LOAD NOTES ----------------
    useEffect(() => {

        fetchNotes();

    }, [page]);

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">

                <h1 className="dashboard-title">
                    ☁️ CloudNotes
                </h1>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

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

                <button
                    onClick={
                        isEditing
                            ? updateNote
                            : createNote
                    }
                >
                    {
                        isEditing
                            ? "Update Note"
                            : "Add Note"
                    }
                </button>

            </div>

            {notes.map((note) => (

                <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={deleteNote}
                    onEdit={startEditing}
                />

            ))}

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