import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { createContact } from "../api";
import "../styling/AddContactForm.css";

export default function ContactForm() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const navigate = useNavigate();
    const backHome = () => {
        navigate('/');
      };

    const submit = (e) => {
        e.preventDefault()
        createContact({name, phone})
        setName('')
        setPhone('')
        backHome()
    }

    return (
        <div className="form-container">
            <form onSubmit={submit}>
                {/* Name Input */}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                />

                {/* Phone Input */}
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="form-input"
                />

                {/* Buttons */}
                <div className="buttons-container">
                    {/* Save Button */}
                    <button
                        type="submit"
                        className="form-button"
                    >
                        Save
                    </button>

                    {/* Cancel Button */}
                    <button
                        type="button"
                        className="form-button"
                        onClick={backHome}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
