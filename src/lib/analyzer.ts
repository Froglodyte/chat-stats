//change the file path here
import chatLogs from '../../src/chat_logs/wohitoh.txt?raw';

const  msgRegex = /^(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}) - (.*?): (.*)/;
const sysMsgRegex = /Msgs and calls are end-to-end encrypted|This message was deleted|created group|added|changed the group name|changed this group's icon|left|pinned a  msg|You're now an admin|This  msg was deleted|Missed voice call|Missed video call/;

const dataSize = 7;

function getMsgs(): { date: string, sender: string,  msg: string }[] {
  const lines = chatLogs.split('\n');
  const  msgs: { date: string, sender: string,  msg: string }[] = [];

  for (const line of lines) {
    const match = line.match( msgRegex);
    if (match && !sysMsgRegex.test(line)) {
      if (match[2] === 'Meta AI') continue;
      let cleanedMsg = match[3].replace(/<[^>]*>/g, '');
      if (cleanedMsg.trim() === '') continue;
       msgs.push({ date: match[1], sender: match[2],  msg: cleanedMsg });
    }
  }

  return  msgs;
}

function getFirstName(sender: string): string | null {
  if (sender[0] == '+') return null;
  return sender.split(' ')[0];
}

export function countMsgsPerUser(): [string, number][] {
  const  msgs = getMsgs();
  const userMsgCounts: { [user: string]: number } = {};

  for (const { sender } of  msgs) {
    const firstName = getFirstName(sender);
    if (firstName) userMsgCounts[firstName] = (userMsgCounts[firstName] || 0) + 1;
  }

  return Object.entries(userMsgCounts).sort((a, b) => b[1] - a[1]).slice(0, dataSize);
}

export function countTotalMsgs(): number {
  const userMsgCounts = countMsgsPerUser();
  return userMsgCounts.reduce((sum, [, count]) => sum + count, 0);
}

export function getMostCommonWords(): [string, number][] {
  const  msgs = getMsgs();

  for (const  msgObj of  msgs) {
     msgObj. msg =  msgObj. msg.replace(/<[^>]*>|@\u2068(.*?)\u2069/g, '');
  }
  const wordCounts: { [word: string]: number } = {};

  for (const {  msg } of  msgs) {
    const words =  msg.toLowerCase().split(/\s+/);
    for (const word of words)
      if (word && !/^\d+$/.test(word) && word.length > 4)
        wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
  return sortedWords.slice(0, dataSize);
}

export function getMostPingedUser(): [string, number][] {
  const  msgs = getMsgs();
  const pingCounts: { [user: string]: number } = {};

  for (const {  msg } of  msgs) {
    const pings =  msg.match(/@\u2068(.*?)\u2069/g);
    if (pings) {
      for (const ping of pings) {
        const user = getFirstName(ping.substring(2, ping.length - 1));
        pingCounts[user!] = (pingCounts[user!] || 0) + 1;
      }
    }
  }

  const sortedPings = Object.entries(pingCounts).sort((a, b) => b[1] - a[1]);
  return sortedPings.slice(0, dataSize);
}

export function getMostActiveDays(): [string, number][] {
  const  msgs = getMsgs();
  const dayMsgCounts: { [day: string]: number } = {};

  for (const { date } of  msgs) {
    const day = date.split(',')[0];
    dayMsgCounts[day] = (dayMsgCounts[day] || 0) + 1;
  }

  const sortedDays = Object.entries(dayMsgCounts).sort((a, b) => b[1] - a[1]);
  return sortedDays.slice(0, 8);
}

export function getAvgMsgsPerHour(): number[] {
  const  msgs = getMsgs();
  const hourMsgCounts: { [hour: string]: number } = {};
  const daySet = new Set<string>();

  for (const { date } of  msgs) {
    const [day, time] = date.split(', ');
    daySet.add(day);
    const hour = time.split(':')[0];
    hourMsgCounts[hour] = (hourMsgCounts[hour] || 0) + 1;
  }

  const numberOfDays = daySet.size;
  const avgMsgsPerHour = Array(24).fill(0);

  for (const hour in hourMsgCounts)
    avgMsgsPerHour[parseInt(hour)] = hourMsgCounts[hour] / numberOfDays;
  

  return avgMsgsPerHour;
}

export function getMostCommonEmojis(): [string, number][] {
  const  msgs = getMsgs();
  const emojiCounts: { [emoji: string]: number } = {};

  for (const {  msg } of  msgs) {
    const emojis =  msg.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu);
    if (emojis)
      for (const emoji of emojis)
        emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
  }

  const sortedEmojis = Object.entries(emojiCounts).sort((a, b) => b[1] - a[1]);
  return sortedEmojis.slice(0, dataSize);
}

export function getAvgWordsPerMsg(): number {
  const  msgs = getMsgs();
  let totalWords = 0;

  for (const {  msg } of  msgs) {
    const words =  msg.split(/\s+/);
    totalWords += words.length;
  }

  return totalWords /  msgs.length;
}

export function getAvgWordsPerMsgPerUser(): [string, number][] {
  const  msgs = getMsgs();
  const userWordCounts: { [user: string]: { totalWords: number,  msgCount: number } } = {};

  for (const { sender,  msg } of  msgs) {
    const firstName = getFirstName(sender);
    if (firstName) {
      if (!userWordCounts[firstName])
        userWordCounts[firstName] = { totalWords: 0,  msgCount: 0 };

      const words =  msg.split(/\s+/);
      userWordCounts[firstName].totalWords += words.length;
      userWordCounts[firstName]. msgCount++;
    }
  }

  const avgWordsPerUser: [string, number][] = [];
  for (const user in userWordCounts)
    avgWordsPerUser.push([user, userWordCounts[user].totalWords / userWordCounts[user]. msgCount]);


  return avgWordsPerUser.sort((a, b) => b[1] - a[1]).slice(0, dataSize);
}

export function getTotalWordsPerUser(): [string, number][] {
  const  msgs = getMsgs();
  const userWordCounts: { [user: string]: number } = {};

  for (const { sender,  msg } of  msgs) {
    const firstName = getFirstName(sender);
    if (firstName) {
      const words =  msg.split(/\s+/);
      userWordCounts[firstName] = (userWordCounts[firstName] || 0) + words.length;
    }
  }

  const totalWordsPerUser = Object.entries(userWordCounts);
  return totalWordsPerUser.sort((a, b) => b[1] - a[1]).slice(0, dataSize);
}