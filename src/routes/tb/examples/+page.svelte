<script lang="ts">
	import TournamentBracket from '$lib/components/TournamentBracket.svelte';
	
	// Enhanced 4-round tournament data
	const fourRoundMatches = [
		// Round 1 - First Round (8 players)
		{
			id: '1',
			identifier: '1',
			player1: { id: 'p1', name: 'Mario', seed: 1, score: 2 },
			player2: { id: 'p8', name: 'Koopa', seed: 8, score: 0 },
			winner: { id: 'p1', name: 'Mario', seed: 1 },
			status: 'complete' as const,
			round: 1,
			position: 0
		},
		{
			id: '2',
			identifier: '2',
			player1: { id: 'p4', name: 'Bowser', seed: 4, score: 2 },
			player2: { id: 'p5', name: 'Yoshi', seed: 5, score: 1 },
			winner: { id: 'p4', name: 'Bowser', seed: 4 },
			status: 'complete' as const,
			round: 1,
			position: 1
		},
		{
			id: '3',
			identifier: '3',
			player1: { id: 'p2', name: 'Luigi', seed: 2, score: 2 },
			player2: { id: 'p7', name: 'Toad', seed: 7, score: 0 },
			winner: { id: 'p2', name: 'Luigi', seed: 2 },
			status: 'complete' as const,
			round: 1,
			position: 2
		},
		{
			id: '4',
			identifier: '4',
			player1: { id: 'p3', name: 'Peach', seed: 3, score: 1 },
			player2: { id: 'p6', name: 'DK', seed: 6, score: 2 },
			winner: { id: 'p6', name: 'DK', seed: 6 },
			status: 'complete' as const,
			round: 1,
			position: 3
		},
		
		// Round 2 - Quarterfinals
		{
			id: '5',
			identifier: '5',
			player1: { id: 'p1', name: 'Mario', seed: 1, score: 2 },
			player2: { id: 'p4', name: 'Bowser', seed: 4, score: 1 },
			winner: { id: 'p1', name: 'Mario', seed: 1 },
			status: 'complete' as const,
			round: 2,
			position: 0
		},
		{
			id: '6',
			identifier: '6',
			player1: { id: 'p2', name: 'Luigi', seed: 2, score: 1 },
			player2: { id: 'p6', name: 'DK', seed: 6, score: 2 },
			winner: { id: 'p6', name: 'DK', seed: 6 },
			status: 'complete' as const,
			round: 2,
			position: 1
		},
		
		// Round 3 - Semifinals
		{
			id: '7',
			identifier: '7',
			player1: { id: 'p1', name: 'Mario', seed: 1 },
			player2: { id: 'p6', name: 'DK', seed: 6 },
			status: 'open' as const,
			round: 3,
			position: 0
		},
		
		// Round 4 - Finals
		{
			id: '8',
			identifier: '8',
			player1: null, // Winner of semifinals
			player2: null, // Other semifinal would be here
			status: 'pending' as const,
			round: 4,
			position: 0
		}
	];
	
	const fourRounds = [
		{ number: 1, title: 'First Round' },
		{ number: 2, title: 'Quarterfinals' },
		{ number: 3, title: 'Semifinals' },
		{ number: 4, title: 'Finals' }
	];
	
	// Double elimination bracket (4 rounds winners + losers bracket)
	const doubleElimMatches = [
		// Winners Bracket Round 1
		{
			id: 'w1',
			identifier: 'W1',
			player1: { id: 'p1', name: 'Mario', seed: 1, score: 2 },
			player2: { id: 'p8', name: 'Koopa', seed: 8, score: 0 },
			winner: { id: 'p1', name: 'Mario', seed: 1 },
			status: 'complete' as const,
			round: 1,
			position: 0
		},
		{
			id: 'w2',
			identifier: 'W2',
			player1: { id: 'p4', name: 'Bowser', seed: 4, score: 1 },
			player2: { id: 'p5', name: 'Yoshi', seed: 5, score: 2 },
			winner: { id: 'p5', name: 'Yoshi', seed: 5 },
			status: 'complete' as const,
			round: 1,
			position: 1
		},
		{
			id: 'w3',
			identifier: 'W3',
			player1: { id: 'p2', name: 'Luigi', seed: 2, score: 2 },
			player2: { id: 'p7', name: 'Toad', seed: 7, score: 1 },
			winner: { id: 'p2', name: 'Luigi', seed: 2 },
			status: 'complete' as const,
			round: 1,
			position: 2
		},
		{
			id: 'w4',
			identifier: 'W4',
			player1: { id: 'p3', name: 'Peach', seed: 3, score: 0 },
			player2: { id: 'p6', name: 'DK', seed: 6, score: 2 },
			winner: { id: 'p6', name: 'DK', seed: 6 },
			status: 'complete' as const,
			round: 1,
			position: 3
		},
		
		// Winners Bracket Round 2
		{
			id: 'w5',
			identifier: 'W5',
			player1: { id: 'p1', name: 'Mario', seed: 1 },
			player2: { id: 'p5', name: 'Yoshi', seed: 5 },
			status: 'open' as const,
			round: 2,
			position: 0
		},
		{
			id: 'w6',
			identifier: 'W6',
			player1: { id: 'p2', name: 'Luigi', seed: 2 },
			player2: { id: 'p6', name: 'DK', seed: 6 },
			status: 'open' as const,
			round: 2,
			position: 1
		},
		
		// Losers Bracket Round 1
		{
			id: 'l1',
			identifier: 'L1',
			player1: { id: 'p8', name: 'Koopa', seed: 8 },
			player2: { id: 'p4', name: 'Bowser', seed: 4 },
			status: 'pending' as const,
			round: 1,
			position: 4 // Position below winners bracket
		},
		{
			id: 'l2',
			identifier: 'L2',
			player1: { id: 'p7', name: 'Toad', seed: 7 },
			player2: { id: 'p3', name: 'Peach', seed: 3 },
			status: 'pending' as const,
			round: 1,
			position: 5
		}
	];
	
	const doubleElimRounds = [
		{ number: 1, title: 'Round 1' },
		{ number: 2, title: 'Round 2' },
		{ number: 3, title: 'Semi-Finals' },
		{ number: 4, title: 'Finals' }
	];
