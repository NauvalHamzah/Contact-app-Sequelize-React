import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from '../components/TopBar.jsx';
import { MemoryRouter } from 'react-router-dom';

// Remove the jest.mock call from here

describe('TopBar', () => {
  test('renders TopBar component without errors', () => {
    const onSearch = jest.fn();
    const onSort = jest.fn();
    const isAsc = true;

    render(
      <MemoryRouter>
        <TopBar onSearch={onSearch} onSort={onSort} isAsc={isAsc} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /sort/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Contacts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
  });

  // ... rest of your tests ...

  test('navigates to "/add" when add user button is clicked', () => {
    const navigateMock = jest.fn();
    const useNavigateMock = jest.spyOn(require('react-router-dom'), 'useNavigate');
    useNavigateMock.mockImplementation(() => navigateMock);

    const onSearch = jest.fn();
    const onSort = jest.fn();

    render(
      <MemoryRouter>
        <TopBar onSort={onSort} onSearch={onSearch} isAsc={true} />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(addButton);

    expect(navigateMock).toHaveBeenCalledWith('/add');

    useNavigateMock.mockRestore();
  });
});