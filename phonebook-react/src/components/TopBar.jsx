//import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownZA, faArrowUpZA, faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "../styling/TopBar.css"; // Import the CSS file for styling



export default function TopBar ({onSearch, onSort, isAsc}) {
    const navigate = useNavigate();

    const onAddUser = () => {
        navigate('/add');
    };

    const handleKeyUp = (event) => {
        onSearch(event.target.value); // Pass the search term to the parent component
    };

    return (
        <div className="top-bar">
            {/* Sort Button */}
            <button onClick={onSort} className="sort-button">
                <FontAwesomeIcon icon={isAsc ? faArrowDownZA : faArrowUpZA} />
            </button>
    
            {/* Search Input */}
            <div className="search-container">
                {/* Icon inside the input box */}
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                {/* Input field */}
                <input
                    type="text"
                    placeholder="Search Contacts"
                    onKeyUp={handleKeyUp}
                    className="search-input"
                />
            </div>
    
            {/* Add User Button */}
            <button onClick={onAddUser} className="add-user-button">
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        </div>
    );
    
};