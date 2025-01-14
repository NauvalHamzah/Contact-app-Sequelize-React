import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ContactList from '../components/ContactList'; // Adjust the import path if necessary
import ContactItem from '../components/ContactItem';
import userEvent from '@testing-library/user-event';

test('renders a list of ContactItem components and handles avatar click', async () => {
  const mockRemoveContact = jest.fn();
  const mockUpdateContact = jest.fn();
  const mockUpdateAvatar = jest.fn();
  global.URL.createObjectURL = jest.fn(() => 'mocked-url');

  // Sample data to pass to the ContactList
  const contactData = [
    { id: '1', name: 'John Doe', phone: '123-456-7890', avatar: 'avatar.png' },
    { id: '2', name: 'Jane Smith', phone: '987-654-3210', avatar: 'avatar2.png' }
  ];

  render(
    <ContactList
      data={contactData}
      removeContact={mockRemoveContact}
      updateContact={mockUpdateContact}
      updateAvatar={mockUpdateAvatar}
    />
  );

  // Check if both contacts are rendered
  expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();

  // Simulate clicking on the avatar of the first contact
  const firstAvatar = screen.getByAltText('John Doe'); // Using name for alt text
  userEvent.click(firstAvatar);

  // Create a mock file event
  const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
  const fileInput = screen.getByTestId(`avatar-upload-${contactData[0].id}`);
  
  // Simulate file upload
  await userEvent.upload(fileInput, file);

  // Check if the updateAvatar function is called with the correct arguments
  await waitFor(() => {
    expect(mockUpdateAvatar).toHaveBeenCalledWith(contactData[0].id, expect.any(FormData));
  });

  // Check if the removeContact function is triggered when the delete button is clicked (optional)
  fireEvent.click(screen.getAllByLabelText(/delete-contact/i)[0]);

  await waitFor(() => {
      expect(mockRemoveContact).toHaveBeenCalledWith('1');
  });
});

