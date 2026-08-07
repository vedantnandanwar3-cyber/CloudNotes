import "./NoteCard.css";
import api from "../services/api";
import toast from "react-hot-toast";

function NoteCard({ note, onDelete, onEdit, fetchNotes }) {

    const handlePin = async () => {
        try {
            const token = localStorage.getItem("token");

            console.log("Token:", token);
            console.log("Note ID:", note.id);

            const response = await api.put(
                `/notes/${note.id}/pin`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("SUCCESS", response.data);

            toast.success(
                note.is_pinned ? "Note Unpinned 📌" : "Note Pinned 📌"
            );

            fetchNotes();

        } catch (error) {
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            console.log("URL:", error.config?.url);
            console.log(error);

            toast.error("Failed to update pin");
        }
    };

    const createdDate = new Date(note.created_at);

        const formattedDate = createdDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        const formattedTime = createdDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div
            className={`note-card ${note.is_pinned ? "pinned" : ""}`}
            style={{
                backgroundColor: note.color
            }}
        >

            {note.is_pinned && (
                <div className="pin-badge">
                    📌 PINNED
                </div>
            )}

            <h3>
                {note.is_pinned && "📌 "}
                {note.title}
            </h3>

            <p>{note.content}</p>

            <div className="note-date">

                <small>📅 {formattedDate}</small>

                <br />

                <small>🕒 {formattedTime}</small>

            </div>

            <div className="note-actions">

                <button
                    onClick={handlePin}
                >
                    {note.is_pinned ? "📍 Unpin" : "📌 Pin"}
                </button>

                <button
                    className="edit-btn"
                    onClick={() => onEdit(note)}
                >
                    ✏️ Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={() => onDelete(note.id)}
                >
                    🗑️ Delete
                </button>

            </div>

        </div>
    );
}

export default NoteCard;