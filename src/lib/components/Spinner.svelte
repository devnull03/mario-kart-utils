<script lang="ts">
	import type { PickerItem } from '$lib/utils/picker.util.js';
	import { cn, generateColorFromIndex } from '$lib/utils.js';

	interface Props {
		items: PickerItem[];
		isSpinning?: boolean;
		rotation?: number;
		onSpinComplete?: (selectedItem: PickerItem) => void;
		size?: number;
		class?: string;
	}

	let {
		items,
		isSpinning = false,
		rotation = 0,
		onSpinComplete,
		size = 300,
		class: className,
		...restProps
	}: Props = $props();

	let spinnerElement: HTMLDivElement;

	// Calculate segment angle for each item
	const segmentAngle = $derived(items.length > 0 ? 360 / items.length : 0);

	// Handle animation end to trigger callback
	function handleAnimationEnd() {
		if (onSpinComplete && items.length > 0) {
			// Calculate which item was selected based on final rotation
			const normalizedRotation = ((rotation % 360) + 360) % 360;
			const selectedIndex = Math.floor(normalizedRotation / segmentAngle);
			const correctedIndex = (items.length - selectedIndex) % items.length;
			onSpinComplete(items[correctedIndex]);
		}
	}

	// Generate path for SVG segment
	function createSegmentPath(
		index: number,
		centerX: number,
		centerY: number,
		radius: number
	): string {
		const startAngle = (index * segmentAngle - 90) * (Math.PI / 180); // -90 to start from top
		const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

		const x1 = centerX + radius * Math.cos(startAngle);
		const y1 = centerY + radius * Math.sin(startAngle);
		const x2 = centerX + radius * Math.cos(endAngle);
		const y2 = centerY + radius * Math.sin(endAngle);

		const largeArcFlag = segmentAngle > 180 ? 1 : 0;

		return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
	}

	// Calculate text position for labels
	function getTextPosition(index: number, centerX: number, centerY: number, radius: number) {
		const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
		const textRadius = radius * 0.7;
		const x = centerX + textRadius * Math.cos(angle);
		const y = centerY + textRadius * Math.sin(angle);
		
		let textRotation = (index * segmentAngle + segmentAngle / 2) - 90;
		
	
		return { x, y, angle: textRotation };
	}
</script>

<!-- Container for the entire spinner with fixed pointer -->
<div class="relative" style="width: {size}px; height: {size}px;" {...restProps}>
	<!-- Fixed pointer at the top -->
	<div class="absolute left-1/2 top-0 z-30" style="transform: translateX(-50%) translateY(-12px);">
		<div
			class="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-md"
		></div>
	</div>

	<!-- Rotating spinner wheel -->
	<div
		bind:this={spinnerElement}
		class={cn(
			'relative rounded-full border-4 border-gray-300 bg-white overflow-hidden',
			'transition-transform duration-3000 ease-out',
			className
		)}
		style="width: {size}px; height: {size}px; transform: rotate({rotation}deg);"
		onanimationend={handleAnimationEnd}
	>
		<!-- Spinner segments -->
		<svg class="absolute inset-0 h-full w-full" viewBox="0 0 {size} {size}">
			{#each items as item, index (index)}
				{@const textPos = getTextPosition(index, size / 2, size / 2, size / 2 - 4)}
				<g>
					<!-- Segment path -->
					<path
						d={createSegmentPath(index, size / 2, size / 2, size / 2 - 4)}
						fill={item.color || generateColorFromIndex(index)}
						stroke="#fff"
						stroke-width="2"
					/>

					<!-- Item label -->
					<text
						x={textPos.x}
						y={textPos.y}
						text-anchor="middle"
						dominant-baseline="middle"
						class="fill-white text-xs font-bold"
						style="font-size: {Math.min(12, Math.max(8, size / 30))}px;"
						transform="rotate({textPos.angle}, {textPos.x}, {textPos.y})"
					>
						{item.label}
					</text>
				</g>
			{/each}
		</svg>

		<!-- Center circle -->
		<div
			class="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 shadow-md z-10"
		></div>
	</div>
</div>

<style>
	.transition-transform {
		transition-property: transform;
	}

	.duration-3000 {
		transition-duration: 3000ms;
	}

	.ease-out {
		transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
	}
</style>
