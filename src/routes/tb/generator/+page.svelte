<script lang="ts">
	import TournamentBracket from '$lib/components/TournamentBracket.svelte';
	import { 
		generateSingleEliminationBracket,
		generateDoubleEliminationBracket,
		createSamplePlayers,
		simulateMatches
	} from '$lib/utils/bracket.util';
	
	// Reactive state
	let playerCount = $state(8);
	let tournamentType = $state<'single' | 'double'>('single');
	let showSimulation = $state(false);
	
	// Generate tournament data reactively
	const tournamentData = $derived.by(() => {
		const players = createSamplePlayers(playerCount);
		
		let bracket;
		if (tournamentType === 'single') {
			bracket = generateSingleEliminationBracket(players);
		} else {
			bracket = generateDoubleEliminationBracket(players);
		}
		
		// Apply simulation if requested
		if (showSimulation) {
			bracket.matches = simulateMatches(bracket.matches, players);
		}
		
		return bracket;
	});
	
	// Calculate bracket dimensions based on rounds and matches
	const bracketDimensions = $derived.by(() => {
		const rounds = tournamentData.rounds.length;
		const maxMatchesInRound = Math.max(
			...Array.from({ length: rounds }, (_, i) => 
				tournamentData.matches.filter(m => m.round === i + 1).length
			)
		);
		
		return {
			width: Math.max(800, rounds * 250),
			height: Math.max(400, maxMatchesInRound * 80 + 100)
		};
	});
	
	function handlePlayerCountChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		playerCount = parseInt(target.value);
	}
	
	function handleTournamentTypeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		tournamentType = target.value as 'single' | 'double';
	}
	
	function handleSimulationToggle() {
		showSimulation = !showSimulation;
	}
</script>

