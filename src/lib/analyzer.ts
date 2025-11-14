import chatLogs from '../../src/chat_logs/fcs.txt?raw';

const messageRegex = /^(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}) - (.*?): (.*)/;
const sysMessageRegex = /Messages and calls are end-to-end encrypted|created group|added|changed the group name|changed this group's icon|left|pinned a message|You're now an admin|This message was deleted|Missed voice call|Missed video call/;

function getMessages(): { date: string, sender: string, message: string }[] {
  const lines = chatLogs.split('\n');
  const messages: { date: string, sender: string, message: string }[] = [];

  for (const line of lines) {
    const match = line.match(messageRegex);
    if (match && !sysMessageRegex.test(line)) {
      let cleanedMessage = match[3].replace(/<[^>]*>/g, '');
      if (cleanedMessage.trim() === '') continue;
      messages.push({ date: match[1], sender: match[2], message: cleanedMessage });
    }
  }

  return messages;
}

function getFirstName(sender: string): string | null {
  if (/^\+?\d[\d\s-]{8,}\d$/.test(sender)) return null;
  return sender.split(' ')[0];
}

export function countMessagesPerUser(): { [user: string]: number } {
  const messages = getMessages();
  const userMessageCounts: { [user: string]: number } = {};

  for (const { sender } of messages) {
    const firstName = getFirstName(sender);
    if (firstName) userMessageCounts[firstName] = (userMessageCounts[firstName] || 0) + 1;
  }

  return userMessageCounts;
}

export function countTotalMessages(): number {
  const userMessageCounts = countMessagesPerUser();
  return Object.values(userMessageCounts).reduce((sum, count) => sum + count, 0);
}

export function getMostCommonWords(): [string, number][] {
  const messages = getMessages();

  for (const messageObj of messages) {
    messageObj.message = messageObj.message.replace(/<[^>]*>|@\u2068(.*?)\u2069/g, '');
  }
  const wordCounts: { [word: string]: number } = {};

  for (const { message } of messages) {
    const words = message.toLowerCase().split(/\s+/);
    for (const word of words)
      if (word && !/^\d+$/.test(word) && word.length > 4)
        wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
  return sortedWords.slice(0, 12);
}

export function getMostPingedUser(): [string, number][] {
  const messages = getMessages();
  const pingCounts: { [user: string]: number } = {};

  for (const { message } of messages) {
    const pings = message.match(/@\u2068(.*?)\u2069/g);
    if (pings) {
      for (const ping of pings) {
        const user = getFirstName(ping.substring(2, ping.length - 1));
        pingCounts[user!] = (pingCounts[user!] || 0) + 1;
      }
    }
  }

  const sortedPings = Object.entries(pingCounts).sort((a, b) => b[1] - a[1]);
  return sortedPings.slice(0, 12);
}

export function getMostActiveDays(): [string, number][] {
  const messages = getMessages();
  const dayMessageCounts: { [day: string]: number } = {};

  for (const { date } of messages) {
    const day = date.split(',')[0];
    dayMessageCounts[day] = (dayMessageCounts[day] || 0) + 1;
  }

  const sortedDays = Object.entries(dayMessageCounts).sort((a, b) => b[1] - a[1]);
  return sortedDays.slice(0, 8);
}

export function getAvgMsgsPerHour(): number[] {
  const messages = getMessages();
  const hourMessageCounts: { [hour: string]: number } = {};
  const daySet = new Set<string>();

  for (const { date } of messages) {
    const [day, time] = date.split(', ');
    daySet.add(day);
    const hour = time.split(':')[0];
    hourMessageCounts[hour] = (hourMessageCounts[hour] || 0) + 1;
  }

  const numberOfDays = daySet.size;
  const avgMsgsPerHour = Array(24).fill(0);

  for (const hour in hourMessageCounts) {
    avgMsgsPerHour[parseInt(hour)] = hourMessageCounts[hour] / numberOfDays;
  }

  return avgMsgsPerHour;
}