import * as RadixTooltip from '@radix-ui/react-tooltip';

// hover/keyboard-focus label for icon-only buttons; never opens on touch
function Tooltip({ label, children }) {
	return (
		<RadixTooltip.Provider delayDuration={400} disableHoverableContent>
			<RadixTooltip.Root>
				<RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
				<RadixTooltip.Portal>
					<RadixTooltip.Content
						sideOffset={6}
						className='tooltipContent z-1080 rounded-lg border border-frost-border bg-frost px-2.5 py-1 font-secondary text-[0.8rem] text-white backdrop-blur-[7px] backdrop-saturate-191'
					>
						{label}
					</RadixTooltip.Content>
				</RadixTooltip.Portal>
			</RadixTooltip.Root>
		</RadixTooltip.Provider>
	);
}

export default Tooltip;
