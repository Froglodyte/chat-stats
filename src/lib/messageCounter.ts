import chatLogs from '../../src/chat_logs/fcs.txt?raw';

function getFirstName(sender: string): string | null {
  if (/^[\d\s+]+$/.test(sender)) {
    return null;
  }
  return sender.split(' ')[0];
}

export function countMessagesPerUser(): { [user: string]: number } {
  const lines = chatLogs.split('\n');
  const userMessageCounts: { [user: string]: number } = {};
  const messageRegex = /^(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}) - (.*?): (.*)/;
  const sysMessageRegex = /Messages and calls are end-to-end encrypted|created group|added|changed the group name|changed this group's icon|left|pinned a message|You're now an admin|This message was deleted|Missed voice call|Missed video call/;

  for (const line of lines) {
    const match = line.match(messageRegex);
    if (match) {
      const sender = match[2];
      const firstName = getFirstName(sender);
      if (firstName) {
        userMessageCounts[firstName] = (userMessageCounts[firstName] || 0) + 1;
      }
    } else if (sysMessageRegex.test(line)) continue;
  }

  return userMessageCounts;
}

export function countTotalMessages(): number {
  const userMessageCounts = countMessagesPerUser();
  return Object.values(userMessageCounts).reduce((sum, count) => sum + count, 0);
}
