import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Generates a consistent HSL color based on an index using golden ratio
 * This ensures good color distribution and visual variety
 */
export function generateColorFromIndex(index: number, saturation = 70, lightness = 60): string {
	// Use golden ratio conjugate for better color distribution
	const goldenRatioConjugate = 0.618033988749895;
	const hue = (index * goldenRatioConjugate * 360) % 360;
	return `hsl(${Math.floor(hue)}, ${saturation}%, ${lightness}%)`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
