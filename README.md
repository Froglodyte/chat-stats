# Chat-Stats

WhatsApp chat analyzer to your group activity, message counts per user, most common words, media sent, and hourly trends.

![Svelte](https://img.shields.io/badge/Svelte_5-FF3E00?style=flat&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)

---

## 🚀 Getting Started

Follow these steps to analyze your own chat logs:

### 1. Export WhatsApp Chat
1. Open the WhatsApp chat or group you want to analyze on your phone.
2. Tap the menu options (three dots) -> **More** -> **Export chat**.
3. Choose **Without Media**.
4. Save/transfer the exported `.txt` file to your computer.

### 2. Add Chat Log to Project
1. Copy the exported `.txt` file.
2. Paste it into the `src/chat_logs/` directory.
   > [!TIP]
   > Rename the file to remove spaces or emojis for easier configuration (e.g. `my_chat.txt`).

### 3. Update Configuration
1. Open [src/lib/analyzer.ts](file:///home/mudit/Desktop/chat-stats/src/lib/analyzer.ts).
2. Change the `fileName` constant at the top to match your file's name (without the `.txt` extension):
   ```typescript
   //=========== CHANGE THESE ========
   const fileName = 'my_chat'; // Update this to match your file name (without .txt)
   const dataSize = 20;        // Number of top entries to display
   //==================================
   ```

### 4. Run the App
Install dependencies and run the local development server:

```bash
npm install
npm run dev
```

Open the local address (typically `http://localhost:5173`) in your browser to view your statistics dashboard.