<div class="container mx-auto p-4 space-y-8">
	<div class="text-center space-y-2">
		<h1 class="text-4xl font-bold">Tournament Bracket Generator</h1>
		<p class="text-muted-foreground">Create and visualize tournament brackets using SVG rendering</p>
	</div>
	
	<!-- Configuration Panel -->
	<div class="bg-card border rounded-lg p-6">
		<h2 class="text-xl font-semibold mb-4">Configuration</h2>
		
		<div class="grid md:grid-cols-3 gap-6">
			<!-- Player Count -->
			<div class="space-y-2">
				<label for="playerCount" class="block text-sm font-medium">
					Number of Players
				</label>
				<select 
					id="playerCount"
					value={playerCount}
					onchange={handlePlayerCountChange}
					class="w-full px-3 py-2 border border-input rounded-md bg-background"
				>
					<option value="4">4 Players</option>
					<option value="8">8 Players</option>
					<option value="16">16 Players</option>
				</select>
				<p class="text-xs text-muted-foreground">Must be power of 2</p>
			</div>
			
			<!-- Tournament Type -->
			<div class="space-y-2">
				<label for="tournamentType" class="block text-sm font-medium">
					Tournament Type
				</label>
				<select 
					id="tournamentType"
					value={tournamentType}
					onchange={handleTournamentTypeChange}
					class="w-full px-3 py-2 border border-input rounded-md bg-background"
				>
					<option value="single">Single Elimination</option>
					<option value="double">Double Elimination</option>
				</select>
				<p class="text-xs text-muted-foreground">
					{tournamentType === 'single' ? 'One loss = elimination' : 'Two losses = elimination'}
				</p>
			</div>
			
			<!-- Simulation -->
			<div class="space-y-2">
				<label class="block text-sm font-medium">Simulation</label>
				<div class="flex items-center space-x-2">
					<button
						onclick={handleSimulationToggle}
						class="px-4 py-2 text-sm border rounded-md transition-colors {showSimulation ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}"
					>
						{showSimulation ? 'Hide Results' : 'Simulate Results'}
					</button>
				</div>
				<p class="text-xs text-muted-foreground">
					{showSimulation ? 'Showing simulated match results' : 'Click to simulate tournament'}
				</p>
			</div>
		</div>
	</div>
	
	<!-- Tournament Stats -->
	<div class="grid md:grid-cols-4 gap-4">
		<div class="bg-card border rounded-lg p-4">
			<div class="text-2xl font-bold text-primary">{playerCount}</div>
			<div class="text-sm text-muted-foreground">Players</div>
		</div>
		<div class="bg-card border rounded-lg p-4">
			<div class="text-2xl font-bold text-primary">{tournamentData.rounds.length}</div>
			<div class="text-sm text-muted-foreground">Rounds</div>
		</div>
		<div class="bg-card border rounded-lg p-4">
			<div class="text-2xl font-bold text-primary">{tournamentData.matches.length}</div>
			<div class="text-sm text-muted-foreground">Total Matches</div>
		</div>
		<div class="bg-card border rounded-lg p-4">
			<div class="text-2xl font-bold text-primary">
				{tournamentData.matches.filter(m => m.status === 'complete').length}
			</div>
			<div class="text-sm text-muted-foreground">Completed</div>
		</div>
	</div>
	
	<!-- Tournament Bracket -->
	<div class="bg-card border rounded-lg p-6">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-semibold">
				{tournamentType === 'single' ? 'Single' : 'Double'} Elimination Bracket
			</h2>
			<div class="text-sm text-muted-foreground">
				{bracketDimensions.width} × {bracketDimensions.height}px
			</div>
		</div>
		
		<div class="border rounded-md overflow-auto">
			<TournamentBracket 
				matches={tournamentData.matches}
				rounds={tournamentData.rounds}
				width={bracketDimensions.width}
				height={bracketDimensions.height}
			/>
		</div>
	</div>
	
	<!-- Match Details -->
	{#if showSimulation}
		<div class="bg-card border rounded-lg p-6">
			<h2 class="text-xl font-semibold mb-4">Match Results</h2>
			
			<div class="space-y-4">
				{#each tournamentData.rounds as round}
					<div>
						<h3 class="font-medium mb-2">{round.title}</h3>
						<div class="grid gap-2">
							{#each tournamentData.matches.filter(m => m.round === round.number) as match}
								<div class="flex items-center justify-between p-3 border rounded text-sm">
									<div class="flex items-center gap-4">
										<span class="font-mono text-xs bg-muted px-2 py-1 rounded">
											{match.identifier}
										</span>
										<div class="space-y-1">
											<div class="flex items-center gap-2">
												{#if match.player1}
													<span class={match.winner?.id === match.player1.id ? 'font-semibold' : ''}>
														{match.player1.name}
													</span>
													{#if match.player1.score !== undefined}
														<span class="text-muted-foreground">({match.player1.score})</span>
													{/if}
												{:else}
													<span class="text-muted-foreground italic">TBD</span>
												{/if}
											</div>
											<div class="flex items-center gap-2">
												{#if match.player2}
													<span class={match.winner?.id === match.player2.id ? 'font-semibold' : ''}>
														{match.player2.name}
													</span>
													{#if match.player2.score !== undefined}
														<span class="text-muted-foreground">({match.player2.score})</span>
													{/if}
												{:else}
													<span class="text-muted-foreground italic">TBD</span>
												{/if}
											</div>
										</div>
									</div>
									
									<div class="flex items-center gap-2">
										<span class={`px-2 py-1 rounded text-xs ${
											match.status === 'complete' ? 'bg-green-100 text-green-800' :
											match.status === 'open' ? 'bg-blue-100 text-blue-800' :
											'bg-gray-100 text-gray-800'
										}`}>
											{match.status}
										</span>
										{#if match.winner}
											<span class="text-green-600 font-medium text-xs">
												Winner: {match.winner.name}
											</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	
	<!-- How it Works -->
	<div class="bg-muted/50 border rounded-lg p-6">
		<h2 class="text-xl font-semibold mb-4">How SVG Rendering Works</h2>
		
		<div class="grid md:grid-cols-2 gap-6 text-sm">
			<div>
				<h3 class="font-medium mb-2">Key Components</h3>
				<ul class="space-y-1">
					<li><strong>SVG Container:</strong> Scalable vector graphics for crisp rendering at any size</li>
					<li><strong>Dynamic Positioning:</strong> Calculated positions based on round and match index</li>
					<li><strong>Connecting Lines:</strong> Automatically generated bracket lines using SVG paths</li>
					<li><strong>Interactive Elements:</strong> Match states and winner highlighting</li>
				</ul>
			</div>
			
			<div>
				<h3 class="font-medium mb-2">Advantages over HTML/CSS</h3>
				<ul class="space-y-1">
					<li><strong>Precision:</strong> Exact positioning and alignment of elements</li>
					<li><strong>Scalability:</strong> Vector graphics scale perfectly at any zoom level</li>
					<li><strong>Performance:</strong> Efficient rendering of complex bracket structures</li>
					<li><strong>Printability:</strong> High-quality output for print media</li>
				</ul>
			</div>
		</div>
	</div>
</div>
