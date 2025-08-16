export interface PickerItem {
	id: string;
	label: string;
	color?: string;
	weight?: number; // for weighted random selection
}

export interface TrackItem {
	id: string;
	name: string;
	cup: string;
	series: string;
	difficulty: string;
	environment: string;
	color: string;
	pack?: string; // for DLC tracks
}

export interface GameData {
	game: string;
	baseTracks: TrackItem[];
	retrotracks: TrackItem[];
	dlcTracks: TrackItem[];
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
 * Calculates the rotation angle for the spinner to land on selected item
 * The calculation accounts for the pointer being at the top (12 o'clock position)
 */
export function calculateSpinRotation(
	selectedIndex: number,
	totalItems: number,
	spins: number = 3
): number {
	const anglePerItem = 360 / totalItems;
	// Calculate the angle from the top (12 o'clock) to the center of the selected item
	// We subtract from 360 because we want to spin counter-clockwise to land on the item
	const targetAngle = 360 - (selectedIndex * anglePerItem + anglePerItem / 2);
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
 * Converts track items to picker items
 */
export function tracksToPickerItems(tracks: TrackItem[]): PickerItem[] {
	return tracks.map((track) => ({
		id: track.id,
		label: track.name,
		color: track.color
	}));
}

/**
 * Gets default Mario Kart 8 Deluxe tracks (base + retro, no DLC)
 */
export async function getDefaultMK8Tracks(): Promise<PickerItem[]> {
	try {
		const response = await fetch('/data/mario-kart-8-deluxe.json');
		const gameData: GameData = await response.json();
		const allBaseTracks = [...gameData.baseTracks, ...gameData.retrotracks];
		return tracksToPickerItems(allBaseTracks);
	} catch (error) {
		console.error('Failed to load MK8 tracks:', error);
		// Fallback to a few manual tracks
		return [
			{ id: 'mario-kart-stadium', label: 'Mario Kart Stadium', color: '#FF6B6B' },
			{ id: 'water-park', label: 'Water Park', color: '#4ECDC4' },
			{ id: 'sweet-sweet-canyon', label: 'Sweet Sweet Canyon', color: '#FFB347' },
			{ id: 'thwomp-ruins', label: 'Thwomp Ruins', color: '#95A5A6' }
		];
	}
}

/**
 * Gets Mario Kart 8 Deluxe tracks with DLC included
 */
export async function getMK8TracksWithDLC(): Promise<PickerItem[]> {
	try {
		const response = await fetch('/data/mario-kart-8-deluxe.json');
		const gameData: GameData = await response.json();
		const allTracks = [...gameData.baseTracks, ...gameData.retrotracks, ...gameData.dlcTracks];
		return tracksToPickerItems(allTracks);
	} catch (error) {
		console.error('Failed to load MK8 tracks with DLC:', error);
		return getDefaultMK8Tracks();
	}
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
