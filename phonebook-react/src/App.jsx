import './App.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import ContactPage from './components/ContactPage';
import AddContact from './components/AddContactForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ContactPage />,
  },
  {
    path: "/add",
    element: <AddContact />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;