</script>

<div class="container mx-auto p-4 space-y-12">
	<h1 class="text-4xl font-bold">Tournament Bracket Examples</h1>
	
	<!-- Single Elimination 4 Rounds -->
	<section>
		<h2 class="text-2xl font-semibold mb-4">Single Elimination (4 Rounds)</h2>
		<div class="border rounded-lg p-6 bg-card">
			<TournamentBracket 
				matches={fourRoundMatches}
				rounds={fourRounds}
				width={1000}
				height={350}
				class="border rounded-md"
			/>
		</div>
	</section>
	
	<!-- Double Elimination Preview -->
	<section>
		<h2 class="text-2xl font-semibold mb-4">Double Elimination Preview</h2>
		<div class="border rounded-lg p-6 bg-card">
			<TournamentBracket 
				matches={doubleElimMatches}
				rounds={doubleElimRounds}
				width={1000}
				height={500}
				class="border rounded-md"
			/>
		</div>
		<p class="text-sm text-muted-foreground mt-2">
			Note: This shows winners bracket (top) and losers bracket (bottom). 
			Full double elimination would need more complex positioning logic.
		</p>
	</section>
	
	<!-- Feature Overview -->
	<section>
		<h2 class="text-2xl font-semibold mb-4">SVG Rendering Features</h2>
		<div class="grid md:grid-cols-2 gap-6">
			<div class="space-y-4">
				<h3 class="text-lg font-medium">Core Components</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-center gap-2">
						<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
						<span><strong>SVG Match Boxes:</strong> Scalable vector graphics for crisp rendering</span>
					</li>
					<li class="flex items-center gap-2">
						<div class="w-2 h-2 bg-green-500 rounded-full"></div>
						<span><strong>Dynamic Lines:</strong> Automatic bracket line generation</span>
					</li>
					<li class="flex items-center gap-2">
						<div class="w-2 h-2 bg-purple-500 rounded-full"></div>
						<span><strong>Player Cards:</strong> Seeds, names, scores with winner highlighting</span>
					</li>
					<li class="flex items-center gap-2">
						<div class="w-2 h-2 bg-orange-500 rounded-full"></div>
						<span><strong>Match States:</strong> Pending, open, complete visual states</span>
					</li>
				</ul>
			</div>
			
			<div class="space-y-4">
				<h3 class="text-lg font-medium">Customization</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-center gap-2">
						<div class="w-2 h-2 bg-red-500 rounded-full"></div>
						<span><strong>Flexible Layout:</strong> Configurable dimensions and spacing</span>
					</li>
					<li class="flex items-center gap-2">
						<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
						<span><strong>Theme Integration:</strong> Uses your app's color system</span>
					</li>
					<li class="flex items-center gap-2">
						<div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
						<span><strong>Responsive:</strong> Scrollable containers for large brackets</span>
					</li>
					<li class="flex items-center gap-2">
						<div class="w-2 h-2 bg-pink-500 rounded-full"></div>
						<span><strong>Extensible:</strong> Easy to add new features and interactions</span>
					</li>
				</ul>
			</div>
		</div>
	</section>
	
	<!-- Next Steps -->
	<section class="bg-muted p-6 rounded-lg">
		<h3 class="text-lg font-semibold mb-3">Next Steps for Enhancement</h3>
		<div class="grid md:grid-cols-2 gap-4 text-sm">
			<div>
				<h4 class="font-medium mb-2">Functionality</h4>
				<ul class="space-y-1">
					<li>• Click handlers for match interactions</li>
					<li>• Live score updates</li>
					<li>• Player profile integration</li>
					<li>• Match scheduling</li>
				</ul>
			</div>
			<div>
				<h4 class="font-medium mb-2">Layout</h4>
				<ul class="space-y-1">
					<li>• True double elimination positioning</li>
					<li>• Multi-stage tournament support</li>
					<li>• Group stage integration</li>
					<li>• Mobile-optimized layouts</li>
				</ul>
			</div>
		</div>
	</section>
</div>
