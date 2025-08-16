<script lang="ts">
	import { cn } from '$lib/utils';
	
	interface Player {
		id: string;
		name: string;
		seed?: number;
		score?: number;
	}
	
	interface Match {
		id: string;
		identifier: string;
		player1: Player | null;
		player2: Player | null;
		winner?: Player;
		status: 'pending' | 'open' | 'complete';
		round: number;
		position: number;
	}
	
	interface Props {
		matches: Match[];
		rounds: { number: number; title: string }[];
		width?: number;
		height?: number;
		class?: string;
	}
	
	let { matches, rounds, width = 800, height = 400, class: className }: Props = $props();
	
	// Layout constants - similar to Challonge's structure
	const MATCH_WIDTH = 200;
	const MATCH_HEIGHT = 45;
	const ROUND_SPACING = 244;
	const MATCH_SPACING = 54; // Vertical spacing between matches
	const ROUND_LABEL_HEIGHT = 25;
	
	// Calculate positions for matches based on round and position
	function getMatchPosition(match: Match) {
		const x = (match.round - 1) * ROUND_SPACING;
		const y = match.position * (MATCH_HEIGHT + MATCH_SPACING) + 35; // 35px offset for round labels
		return { x, y };
	}
	
	// Generate bracket lines connecting matches
	function generateBracketLines(matches: Match[]) {
		const lines: { d: string; x: number; y: number }[] = [];
		
		// Group matches by round
		const matchesByRound = matches.reduce((acc, match) => {
			if (!acc[match.round]) acc[match.round] = [];
			acc[match.round].push(match);
			return acc;
		}, {} as Record<number, Match[]>);
		
		// Generate connecting lines between rounds
		Object.keys(matchesByRound).forEach(roundKey => {
			const round = parseInt(roundKey);
			const currentRoundMatches = matchesByRound[round];
			const nextRoundMatches = matchesByRound[round + 1];
			
			if (nextRoundMatches) {
				// Connect pairs of matches from current round to next round
				for (let i = 0; i < currentRoundMatches.length; i += 2) {
					const match1 = currentRoundMatches[i];
					const match2 = currentRoundMatches[i + 1];
					const nextMatch = nextRoundMatches[Math.floor(i / 2)];
					
					if (match1 && match2 && nextMatch) {
						const match1Pos = getMatchPosition(match1);
						const match2Pos = getMatchPosition(match2);
						const nextMatchPos = getMatchPosition(nextMatch);
						
						// Create bracket line path
						const startX = match1Pos.x + MATCH_WIDTH + 28; // 28 = match wrapper padding
						const midX = startX + 8;
						const endX = nextMatchPos.x + 26; // 26 = match left padding
						
						const match1Y = match1Pos.y + MATCH_HEIGHT / 2;
						const match2Y = match2Pos.y + MATCH_HEIGHT / 2;
						const nextMatchY = nextMatchPos.y + MATCH_HEIGHT / 2;
						
						// Line from match1 to connection point
						lines.push({
							d: `M ${startX} ${match1Y} L ${midX} ${match1Y} L ${midX} ${nextMatchY} L ${endX} ${nextMatchY}`,
							x: 0,
							y: 0
						});
						
						// Line from match2 to connection point
						lines.push({
							d: `M ${startX} ${match2Y} L ${midX} ${match2Y}`,
							x: 0,
							y: 0
						});
					}
				}
			}
		});
		
		return lines;
	}
	
	const bracketLines = $derived(generateBracketLines(matches));
</script>

