import { generateColorFromIndex } from '$lib/utils.js';

export interface PickerItem {
	id: string;
	label: string;
	color?: string;
	weight?: number; // for weighted random selection
}

export interface TrackItem {
	name: string;
	origin: string;
	type: 'regular' | 'booster';
	alternateName?: string;
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
		// Return empty array - the UI will handle this gracefully
		return [];
	}
}

/**
 * Gets default Mario Kart 8 Deluxe tracks (base game only, no DLC)
 */
export async function getDefaultMK8Tracks(): Promise<PickerItem[]> {
	const allTracks = await loadTracksFromJSON();
	const baseTracks = allTracks.filter(track => track.type === 'regular');
	return tracksToPickerItems(baseTracks);
}

/**
 * Gets Mario Kart 8 Deluxe tracks with DLC included
 */
export async function getMK8TracksWithDLC(): Promise<PickerItem[]> {
	const allTracks = await loadTracksFromJSON();
	return tracksToPickerItems(allTracks);
}
