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

/**
 * Generate a single elimination tournament bracket
 * @param players Array of players (must be power of 2)
 * @returns Array of matches for the tournament
 */
export function generateSingleEliminationBracket(players: Player[]): {
	matches: Match[];
	rounds: { number: number; title: string }[];
} {
	if (!isPowerOfTwo(players.length)) {
		throw new Error('Number of players must be a power of 2 for single elimination');
	}

	const matches: Match[] = [];
	const numRounds = Math.log2(players.length);
	const rounds: { number: number; title: string }[] = [];

	// Generate round titles
	const roundTitles = generateRoundTitles(numRounds);
	for (let i = 1; i <= numRounds; i++) {
		rounds.push({ number: i, title: roundTitles[i - 1] });
	}

	// Seed players (1 vs 8, 2 vs 7, 3 vs 6, 4 vs 5 for 8 players)
	const seededPairs = seedPlayers(players);

	let matchId = 1;
	let currentRoundMatches = seededPairs.map((pair, index) => {
		const match: Match = {
			id: matchId.toString(),
			identifier: matchId.toString(),
			player1: pair[0],
			player2: pair[1],
			status: 'pending',
			round: 1,
			position: index
		};
		matchId++;
		return match;
	});

	matches.push(...currentRoundMatches);

	// Generate subsequent rounds
	for (let round = 2; round <= numRounds; round++) {
		const nextRoundMatches: Match[] = [];
		
		for (let i = 0; i < currentRoundMatches.length; i += 2) {
			const match: Match = {
				id: matchId.toString(),
				identifier: matchId.toString(),
				player1: null, // Will be filled by winners
				player2: null,
				status: 'pending',
				round,
				position: Math.floor(i / 2)
			};
			matchId++;
			nextRoundMatches.push(match);
		}
		
		matches.push(...nextRoundMatches);
		currentRoundMatches = nextRoundMatches;
	}

	return { matches, rounds };
}

/**
 * Generate a double elimination tournament bracket
 * @param players Array of players (must be power of 2)
 * @returns Object with winners bracket, losers bracket matches and rounds
 */
export function generateDoubleEliminationBracket(players: Player[]): {
	matches: Match[];
	rounds: { number: number; title: string }[];
} {
	if (!isPowerOfTwo(players.length)) {
		throw new Error('Number of players must be a power of 2 for double elimination');
	}

	const matches: Match[] = [];
	const numRounds = Math.log2(players.length);
	
	// Generate winners bracket
	const winnersResult = generateSingleEliminationBracket(players);
	
	// Add winners bracket matches with 'W' prefix
	winnersResult.matches.forEach(match => {
		match.identifier = `W${match.id}`;
		matches.push(match);
	});

	// Generate losers bracket (simplified version)
	const seededPairs = seedPlayers(players);
	let matchId = winnersResult.matches.length + 1;
	let losersPosition = Math.ceil(seededPairs.length * 1.5); // Position below winners bracket

	// Losers Round 1: Direct eliminations from Winners Round 1
	for (let i = 0; i < seededPairs.length; i += 2) {
		const match: Match = {
			id: `L${matchId}`,
			identifier: `L${matchId}`,
			player1: null, // Losers from winners bracket
			player2: null,
			status: 'pending',
			round: 1,
			position: losersPosition++
		};
		matchId++;
		matches.push(match);
	}

	const rounds = [
		...winnersResult.rounds,
		{ number: numRounds + 1, title: 'Grand Final' }
	];

	return { matches, rounds };
}

/**
 * Seed players for tournament (1 vs last, 2 vs second-to-last, etc.)
 */
function seedPlayers(players: Player[]): [Player, Player][] {
	const sortedPlayers = [...players].sort((a, b) => (a.seed || 0) - (b.seed || 0));
	const pairs: [Player, Player][] = [];
	
	for (let i = 0; i < sortedPlayers.length / 2; i++) {
		pairs.push([
			sortedPlayers[i], 
			sortedPlayers[sortedPlayers.length - 1 - i]
		]);
	}
	
	return pairs;
}

/**
 * Generate round titles based on number of rounds
 */
function generateRoundTitles(numRounds: number): string[] {
	const titles: string[] = [];
	
	for (let i = numRounds; i >= 1; i--) {
		if (i === 1) {
			titles.push('Finals');
		} else if (i === 2) {
			titles.push('Semifinals');
		} else if (i === 3) {
			titles.push('Quarterfinals');
		} else {
			titles.push(`Round ${numRounds - i + 1}`);
		}
	}
	
	return titles;
}

/**
 * Check if a number is a power of 2
 */
function isPowerOfTwo(n: number): boolean {
	return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Simulate match results for testing
 */
export function simulateMatches(matches: Match[], players: Player[]): Match[] {
	return matches.map(match => {
		if (match.round === 1 && match.player1 && match.player2) {
			// Simulate first round with higher seed usually winning
			const winner = Math.random() > 0.3 ? 
				(match.player1.seed! < match.player2.seed! ? match.player1 : match.player2) :
				(match.player1.seed! > match.player2.seed! ? match.player1 : match.player2);
			
			return {
				...match,
				player1: { ...match.player1, score: winner.id === match.player1.id ? 2 : 1 },
				player2: { ...match.player2, score: winner.id === match.player2.id ? 2 : 1 },
				winner,
				status: 'complete' as const
			};
		}
		return match;
	});
}

/**
 * Create sample players for testing
 */
export function createSamplePlayers(count: number): Player[] {
	const names = [
		'Mario', 'Luigi', 'Peach', 'Bowser', 'Yoshi', 'Koopa', 'Toad', 'DK',
		'Wario', 'Waluigi', 'Rosalina', 'Bowser Jr.', 'Shy Guy', 'Lakitu', 'Piranha Plant', 'King Boo'
	];
	
	return Array.from({ length: count }, (_, i) => ({
		id: `p${i + 1}`,
		name: names[i] || `Player ${i + 1}`,
		seed: i + 1
	}));
}
