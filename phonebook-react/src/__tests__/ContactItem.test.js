// src/components/ContactItem.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactItem from '../components/ContactItem';  // Import the ContactItem component
import userEvent from '@testing-library/user-event';

// Mock the functions passed as props
const mockRemove = jest.fn();
const mockUpdate = jest.fn();
const mockUpdateAvatar = jest.fn();

// Test ContactItem Component
describe('ContactItem', () => {
    const contact = {
        id: '1',
        name: 'John Doe',
        phone: '123-456-7890',
        avatar: 'avatar.png',
    };

    afterEach(() => {
        jest.clearAllTimers(); // If you're using timers in the component
        jest.clearAllMocks();  // Clear any mocked functions
    });


    test('renders contact information in view mode', () => {
        render(
            <ContactItem
                contact={contact}
                remove={mockRemove}
                update={mockUpdate}
                updateAvatar={mockUpdateAvatar}
            />
        );

        // Check that the contact name and phone are rendered
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument();

        // Check that the Edit and Delete buttons are present
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    test('switches to edit mode when edit button is clicked', async () => {
        render(
            <ContactItem
                contact={contact}
                remove={mockRemove}
                update={mockUpdate}
                updateAvatar={mockUpdateAvatar}
            />
        );

        //Before Edit
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument();

        // Click the edit button
        userEvent.click(screen.getByRole('button', { name: /edit-contact/i }));

        await waitFor(() => {
            // Check that the input fields for name and phone appear
            expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
            expect(screen.getByDisplayValue(/123-456-7890/i)).toBeInTheDocument();

            // Check that the save button appears
            expect(screen.getByRole('button', { name: /save-edit/i })).toBeInTheDocument();
        })
    });

    test('does not update if name or phone is empty and save is clicked', async () => {
        window.alert = jest.fn();

        render(
            <ContactItem
                contact={contact}
                remove={mockRemove}
                update={mockUpdate}
                updateAvatar={mockUpdateAvatar}
            />
        );

        // Switch to edit mode
        userEvent.click(screen.getByRole('button', { name: /edit-contact/i }));

        // Clear the name input
        await waitFor(() => {
            userEvent.clear(screen.getByDisplayValue(/John Doe/i));
        })

        // Try clicking the save button
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        // Expect an alert to be triggered (since the name is empty)
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Nama atau nomor telepon tidak boleh kosong');
        })

        window.alert.mockRestore();

    });

    test('calls update when save is clicked with valid inputs', async () => {
        const mockUpdate = jest.fn();

        render(
            <ContactItem
                contact={contact}
                remove={mockRemove}
                update={mockUpdate}
                updateAvatar={mockUpdateAvatar}
            />
        );

        // Switch to edit mode
        userEvent.click(screen.getByRole('button', { name: /edit/i }));

        await waitFor(() => {
            expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
            expect(screen.getByDisplayValue(/123-456-7890/i)).toBeInTheDocument();
        });

        // Find inputs by name
        const nameInput = screen.getByRole('textbox', { name: 'contact-name' });
        const phoneInput = screen.getByRole('textbox', { name: 'contact-phone' });

        // Update inputs
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Jane Smith');
        await userEvent.clear(phoneInput);
        await userEvent.type(phoneInput, '987-654-3210');

        // Click save button
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        // Check that the update function was called with the correct arguments
        await waitFor(() =>
            expect(mockUpdate).toHaveBeenCalledWith('1', {
                name: 'Jane Smith',
                phone: '987-654-3210',
                avatar: 'avatar.png',
            })
        )
    });

    test('calls remove when delete button is clicked', async () => {
        const mockRemove = jest.fn();

        render(
            <ContactItem
                contact={contact}
                remove={mockRemove}
                update={mockUpdate}
                updateAvatar={mockUpdateAvatar}
            />
        );

        // Click the delete button
        userEvent.click(screen.getByRole('button', { name: /delete/i }));

        // Check that the remove function was called with the correct contact id
        await waitFor(() =>
            expect(mockRemove).toHaveBeenCalledWith('1')
        )
    });

    test('handles avatar click and file change', async () => {
        const mockUpdateAvatar = jest.fn();
        global.URL.createObjectURL = jest.fn(() => 'mocked-url');
   
        render(
            <ContactItem
                contact={contact}
                remove={mockRemove}
                update={mockUpdate}
                updateAvatar={mockUpdateAvatar}
            />
        );
   
        // Trigger avatar click to open file input
        userEvent.click(screen.getByAltText(/John Doe/i));
   
        // Create a mock file event
        const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
   
        // Query the file input directly
        const fileInput = screen.getByTestId(`avatar-upload-${contact.id}`);
   
        // Simulate file upload
        userEvent.upload(fileInput, file);
   
        // Check that the updateAvatar function is called with FormData
        await waitFor(() => {
            expect(mockUpdateAvatar).toHaveBeenCalledWith('1', expect.any(FormData));
        });
    });
   
});
