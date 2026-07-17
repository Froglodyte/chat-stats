//change the file path here
import chatLogs from '../../src/chat_logs/extc.txt?raw';

const msgRegex = /^(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}) - (.*?): (.*)/;
const sysMsgRegex = /Msgs and calls are end-to-end encrypted|This message was deleted|created group|added|changed the group name|changed this group's icon|left|pinned a msg|You're now an admin|This msg was deleted|Missed voice call|Missed video call/;

const dataSize = 20;

function getFirstName(sender: string): string | null {
  if (sender[0] == '+') return null;
  return sender.split(' ')[0];
}

interface AnalysisResults {
  userMsgCounts: [string, number][];
  mostCommonWords: [string, number][];
  mostPingedUsers: [string, number][];
  mostActiveDays: [string, number][];
  avgMsgsPerHour: number[];
  avgWordsPerMsg: number;
  avgWordsPerMsgPerUser: [string, number][];
  totalWordsPerUser: [string, number][];
  totalMediaPerUser: [string, number][];
}

let cachedResults: AnalysisResults | null = null;

function runAnalysis(): AnalysisResults {
  if (cachedResults) return cachedResults;

  const lines = chatLogs.split('\n');
  
  const userMsgCounts: { [user: string]: number } = {};
  const wordCounts: { [word: string]: number } = {};
  const pingCounts: { [user: string]: number } = {};
  const dayMsgCounts: { [day: string]: number } = {};
  const hourMsgCounts: { [hour: string]: number } = {};
  const daySet = new Set<string>();
  let totalWords = 0;
  let wordsMsgCount = 0;
  const userWordCounts: { [user: string]: { totalWords: number; msgCount: number } } = {};
  const mediaCounts: { [user: string]: number } = {};

  for (const line of lines) {
    if (line.length < 20 || line[2] !== '/' || line[5] !== '/' || line[10] !== ',' || line[11] !== ' ' || line[14] !== ':' || line[17] !== ' ' || line[18] !== '-' || line[19] !== ' ') {
      continue;
    }

    const match = line.match(msgRegex);
    if (match && !sysMsgRegex.test(line)) {
      const sender = match[2];
      if (sender === 'Meta AI') continue;
      const rawMsg = match[3];
      const cleanedMsg = rawMsg.replace(/<[^>]*>/g, '');
      const isMedia = rawMsg === '<Media omitted>';
      const isWordsMsg = cleanedMsg.trim() !== '';

      const firstName = getFirstName(sender);

      if (isWordsMsg || isMedia) {
        if (firstName) {
          userMsgCounts[firstName] = (userMsgCounts[firstName] || 0) + 1;
        }
      }

      if (isWordsMsg) {
        wordsMsgCount++;
        
        // active days
        const day = match[1].split(',')[0];
        dayMsgCounts[day] = (dayMsgCounts[day] || 0) + 1;

        // avg msgs per hour
        const [dateDay, dateTime] = match[1].split(', ');
        daySet.add(dateDay);
        const hour = dateTime.split(':')[0];
        hourMsgCounts[hour] = (hourMsgCounts[hour] || 0) + 1;

        const words = cleanedMsg.split(/\s+/);
        totalWords += words.length;

        if (firstName) {
          if (!userWordCounts[firstName]) {
            userWordCounts[firstName] = { totalWords: 0, msgCount: 0 };
          }
          userWordCounts[firstName].totalWords += words.length;
          userWordCounts[firstName].msgCount++;
        }

        // most common words and pings
        let msgWithoutPings = cleanedMsg;
        if (cleanedMsg.includes('@\u2068')) {
          const pings = cleanedMsg.match(/@\u2068(.*?)\u2069/g);
          if (pings) {
            for (const ping of pings) {
              const user = getFirstName(ping.substring(2, ping.length - 1));
              const key = user === null ? 'null' : user;
              pingCounts[key] = (pingCounts[key] || 0) + 1;
            }
          }
          msgWithoutPings = cleanedMsg.replace(/@\u2068(.*?)\u2069/g, '');
        }

        const wordsForCommon = msgWithoutPings.toLowerCase().split(/\s+/);
        for (const word of wordsForCommon) {
          if (word && word.length > 4 && !/^\d+$/.test(word)) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        }
      }

      if (isMedia)
        if (firstName)
          mediaCounts[firstName] = (mediaCounts[firstName] || 0) + 1;
    }
  }

  const sortedUserMsgCounts = Object.entries(userMsgCounts).sort((a, b) => b[1] - a[1]).slice(0, dataSize);
  const sortedCommonWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, dataSize);
  const sortedPings = Object.entries(pingCounts).sort((a, b) => b[1] - a[1]).slice(0, dataSize);
  const sortedDays = Object.entries(dayMsgCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const numberOfDays = daySet.size;
  const avgMsgsPerHour = Array(24).fill(0);
  for (const hour in hourMsgCounts) {
    avgMsgsPerHour[parseInt(hour)] = hourMsgCounts[hour] / (numberOfDays || 1);
  }

  const avgWordsPerMsg = wordsMsgCount > 0 ? totalWords / wordsMsgCount : 0;

  const avgWordsPerUser: [string, number][] = [];
  const totalWordsPerUserRaw: { [user: string]: number } = {};
  for (const user in userWordCounts) {
    avgWordsPerUser.push([user, userWordCounts[user].totalWords / userWordCounts[user].msgCount]);
    totalWordsPerUserRaw[user] = userWordCounts[user].totalWords;
  }
  const sortedAvgWordsPerUser = avgWordsPerUser.sort((a, b) => b[1] - a[1]).slice(0, dataSize);
  const sortedTotalWordsPerUser = Object.entries(totalWordsPerUserRaw).sort((a, b) => b[1] - a[1]).slice(0, dataSize);

  const sortedMediaPerUser = Object.entries(mediaCounts).sort((a, b) => b[1] - a[1]).slice(0, dataSize);

  cachedResults = {
    userMsgCounts: sortedUserMsgCounts,
    mostCommonWords: sortedCommonWords,
    mostPingedUsers: sortedPings,
    mostActiveDays: sortedDays,
    avgMsgsPerHour,
    avgWordsPerMsg,
    avgWordsPerMsgPerUser: sortedAvgWordsPerUser,
    totalWordsPerUser: sortedTotalWordsPerUser,
    totalMediaPerUser: sortedMediaPerUser,
  };

  return cachedResults;
}

export function countMsgsPerUser(): [string, number][] {
  return runAnalysis().userMsgCounts;
}

export function countTotalMsgs(): number {
  const userMsgCounts = countMsgsPerUser();
  return userMsgCounts.reduce((sum, [, count]) => sum + count, 0);
}

export function getMostCommonWords(): [string, number][] {
  return runAnalysis().mostCommonWords;
}

export function getMostPingedUser(): [string, number][] {
  return runAnalysis().mostPingedUsers;
}

export function getMostActiveDays(): [string, number][] {
  return runAnalysis().mostActiveDays;
}

export function getAvgMsgsPerHour(): number[] {
  return runAnalysis().avgMsgsPerHour;
}

export function getAvgWordsPerMsg(): number {
  return runAnalysis().avgWordsPerMsg;
}

export function getAvgWordsPerMsgPerUser(): [string, number][] {
  return runAnalysis().avgWordsPerMsgPerUser;
}

export function getTotalWordsPerUser(): [string, number][] {
  return runAnalysis().totalWordsPerUser;
}

export function getTotalMediaPerUser(): [string, number][] {
  return runAnalysis().totalMediaPerUser;
}