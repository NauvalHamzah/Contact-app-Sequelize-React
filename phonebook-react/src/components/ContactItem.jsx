import { useState } from "react";

export default function ContactItem({ contact, remove, update, updateAvatar }) {
    const [onEdit, setOnEdit] = useState(false)
    const [name, setName] = useState(contact.name)
    const [phone, setPhone] = useState(contact.phone)
    const [avatarPreview, setAvatarPreview] = useState({});


    // Handle avatar click to trigger file input
    const handleAvatarClick = (id) => {
        document.getElementById(`avatar-upload-${id}`).click();
    };

    // Handle avatar file change and upload
    const handleAvatarChange = async (id, event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatarPreview((prev) => ({
                ...prev,
                [id]: imageUrl,
            }));

             // Prepare FormData and pass to App.jsx handler
             const formData = new FormData();
             formData.append('avatar', file);
 
             // Call the handler passed down from App.jsx to update the avatar
             updateAvatar(id, formData);
        }
    };

    return (
        <div className="contact-item">
            {/* Avatar */}
            <div className="contact-avatar-container">
                <img
                    src={avatarPreview[contact.id] || contact.avatar || "default_avatar.png"}
                    alt={contact.name}
                    className="contact-avatar"
                    onClick={() => handleAvatarClick(contact.id)}
                />
                <input
                    id={`avatar-upload-${contact.id}`}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleAvatarChange(contact.id, e)}
                />
            </div>

            {onEdit ?
                //Edit Mode
                <div className="contact-info">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="edit-input"
                    />
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="edit-input"
                    />
                    <div className="contact-actions">
                        <button
                            className="save-btn"
                            onClick={() => {
                                if (name === '' || phone === '') {
                                    alert('Nama atau nomor telepon tidak boleh kosong');
                                } else {
                                    update(contact.id, { name, phone, avatar: contact.avatar });
                                    setOnEdit(false);
                                }
                            }}
                        >
                            <i className="fas fa-save"></i>
                        </button>
                    </div>
                </div>
                :
                //View Mode
                <div className="contact-info">
                    <h3>{contact.name}</h3>
                    <p>{contact.phone}</p>
                    <div className="contact-actions">
                        <button className="edit-btn" onClick={() => setOnEdit(true)}>
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => remove(contact.id)}>
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            }
        </div>
    )
} 
