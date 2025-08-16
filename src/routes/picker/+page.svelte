<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';
	import {
		getDefaultMK8Tracks,
		getMK8TracksWithDLC,
		selectRandomItem,
		calculateSpinRotation,
		type PickerItem
	} from '$lib/utils/picker.util.js';
	import { cn } from '$lib/utils.js';
	import { Play, Plus, Trash2, RotateCcw, Filter } from '@lucide/svelte';
	import { onMount } from 'svelte';

	// Game selection options
	const gameOptions = [
		{ id: 'mk8deluxe', name: 'Mario Kart 8 Deluxe', available: true },
		{ id: 'mkworld', name: 'Mario Kart World', available: false },
		{ id: 'mkwii', name: 'Mario Kart Wii', available: false }
	];

	// Svelte 5 runes for reactive state
	let selectedGame = $state('mk8deluxe');
	let includeDLC = $state(false);
	let items = $state<PickerItem[]>([]);
	let originalItems = $state<PickerItem[]>([]);
	let isSpinning = $state(false);
	let rotation = $state(0);
	let selectedItem = $state<PickerItem | null>(null);
	let newItemName = $state('');
	let newItemColor = $state('#FF0000');
	let showFilters = $state(true);

	// Load tracks on mount and when filters change
	onMount(() => {
		loadTracks();
	});

	// Reactive effect to reload tracks when filters change
	$effect(() => {
		if (selectedGame === 'mk8deluxe') {
			loadTracks();
		}
	});

	async function loadTracks() {
		try {
			let tracks: PickerItem[];
			if (includeDLC) {
				tracks = await getMK8TracksWithDLC();
			} else {
				tracks = await getDefaultMK8Tracks();
			}
			items = [...tracks];
			originalItems = [...tracks];
		} catch (error) {
			console.error('Failed to load tracks:', error);
			// Fallback tracks
			items = [
				{ id: 'mario-kart-stadium', label: 'Mario Kart Stadium', color: '#FF6B6B' },
				{ id: 'water-park', label: 'Water Park', color: '#4ECDC4' },
				{ id: 'sweet-sweet-canyon', label: 'Sweet Sweet Canyon', color: '#FFB347' },
				{ id: 'thwomp-ruins', label: 'Thwomp Ruins', color: '#95A5A6' }
			];
			originalItems = [...items];
		}
	}

	// Handle game selection change
	function handleGameChange(gameId: string) {
		if (gameOptions.find((g) => g.id === gameId)?.available) {
			selectedGame = gameId;
			if (gameId === 'mk8deluxe') {
				loadTracks();
			}
		}
	}

	// Handle DLC toggle
	function handleDLCToggle() {
		includeDLC = !includeDLC;
		loadTracks();
	}

	// Add new item to the picker
	function addItem() {
		if (newItemName.trim()) {
			const newItem: PickerItem = {
				id: Date.now().toString(),
				label: newItemName.trim(),
				color: newItemColor
			};
			items = [...items, newItem];
			newItemName = '';
		}
	}

	// Remove item from the picker
	function removeItem(itemId: string) {
		items = items.filter((item) => item.id !== itemId);
		if (selectedItem?.id === itemId) {
			selectedItem = null;
		}
	}

	// Start the spinning animation
	function spin() {
		if (items.length === 0 || isSpinning) return;

		isSpinning = true;
		selectedItem = null;

		// Select random item
		const randomItem = selectRandomItem(items);
		if (!randomItem) return;

		const selectedIndex = items.findIndex((item) => item.id === randomItem.id);
		const newRotation = rotation + calculateSpinRotation(selectedIndex, items.length);

		rotation = newRotation;

		// Set selected item after animation
		setTimeout(() => {
			selectedItem = randomItem;
			isSpinning = false;
		}, 3000);
	}

	// Reset the spinner
	function reset() {
		if (isSpinning) return;
		rotation = 0;
		selectedItem = null;
	}

	// Reset to original tracks
	function resetToDefaults() {
		if (isSpinning) return;
		items = [...originalItems];
		selectedItem = null;
	}

	// Handle enter key in input
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addItem();
		}
	}
</script>

