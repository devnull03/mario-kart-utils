import { generateColorFromIndex } from '$lib/utils.js';

export interface PickerItem {
	id: string;
	label: string;
	color?: string;
	weight?: number; // for weighted random selection
}

export interface TrackItem {
	name: string;
	isDeluxCourse: boolean;
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
 * Converts track items to picker items
 */
export function tracksToPickerItems(tracks: TrackItem[]): PickerItem[] {
	return tracks.map((track, index) => ({
		id: track.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
		label: track.name,
		color: generateColorFromIndex(index)
	}));
}

/**
 * Loads tracks from JSON file
 */
async function loadTracksFromJSON(): Promise<TrackItem[]> {
	try {
		// Import the JSON directly - this will work in both dev and production
		const { default: tracks } = await import('../data/mario-kart-8-deluxe.json');
		return tracks as TrackItem[];
	} catch (error) {
		console.error('Failed to load tracks from JSON:', error);
		try {
			// Try to load fallback tracks from JSON
			const { default: fallbackTracks } = await import('../data/fallback-tracks.json');
			return fallbackTracks as TrackItem[];
		} catch (fallbackError) {
			console.error('Failed to load fallback tracks:', fallbackError);
			// Last resort: empty array - the UI will handle this gracefully
			return [];
		}
	}
}

/**
 * Gets default Mario Kart 8 Deluxe tracks (base game only, no DLC)
 */
export async function getDefaultMK8Tracks(): Promise<PickerItem[]> {
	const allTracks = await loadTracksFromJSON();
	const baseTracks = allTracks.filter(track => !track.isDeluxCourse);
	return tracksToPickerItems(baseTracks);
}

/**
 * Gets Mario Kart 8 Deluxe tracks with DLC included
 */
export async function getMK8TracksWithDLC(): Promise<PickerItem[]> {
	const allTracks = await loadTracksFromJSON();
	return tracksToPickerItems(allTracks);
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
