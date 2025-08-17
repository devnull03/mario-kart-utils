<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/logo.png';
	  import { ModeWatcher } from "mode-watcher";
	import ModeSwitch from '$lib/components/ui/ModeSwitch.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />


<div class="fixed top-4 right-4">
	<ModeSwitch />
</div>

{@render children?.()}