<svelte:head>
	<title>Mario Kart Track Picker</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-2">🏁 Mario Kart Track Picker</h1>
		<p class="text-gray-600">Spin the wheel to randomly select a Mario Kart track!</p>
	</div>

	<!-- Filters Section -->
	<div class="mb-8 p-6 bg-gray-50 rounded-lg">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-semibold text-gray-800">Filter Options</h2>
			<button
				onclick={() => (showFilters = !showFilters)}
				class="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
			>
				<Filter class="h-4 w-4" />
				<span>{showFilters ? 'Hide' : 'Show'} Filters</span>
			</button>
		</div>

		{#if showFilters}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Game Selection -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-3">Select Game</label>
					<div class="space-y-2">
						{#each gameOptions as game (game.id)}
							<button
								onclick={() => handleGameChange(game.id)}
								disabled={!game.available}
								class={cn(
									'w-full text-left px-4 py-3 rounded-md border transition-all',
									game.available
										? selectedGame === game.id
											? 'border-blue-500 bg-blue-50 text-blue-900'
											: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
										: 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
								)}
							>
								<div class="flex items-center justify-between">
									<span class="font-medium">{game.name}</span>
									{#if !game.available}
										<span class="text-xs text-gray-500">Coming Soon</span>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- DLC Options (only for MK8 Deluxe) -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-3">Track Options</label>
					{#if selectedGame === 'mk8deluxe'}
						<div class="space-y-3">
							<label class="flex items-center space-x-3 cursor-pointer">
								<input
									type="checkbox"
									checked={includeDLC}
									onchange={handleDLCToggle}
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<span class="text-gray-700">Include DLC Tracks</span>
							</label>
							<p class="text-sm text-gray-500">
								{includeDLC
									? `All tracks included (${items.length} tracks)`
									: `Base game tracks only (${items.length} tracks)`}
							</p>
						</div>
					{:else}
						<p class="text-gray-500 italic">Options will be available when game is released</p>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Spinner Section -->
		<div class="flex flex-col items-center space-y-6">
			<div class="relative">
				{#if items.length > 0}
					<Spinner {items} {isSpinning} {rotation} size={320} class="drop-shadow-xl" />
				{:else}
					<div
						class="flex items-center justify-center rounded-full border-4 border-dashed border-gray-300 bg-gray-50 text-gray-500"
						style="width: 320px; height: 320px;"
					>
						<div class="text-center">
							<Plus class="mx-auto mb-2 h-12 w-12" />
							<p class="text-lg font-medium">Loading tracks...</p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Control Buttons -->
			<div class="flex space-x-4">
				<button
					onclick={spin}
					disabled={items.length === 0 || isSpinning}
					class={cn(
						'flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all',
						items.length === 0 || isSpinning
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
					)}
				>
					<Play class="h-5 w-5" />
					<span>{isSpinning ? 'Spinning...' : 'Spin!'}</span>
				</button>

				<button
					onclick={reset}
					disabled={isSpinning}
					class={cn(
						'flex items-center space-x-2 px-4 py-3 rounded-lg border border-gray-300 font-medium transition-all',
						isSpinning
							? 'text-gray-400 cursor-not-allowed'
							: 'text-gray-700 hover:bg-gray-50 active:scale-95'
					)}
				>
					<RotateCcw class="h-4 w-4" />
					<span>Reset</span>
				</button>
			</div>

			<!-- Selected Result -->
			{#if selectedItem}
				<div class="text-center p-6 bg-green-50 border-2 border-green-200 rounded-lg">
					<h3 class="text-2xl font-bold text-green-800 mb-2">🏆 Selected Track!</h3>
					<div
						class="inline-block px-4 py-2 rounded-full text-white font-semibold text-lg"
						style="background-color: {selectedItem.color || '#6366f1'}"
					>
						{selectedItem.label}
					</div>
				</div>
			{/if}
		</div>

		<!-- Items Management Section -->
		<div class="space-y-6">
			<div>
				<h2 class="text-2xl font-bold text-gray-900 mb-4">Manage Tracks</h2>

				<!-- Add new item form -->
				<div class="bg-gray-50 p-4 rounded-lg mb-6">
					<h3 class="text-lg font-semibold text-gray-800 mb-3">Add Custom Track</h3>
					<div class="space-y-3">
						<div>
							<label for="item-name" class="block text-sm font-medium text-gray-700 mb-1">
								Track Name
							</label>
							<input
								id="item-name"
								type="text"
								bind:value={newItemName}
								onkeydown={handleKeyDown}
								placeholder="Enter track name..."
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div>
							<label for="item-color" class="block text-sm font-medium text-gray-700 mb-1">
								Color
							</label>
							<input
								id="item-color"
								type="color"
								bind:value={newItemColor}
								class="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
							/>
						</div>
						<button
							onclick={addItem}
							disabled={!newItemName.trim()}
							class={cn(
								'w-full px-4 py-2 rounded-md font-medium transition-all',
								!newItemName.trim()
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
							)}
						>
							<Plus class="inline h-4 w-4 mr-2" />
							Add Track
						</button>
					</div>
				</div>

				<!-- Items list -->
				<div class="space-y-2">
					<h3 class="text-lg font-semibold text-gray-800">
						Current Tracks ({items.length})
					</h3>
					{#if items.length === 0}
						<p class="text-gray-500 text-center py-4">Loading tracks...</p>
					{:else}
						<div class="space-y-2 max-h-80 overflow-y-auto">
							{#each items as item (item.id)}
								<div
									class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
								>
									<div class="flex items-center space-x-3">
										<div
											class="w-4 h-4 rounded-full border border-gray-300"
											style="background-color: {item.color || '#6366f1'}"
										></div>
										<span class="font-medium text-gray-900">{item.label}</span>
									</div>
									{#if !originalItems.some((orig) => orig.id === item.id)}
										<button
											onclick={() => removeItem(item.id)}
											disabled={isSpinning}
											class={cn(
												'p-1 rounded-md transition-colors',
												isSpinning
													? 'text-gray-400 cursor-not-allowed'
													: 'text-red-600 hover:bg-red-50'
											)}
										>
											<Trash2 class="h-4 w-4" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Reset to defaults button -->
				<button
					onclick={resetToDefaults}
					disabled={isSpinning}
					class={cn(
						'w-full mt-4 px-4 py-2 rounded-md border border-gray-300 font-medium transition-all',
						isSpinning
							? 'text-gray-400 cursor-not-allowed'
							: 'text-gray-700 hover:bg-gray-50 active:scale-95'
					)}
				>
					Reset to Default Tracks
				</button>
			</div>
		</div>
	</div>
</div>
