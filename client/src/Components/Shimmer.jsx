// one placeholder card that mirrors a real NoteCard's shape and field sizes
function ShimmerCard() {
	return (
		<div className='w-full md:w-1/2'>
			<div className='my-4'>
				<div className='frost relative mx-auto' style={{ width: '95%' }}>
					<div className='mx-[0.3rem] my-[0.8rem] p-4'>
						<div className='shimmer-bar mb-[1.2rem] h-[1.8rem] w-3/5'></div>
						<div className='shimmer-bar mb-[0.7rem] h-[1.1rem] w-full'></div>
						<div className='shimmer-bar mb-[0.7rem] h-[1.1rem] w-full'></div>
						<div className='shimmer-bar mb-[1.2rem] h-[1.1rem] w-3/4'></div>
						<div className='shimmer-bar mb-[0.9rem] h-[1.1rem] w-[30%]'></div>
						<div className='shimmer-bar h-[0.8rem] w-1/4'></div>
					</div>
				</div>
			</div>
		</div>
	);
}

function Shimmer() {
	return (
		<>
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
			<ShimmerCard />
		</>
	);
}

export default Shimmer;
