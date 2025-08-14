export interface PickerItem {
	id: string;
	label: string;
	color?: string;
	weight?: number; // for weighted random selection
}

export interface SpinnerState {
	isSpinning: boolean;
	selectedItem: PickerItem | null;
	rotation: number;
}

/**
 * Randomly selects an item from the given array
 */
export function selectRandomItem<T>(items: T[]): T | null {
	if (items.length === 0) return null;
	const randomIndex = Math.floor(Math.random() * items.length);
	return items[randomIndex];
}

/**
 * Selects a random item with weighted probability
 */
export function selectWeightedRandomItem(items: PickerItem[]): PickerItem | null {
	if (items.length === 0) return null;

	const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
	let random = Math.random() * totalWeight;

	for (const item of items) {
		random -= item.weight || 1;
		if (random <= 0) {
			return item;
		}
	}

	return items[items.length - 1]; // fallback
}

/**
 * Calculates the rotation angle for the spinner based on selected item
 */
export function calculateSpinRotation(
	selectedIndex: number,
	totalItems: number,
	spins: number = 3
): number {
	const anglePerItem = 360 / totalItems;
	const targetAngle = selectedIndex * anglePerItem;
	return spins * 360 + targetAngle;
}

/**
 * Generates default Mario Kart related picker items
 */
export function getDefaultMarioKartItems(): PickerItem[] {
	return [
		{ id: 'mario', label: 'Mario', color: '#FF0000' },
		{ id: 'luigi', label: 'Luigi', color: '#00FF00' },
		{ id: 'peach', label: 'Princess Peach', color: '#FFB6C1' },
		{ id: 'bowser', label: 'Bowser', color: '#8B4513' },
		{ id: 'yoshi', label: 'Yoshi', color: '#32CD32' },
		{ id: 'toad', label: 'Toad', color: '#FF69B4' },
		{ id: 'koopa', label: 'Koopa Troopa', color: '#90EE90' },
		{ id: 'shy-guy', label: 'Shy Guy', color: '#FF6347' }
	];
}

/**
 * Creates a spin animation with realistic easing
 */
export function createSpinAnimation(duration: number = 3000): {
	duration: number;
	easing: string;
} {
	return {
		duration,
		easing: 'cubic-bezier(0.23, 1, 0.32, 1)' // smooth deceleration
	};
}
