import './StyleSheets/App.css';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/queryClient';
import AppLayout from './Components/AppLayout';
import RouteError from './Components/RouteError';
import Home from './Components/Home';
import About from './Components/About';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import AlertToaster from './Components/AlertToaster';

const title = 'Jottr | AI-powered notes';

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				errorElement: <RouteError />,
				children: [
					{ index: true, element: <Home title={'Home'} /> },
					{ path: 'about', element: <About title={'About'} /> },
					{ path: 'login', element: <Login title={title} /> },
					{ path: 'signup', element: <SignUp title={title} /> },
					{ path: '*', element: <RouteError /> },
				],
			},
		],
	},
]);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AlertToaster />
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
