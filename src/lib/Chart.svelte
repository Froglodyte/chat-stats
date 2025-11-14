<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let data: number[];

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 24 }, (_, i) => i.toString()),
          datasets: [
            {
              label: 'Average Messages per Hour',
              data: data,
              borderColor: '#F97068',
              backgroundColor: 'rgba(249, 112, 104, 0.2)',
              pointRadius: 0,
              borderWidth: 2,
              fill: true
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  });
</script>

<canvas bind:this={canvas} width="660" height="370"></canvas>
