import "./NoteCard.css";

function NoteCard({ note, onDelete, onEdit }) {
    return (
        <div className="note-card">

            <h3>{note.title}</h3>

            <p>{note.content}</p>

            <div className="note-actions">

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

