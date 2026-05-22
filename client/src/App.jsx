import './StyleSheets/App.css';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import AppLayout from './Components/AppLayout';
import RouteError from './Components/RouteError';
import Home from './Components/Home';
import About from './Components/About';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import AlertToaster from './Components/AlertToaster';
import NoteState from './context/notes/NoteState';

const host = import.meta.env.VITE_HOST;
const title = 'CloudBook | Your notes on cloud';

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				errorElement: <RouteError />,
				children: [
					{ index: true, element: <Home title={'Home'} /> },
					{ path: 'about', element: <About title={'About'} /> },
					{ path: 'login', element: <Login host={host} title={title} /> },
					{ path: 'signup', element: <SignUp host={host} title={title} /> },
					{ path: '*', element: <RouteError /> },
				],
			},
		],
	},
]);

function App() {
	return (
		<NoteState host={host}>
			<AlertToaster />
			<RouterProvider router={router} />
		</NoteState>
	);
}

export default App;
