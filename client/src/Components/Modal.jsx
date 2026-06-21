import * as Dialog from '@radix-ui/react-dialog';

function Modal({ open, onOpenChange, title, children, footer, size = 'lg' }) {
	const maxWidth = size === 'sm' ? 'max-w-[300px]' : 'max-w-[800px]';
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className='modalOverlay fixed inset-0 z-1050 bg-black/50' />
				<Dialog.Content
					aria-describedby={undefined}
					className={`modalContent fixed left-1/2 top-1/2 z-1055 flex max-h-[calc(100vh-3.5rem)] w-[calc(100%-2rem)] ${maxWidth} flex-col overflow-hidden rounded-lg border border-frost-border bg-frost text-white backdrop-blur-[7px] backdrop-saturate-191`}
				>
					<div className='flex items-center justify-between border-b border-[rgba(255,255,255,0.15)] p-4'>
						<Dialog.Title className='font-secondary text-[1.25rem] font-semibold'>
							{title}
						</Dialog.Title>
						<Dialog.Close
							className='cursor-pointer border-none bg-transparent text-[1.25rem] leading-none text-white opacity-75 hover:opacity-100'
							aria-label='Close'
						>
							<i className='fa-solid fa-xmark' aria-hidden='true'></i>
						</Dialog.Close>
					</div>
					<div className='overflow-y-auto p-4'>{children}</div>
					{footer && (
						<div className='flex items-center justify-end gap-2 border-t border-[rgba(255,255,255,0.15)] p-4'>
							{footer}
						</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default Modal;
