<script lang="ts">
  import { countMessagesPerUser, countTotalMessages } from './lib/messageCounter';

  const totalMessageCount = countTotalMessages();
  const userMessageCounts = countMessagesPerUser();

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
</main>
