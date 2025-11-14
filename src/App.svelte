<script lang="ts">
  import { countMessagesPerUser, countTotalMessages, getMostCommonWords, getMostPingedUser, getMostActiveDays, getAvgMsgsPerHour } from './lib/analyzer';
  import Chart from './lib/Chart.svelte';

  const totalMessageCount = countTotalMessages();
  const userMessageCounts = countMessagesPerUser();
  const mostCommonWords = getMostCommonWords();
  const mostPingedUsers = getMostPingedUser();
  const mostActiveDays = getMostActiveDays();
  const avgMsgsPerHour = getAvgMsgsPerHour();

  const sortedUserMessageCounts = Object.entries(userMessageCounts).sort(([, countA], [, countB]) => countB - countA);

</script>

<main>
  <div id = "message-count" class = "stat-card">
    <h2>Total Messages: {totalMessageCount}</h2>
    <ol>
      {#each sortedUserMessageCounts as [user, count]}
        <li><strong>{user}</strong>: <span>{count}</span></li>
      {/each}
    </ol>
  </div>

  <div id = "most-pinged-users" class = "stat-card">
    <h2>Most Pinged Users</h2>
    <ol>
      {#each mostPingedUsers as [user, count]}
        <li><strong>{user}</strong>: <span>{count}</span></li>
      {/each}
    </ol>
  </div>

  <div id = "most-common-words" class = "stat-card">
    <h2>Most Common Words</h2>
    <ol>
      {#each mostCommonWords as [word, count]}
        <li><strong>{word}</strong>: <span>{count}</span></li>
      {/each}
    </ol>
  </div>

  <div id = "most-active-days" class = "stat-card">
    <h2>Most Active Days</h2>
    <ol>
      {#each mostActiveDays as [day, count]}
        <li><strong>{day}</strong>: <span>{count}</span></li>
      {/each}
    </ol>
  </div>

  <div id="avg-msgs-per-hour" class="stat-card">
    <h2>Average Messages per Hour</h2>
    <Chart data={avgMsgsPerHour} />
  </div>
</main>
