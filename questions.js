const chapters = [
  { id: 1, name: "Speed limits", hi: "गति सीमा" },
  { id: 2, name: "Lights and signals", hi: "लाइट और सिग्नल" }
];

const questions = [
  { id: 1, chapter: 1,
    q: "What is the national speed limit for cars on a single carriageway road?",
    options: ["30 mph", "50 mph", "60 mph", "70 mph"], answer: 2,
    hi: "सिंगल कैरिजवे सड़क पर कारों की राष्ट्रीय गति सीमा क्या है?",
    exp: "सही जवाब 60 mph है। जब तक कोई साइन अलग गति न बताए, यही सीमा लागू होती है." },
  { id: 2, chapter: 1,
    q: "What is the national speed limit for cars on a motorway?",
    options: ["60 mph", "70 mph", "80 mph", "50 mph"], answer: 1,
    hi: "मोटरवे पर कारों की राष्ट्रीय गति सीमा क्या है?",
    exp: "सही जवाब 70 mph है, अगर कोई साइन कम गति न बताए." },
  { id: 3, chapter: 1,
    q: "What is the overall stopping distance for a car travelling at 30 mph?",
    options: ["12 metres", "23 metres", "36 metres", "53 metres"], answer: 1,
    hi: "30 mph पर चल रही कार को पूरी तरह रुकने में कितनी दूरी लगती है?",
    exp: "सही जवाब 23 मीटर है, यानी लगभग 6 कारों की लंबाई." },
  { id: 4, chapter: 2,
    q: "What does a red traffic light mean?",
    options: ["Slow down", "Stop and wait behind the stop line", "Go if the road is clear", "Give way to pedestrians only"], answer: 1,
    hi: "लाल ट्रैफ़िक लाइट का क्या मतलब है?",
    exp: "लाल लाइट का मतलब है स्टॉप लाइन के पीछे रुकना और इंतज़ार करना." },
  { id: 5, chapter: 2,
    q: "When must you use your headlights?",
    options: ["Only after midnight", "When visibility is seriously reduced", "Only on motorways", "Never in daytime"], answer: 1,
    hi: "आपको हेडलाइट कब जलानी चाहिए?",
    exp: "जब दिखाई देना बहुत कम हो जाए, जैसे जब आप 100 मीटर से ज़्यादा दूर तक न देख पाएँ." }
];