<script lang="ts">
  import { countMsgsPerUser, countTotalMsgs, getMostCommonWords, getMostPingedUser, getMostActiveDays, getAvgMsgsPerHour, getMostCommonEmojis, getAvgWordsPerMsg, getAvgWordsPerMsgPerUser, getTotalWordsPerUser } from './lib/analyzer';
  import Chart from './lib/Chart.svelte';

  const totalMsgCount = countTotalMsgs();
  const userMsgCounts = countMsgsPerUser();
  const mostCommonWords = getMostCommonWords();
  const mostPingedUsers = getMostPingedUser();
  const mostActiveDays = getMostActiveDays();
  const avgMsgsPerHour = getAvgMsgsPerHour();
  const mostCommonEmojis = getMostCommonEmojis();
  const avgWordsPerMsg = getAvgWordsPerMsg();
  const avgWordsPerMsgPerUser = getAvgWordsPerMsgPerUser();
  const totalWordsPerUser = getTotalWordsPerUser();
</script>

<main>

  <div id = "message-count" class = "stat-card">
    <h2>Total Messages: {totalMsgCount}</h2>
    <ol>
      {#each userMsgCounts as [user, count]}
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

  <div id="avg-words-per-msg" class="stat-card">
    <h2>Avg Word Count per Msg: {avgWordsPerMsg.toFixed(2)}</h2>
    <ol>
      {#each avgWordsPerMsgPerUser as [user, avg]}
        <li><strong>{user}</strong>: <span>{avg.toFixed(3)}</span></li>
      {/each}
    </ol>
  </div>

  <div id="total-words-per-user" class="stat-card">
    <h2>Total Words per User</h2>
    <ol>
      {#each totalWordsPerUser as [user, total]}
        <li><strong>{user}</strong>: <span>{total}</span></li>
      {/each}
    </ol>

  </div>

  <div id="most-common-emojis" class="stat-card">
    <h2>Most Common Emojis</h2>
    <ol>
      {#each mostCommonEmojis as [emoji, count]}
        <li><strong>{emoji}</strong>: <span>{count}</span></li>
      {/each}
    </ol>
  </div>

</main>