<div class={cn("tournament-bracket relative overflow-auto", className)}>
	<div class="tournament-bracket--scrollable" style="width: {width}px; height: {height}px;">
		<svg 
			class="bracket-svg" 
			width={width} 
			height={height} 
			viewBox="0 0 {width} {height}"
		>
			<g class="parent">
				<!-- Bracket connecting lines -->
				<g class="bracket-lines">
					{#each bracketLines as line}
						<path 
							d={line.d} 
							class="bracket-line stroke-border stroke-1 fill-none"
						/>
					{/each}
				</g>
				
				<!-- Matches -->
				<g class="matches">
					{#each matches as match}
						{@const position = getMatchPosition(match)}
						<g 
							transform="translate({position.x} {position.y})" 
							class={cn("match", {
								"-pending": match.status === 'pending',
								"-open": match.status === 'open', 
								"-complete": match.status === 'complete'
							})}
							data-match-id={match.id}
						>
							<!-- Match identifier -->
							<text 
								x="11" 
								y="31" 
								width="24" 
								height="10" 
								text-anchor="middle" 
								class="match--identifier fill-muted-foreground text-xs"
							>
								{match.identifier}
							</text>
							
							<!-- Match wrapper background -->
							<rect 
								x="24" 
								y="3" 
								width={MATCH_WIDTH + 4} 
								height={MATCH_HEIGHT + 4} 
								rx="3" 
								ry="3" 
								class="match--wrapper-background fill-background stroke-border stroke-1"
							/>
							
							<!-- Match base background -->
							<rect 
								x="26" 
								y="5" 
								width={MATCH_WIDTH} 
								height={MATCH_HEIGHT} 
								rx="3" 
								ry="3" 
								class="match--base-background fill-card"
							/>
							
							<!-- Player 1 -->
							{#if match.player1}
								<g class="match--player" data-participant-id={match.player1.id}>
									<!-- Player background -->
									<rect 
										x="50" 
										y="5" 
										width="147" 
										height="22" 
										class={cn("match--player-background fill-card", {
											"-winner": match.winner?.id === match.player1.id
										})}
									/>
									
									<!-- Seed background -->
									<rect 
										x="26" 
										y="5" 
										width="24" 
										height="22" 
										class="match--seed-background fill-muted"
									/>
									
									<!-- Seed number -->
									<text 
										x="38" 
										y="19" 
										text-anchor="middle" 
										class="match--seed fill-muted-foreground text-xs font-medium"
									>
										{match.player1.seed || ''}
									</text>
									
									<!-- Player name -->
									<text 
										x="55" 
										y="19" 
										text-anchor="start" 
										class={cn("match--player-name fill-foreground text-xs font-medium", {
											"-winner": match.winner?.id === match.player1.id
										})}
									>
										{match.player1.name}
									</text>
									
									<!-- Score (if match is complete) -->
									{#if match.status === 'complete' && match.player1.score !== undefined}
										<rect 
											x="197" 
											y="5" 
											width="29" 
											height="22" 
											class={cn("match--player-score-background fill-muted", {
												"-winner": match.winner?.id === match.player1.id
											})}
										/>
										<text 
											x="211" 
											y="19" 
											text-anchor="middle" 
											class={cn("match--player-score fill-foreground text-xs font-bold", {
												"-winner": match.winner?.id === match.player1.id
											})}
										>
											{match.player1.score}
										</text>
									{/if}
								</g>
							{:else}
								<!-- Empty player slot -->
								<rect 
									x="50" 
									y="5" 
									width="147" 
									height="22" 
									class="match--player-background fill-muted/20"
								/>
								<text 
									x="55" 
									y="19" 
									text-anchor="start" 
									class="match--player-name fill-muted-foreground text-xs italic"
								>
									TBD
								</text>
							{/if}
							
							<!-- Player separator line -->
							<line 
								x1="26" 
								y1="27.5" 
								x2="226" 
								y2="27.5" 
								class="match--player-divider stroke-border stroke-1"
							/>
							
							<!-- Player 2 -->
							{#if match.player2}
								<g class="match--player" data-participant-id={match.player2.id}>
									<!-- Player background -->
									<rect 
										x="50" 
										y="28" 
										width="147" 
										height="22" 
										class={cn("match--player-background fill-card", {
											"-winner": match.winner?.id === match.player2.id
										})}
									/>
									
									<!-- Seed background -->
									<rect 
										x="26" 
										y="28" 
										width="24" 
										height="22" 
										class="match--seed-background fill-muted"
									/>
									
									<!-- Seed number -->
									<text 
										x="38" 
										y="42" 
										text-anchor="middle" 
										class="match--seed fill-muted-foreground text-xs font-medium"
									>
										{match.player2.seed || ''}
									</text>
									
									<!-- Player name -->
									<text 
										x="55" 
										y="42" 
										text-anchor="start" 
										class={cn("match--player-name fill-foreground text-xs font-medium", {
											"-winner": match.winner?.id === match.player2.id
										})}
									>
										{match.player2.name}
									</text>
									
									<!-- Score (if match is complete) -->
									{#if match.status === 'complete' && match.player2.score !== undefined}
										<rect 
											x="197" 
											y="28" 
											width="29" 
											height="22" 
											class={cn("match--player-score-background fill-muted", {
												"-winner": match.winner?.id === match.player2.id
											})}
										/>
										<text 
											x="211" 
											y="42" 
											text-anchor="middle" 
											class={cn("match--player-score fill-foreground text-xs font-bold", {
												"-winner": match.winner?.id === match.player2.id
											})}
										>
											{match.player2.score}
										</text>
									{/if}
								</g>
							{:else}
								<!-- Empty player slot -->
								<rect 
									x="50" 
									y="28" 
									width="147" 
									height="22" 
									class="match--player-background fill-muted/20"
								/>
								<text 
									x="55" 
									y="42" 
									text-anchor="start" 
									class="match--player-name fill-muted-foreground text-xs italic"
								>
									TBD
								</text>
							{/if}
						</g>
					{/each}
				</g>
				
				<!-- Round labels -->
				<g class="rounds">
					{#each rounds as round, index}
						<g class="round" transform="translate({index * ROUND_SPACING}, 0)">
							<rect 
								width={ROUND_SPACING - 1} 
								height={ROUND_LABEL_HEIGHT} 
								class="fill-card stroke-border stroke-1"
							/>
							<text 
								x={ROUND_SPACING / 2} 
								y="17" 
								text-anchor="middle" 
								class="fill-foreground text-sm font-semibold"
							>
								{round.title}
							</text>
						</g>
					{/each}
				</g>
			</g>
		</svg>
	</div>
</div>

<style>

	@reference '../../app.css';

	.tournament-bracket {
		font-family: system-ui, -apple-system, sans-serif;
	}
	
	.bracket-line {
		@apply stroke-border stroke-2 fill-none;
	}
	
	.match.-pending .match--base-background {
		@apply fill-yellow-50 stroke-yellow-200;
	}
	
	.match.-open .match--base-background {
		@apply fill-green-50 stroke-green-200;
	}
	
	.match.-complete .match--base-background {
		@apply fill-blue-50 stroke-blue-200;
	}
	
	.match--player-name.-winner {
		@apply fill-green-700 font-bold;
	}
	
	.match--player-score-background.-winner {
		@apply fill-green-100;
	}
	
	.match--player-score.-winner {
		@apply fill-green-800 font-bold;
	}
</style>
