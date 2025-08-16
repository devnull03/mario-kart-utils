<script lang="ts">
	import TournamentBracket from '$lib/components/TournamentBracket.svelte';
	
	// Sample tournament data - similar to Challonge's structure
	const sampleMatches = [
		// Round 1 (Semifinals)
		{
			id: '1',
			identifier: '1',
			player1: { id: 'p1', name: 'Mario', seed: 1, score: 1 },
			player2: { id: 'p4', name: 'Bowser', seed: 4, score: 1 },
			winner: { id: 'p4', name: 'Bowser', seed: 4 },
			status: 'complete' as const,
			round: 1,
			position: 0
		},
		{
			id: '2', 
			identifier: '2',
			player1: { id: 'p2', name: 'Luigi', seed: 2, score: 0 },
			player2: { id: 'p3', name: 'Peach', seed: 3, score: 0 },
			winner: { id: 'p3', name: 'Peach', seed: 3 },
			status: 'complete' as const,
			round: 1,
			position: 1
		},
		
		// Round 2 (Finals) 
		{
			id: '3',
			identifier: '3', 
			player1: { id: 'p1', name: 'Mario', seed: 1, score: 0 },
			player2: { id: 'p2', name: 'Luigi', seed: 2, score: 0 },
			winner: { id: 'p2', name: 'Luigi', seed: 2 },
			status: 'complete' as const,
			round: 2,
			position: 0
		},
		
		// Round 3 (Championship)
		{
			id: '4',
			identifier: '4',
			player1: { id: 'p4', name: 'Bowser', seed: 4 },
			player2: { id: 'p3', name: 'Peach', seed: 3 },
			status: 'open' as const,
			round: 2,
			position: 1
		},
		
		// Losers bracket
		{
			id: '7',
			identifier: '7',
			player1: null, // Loser of match 4
			player2: { id: 'p2', name: 'Luigi', seed: 2 },
			status: 'pending' as const,
			round: 3,
			position: 0
		}
	];
	
	const sampleRounds = [
		{ number: 1, title: 'Semifinals' },
		{ number: 2, title: 'Finals' },
		{ number: 3, title: 'Championship' }
	];
</script>

<div class="container mx-auto p-4">
	<h1 class="text-3xl font-bold mb-8">Tournament Bracket</h1>
	
	<div class="border rounded-lg p-4 bg-background">
		<TournamentBracket 
			matches={sampleMatches}
			rounds={sampleRounds}
			width={800}
			height={300}
			class="border rounded"
		/>
	</div>
	
	<div class="mt-8 space-y-4">
		<h2 class="text-2xl font-semibold">How it works:</h2>
		<div class="prose prose-sm">
			<ul>
				<li><strong>SVG Rendering:</strong> Uses SVG elements for scalable, crisp graphics</li>
				<li><strong>Match States:</strong> Supports pending, open, and complete match states</li>
				<li><strong>Dynamic Lines:</strong> Automatically generates bracket connecting lines</li>
				<li><strong>Player Info:</strong> Shows seeds, names, scores, and winner highlighting</li>
				<li><strong>Responsive:</strong> Scrollable container for larger tournaments</li>
			</ul>
		</div>
	</div>
</div>