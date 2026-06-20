import '../StyleSheets/noteCard.css';

// one placeholder card that mirrors a real NoteCard's shape and field sizes
function ShimmerCard() {
	return (
		<div className='col-md-6 p-0'>
			<div className='my-3'>
				<div className='card m-auto' id='notesCard' style={{ width: '95%' }}>
					<div className='card-body notesCardBody'>
						<div className='shimmerBar shimmerTitle'></div>
						<div className='shimmerBar shimmerLine'></div>
						<div className='shimmerBar shimmerLine'></div>
						<div className='shimmerBar shimmerLine shimmerLineShort'></div>
						<div className='shimmerBar shimmerTag'></div>
						<div className='shimmerBar shimmerDate'></div>
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
