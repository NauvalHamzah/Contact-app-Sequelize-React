import { useEffect, useState, useCallback } from "react";
import TopBar from "./TopBar";
import ContactList from "./ContactList";
import DeleteModal from "./DeleteModal";
import {
    getContacts,
    deleteContact,
    updateContact,
    updateAvatar,
} from "../api";

export default function ContactPage() {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAsc, setIsAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loadContacts = useCallback(
        async (filter = '', order = 'ASC', page = 1) => {
            try {
                const data = await getContacts({ filter, order, page});
                console.log(data)
                if (page === 1) {
                    setContacts(data.contacts);
                } else {
                    setContacts((prevContacts) => {
                        const existingIds = new Set(prevContacts.map((contact) => contact.id));
                        const newContacts = data.contacts.filter((contact) => !existingIds.has(contact.id));
                        return [...prevContacts, ...newContacts];
                    });
                }
                setHasMore(data.contacts.length > 0); // Check if there's more data
            } catch (error) {
                console.log(error);
                alert('Failed to load data');
            }
        },
        [setContacts, setHasMore]
    );

    useEffect(() => {
        document.body.style.minHeight = `${window.innerHeight + 1}px`;      
      }, []);

    const removeContact = async (id) => {
        setContactToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        await deleteContact(contactToDelete);
        const updatedContacts = contacts.filter(
            (contact) => contact.id !== contactToDelete
        );
        setContacts(updatedContacts);

        setShowModal(false);
        setContactToDelete(null);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setContactToDelete(null);
    };

    const editContact = async (id, updatedContact) => {
        try {
            await updateContact(id, updatedContact);
    
            const promises = [];
            for (let i = 1; i <= currentPage; i++) {
                promises.push(getContacts({ filter: searchTerm, order: isAsc ? 'ASC' : 'DESC', page: i }));
            }
    
            // Fetch all pages and combine the results
            const results = await Promise.all(promises);
            const allContacts = results.flatMap((result) => result.contacts);
    
            // Update the state with the sorted contacts
            setContacts(allContacts);
    
            setHasMore(results[results.length - 1].contacts.length > 0);
        } catch (error) {
            console.error('Failed to edit contact:', error);
            alert('Failed to update contact');
        }
    };
    

    const editAvatar = async (id, formData) => {
        await updateAvatar(id, formData);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
        loadContacts(term, isAsc ? 'ASC' : 'DESC', 1);
    };

    const handleSort = () => {
        const newSortOrder = isAsc ? 'DESC' : 'ASC'; // Toggle the sort order
        setIsAsc(!isAsc); // Update the sorting state
        setCurrentPage(1);
        loadContacts(searchTerm, newSortOrder, 1);
    };

    const loadMoreContacts = useCallback(() => {
        if (hasMore && !isLoading) {
            setIsLoading(true); // Mark as loading
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadContacts(searchTerm, isAsc ? 'ASC' : 'DESC', nextPage)
                .finally(() => setIsLoading(false)); // Reset loading state
        }
    }, [hasMore, isLoading, currentPage, searchTerm, isAsc, loadContacts]);

    useEffect(() => {
        loadContacts(searchTerm, isAsc ? 'ASC' : 'DESC', 1);
    }, [searchTerm, isAsc, loadContacts]);

    useEffect(() => {
        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        };
    
        const handleScroll = debounce(() => {
            if (                
                window.innerHeight + window.scrollY >=
                document.documentElement.offsetHeight - 100 &&
                hasMore
            ) {
                loadMoreContacts();
            }
        }, 200);
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreContacts, hasMore]);
    

    return (
        <div>
            <TopBar onSearch={handleSearch} onSort={handleSort} isAsc={isAsc} />
            <ContactList
                data={contacts}
                removeContact={removeContact}
                updateContact={editContact}
                updateAvatar={editAvatar}
            />
            <DeleteModal show={showModal} onConfirm={confirmDelete} onCancel={cancelDelete} />
        </div>
    );
}
