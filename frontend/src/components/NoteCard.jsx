import "./NoteCard.css";
import api from "../services/api";
import toast from "react-hot-toast";

function NoteCard({ note, onDelete, onEdit, fetchNotes }) {

    const handlePin = async () => {

        try {

            await api.put(
                `/notes/${note.id}/pin`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(
                note.is_pinned ? "Note Unpinned 📌" : "Note Pinned 📌"
            );

            fetchNotes();

        } catch (error) {

            toast.error("Failed to update pin");

            console.log(error);

        }

    };

    return (
        <div className="note-card">

            <h3>
                {note.is_pinned && "📌 "}
                {note.title}
            </h3>

            <p>{note.content}</p>

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