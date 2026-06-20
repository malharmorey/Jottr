import useDocumentTitle from '../hooks/useDocumentTitle';
import { Link } from 'react-router';

const About = ({ title }) => {
	useDocumentTitle(`Jottr | ${title}`);
	return (
		<div className='frost mx-auto w-fit'>
			<div className='mx-[0.8rem] my-4'>
				<h2 className='mb-[0.9rem] text-center font-secondary text-[2.2rem] font-semibold'>
					About{' '}
				</h2>
				<div className='text-center font-secondary text-[1.1rem]'>
					<span className='font-primary text-[1.15rem] font-semibold'>
						Jottr
					</span>{' '}
					is a personal note-taking📝 application to store our thoughts💬, life
					lessons, memories💌, stories and many more directly to the cloud☁️. It
					is secure🔒, fast⚡️ and reliable🌞. Sign Up{' '}
					<Link
						className='font-secondary text-[rgb(108,204,252)] no-underline'
						to='/signup'
					>
						here
					</Link>{' '}
					for free🎉 and start writing notes its fun!
					<p className='mt-3'>Made 👨🏻‍💻 with ❤️ by Malhar.</p>
				</div>
			</div>
		</div>
	);
};

export default About;
