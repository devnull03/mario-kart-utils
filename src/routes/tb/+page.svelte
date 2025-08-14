<script lang="ts">
	import mermaid from 'mermaid';
	import { onMount } from 'svelte';

	onMount(() => {
		mermaid.initialize({ startOnLoad: true });
	});



</script>

	<pre class:mermaid>
flowchart LR
  %% Stage 0 — Pools (4 heats of 4)
  subgraph Pools["Initial Pools"]
    direction TB
    H1[Heat A: a b c d]
    H2[Heat B: e f g h]
    H3[Heat C: i j k l]
    H4[Heat D: m n o p]
  end

  %% Winners Bracket
  subgraph Winners_Bracket["🏆 Winners Bracket"]
    direction LR
    %% Pool Advancement
    WB1[WB Pool A: a,b]
    WB2[WB Pool B: e,f]
    WB3[WB Pool C: i,j]
    WB4[WB Pool D: m,n]
    
    %% Winners QF (two 4P matches)
    WQF1[WB-QF1: a b e f]
    WQF2[WB-QF2: i j m n]
    
    %% Winners SF (one 4P match)
    WSF[WB-SF: top2 WQF1 + top2 WQF2]
    
    %% Internal Winners Flow
    WB1 --> WQF1
    WB2 --> WQF1
    WB3 --> WQF2
    WB4 --> WQF2
    WQF1 --> WSF
    WQF2 --> WSF
  end

  %% Losers Bracket - Complete subgraph positioned below
  subgraph Losers_Bracket["💀 Losers Bracket"]
    direction LR
    
    %% Initial Losers from Pools
    LBA[LB Pool A: c,d]
    LBB[LB Pool B: g,h] 
    LBC[LB Pool C: k,l]
    LBD[LB Pool D: o,p]
    
    %% Losers R1 (two 4P matches)
    LR1A[LB-R1A: c d g h]
    LR1B[LB-R1B: k l o p]
    
    %% Losers R2 (combines LR1 winners + WQF losers)
    LR2A[LB-R2A: top2 LR1A + bottom2 WQF1]
    LR2B[LB-R2B: top2 LR1B + bottom2 WQF2]
    
    %% Losers Final (makes 2 finalists for GF)
    LBF[LB-Final: top1 LR2A + top1 LR2B + bottom2 WSF]
    
    %% Internal Losers Flow
    LBA --> LR1A
    LBB --> LR1A
    LBC --> LR1B
    LBD --> LR1B
    LR1A --> LR2A
    LR1B --> LR2B
    LR2A --> LBF
    LR2B --> LBF
  end

  %% Grand Final
  subgraph Grand_Final["🏁 Championship"]
    GF[Grand Final: top2 WSF + top2 LBF]
  end

  %% Pool Placement Connections
  H1 -- Top2 --> WB1
  H2 -- Top2 --> WB2
  H3 -- Top2 --> WB3
  H4 -- Top2 --> WB4
  H1 -- Bottom2 --> LBA
  H2 -- Bottom2 --> LBB
  H3 -- Bottom2 --> LBC
  H4 -- Bottom2 --> LBD

  %% Winners to Losers Dropdowns
  WQF1 -- Bottom2 --> LR2A
  WQF2 -- Bottom2 --> LR2B
  WSF -- Bottom2 --> LBF

  %% Grand Final Qualifiers
  WSF -- Top2 --> GF
  LBF -- Top2 --> GF

  %% Styling
  classDef winners fill:#ffd700,stroke:#b8860b,stroke-width:2px,color:#000
  classDef losers fill:#ffcccc,stroke:#cc0000,stroke-width:2px,color:#000
  classDef pools fill:#e8f4fd,stroke:#4dabf7,stroke-width:2px
  classDef final fill:#ff6b6b,stroke:#e55656,stroke-width:3px,color:#fff

  class WB1,WB2,WB3,WB4,WQF1,WQF2,WSF winners
  class LBA,LBB,LBC,LBD,LR1A,LR1B,LR2A,LR2B,LBF losers
  class H1,H2,H3,H4 pools
  class GF final

</pre>
