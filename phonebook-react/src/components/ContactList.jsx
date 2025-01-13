import ContactItem from "./ContactItem"
import "../styling/ContactList.css";

export default function ContactList({ data, removeContact, updateContact, updateAvatar }) {
    const nodeList = data.map(
        (contact) => <ContactItem
            key={contact.id}
            contact={contact}
            remove={removeContact}
            update={updateContact}
            updateAvatar={updateAvatar} />
    )

    return (
        <div className="contact-list">
            {nodeList}
        </div>
    )
}