
(() => {
  const style = document.createElement("style");
  style.textContent = `
    #chatBtn {
      position:fixed; bottom:20px; right:20px;
      background:#198754; color:white; border:0;
      padding:14px 20px; border-radius:30px;
      cursor:pointer; z-index:9999;
    }
    #chatBox {
      display:none; position:fixed; right:20px; bottom:80px;
      width:320px; height:420px; background:white;
      border:1px solid #ccc; border-radius:14px;
      z-index:9999; overflow:hidden; font-family:Arial;
      box-shadow:0 5px 25px #0002;
    }
    #chatHead {background:#198754;color:white;padding:14px;font-weight:bold}
    #chatMessages {height:290px;overflow:auto;padding:10px;font-size:14px}
    .msg {padding:9px;margin:7px 0;border-radius:10px;white-space:pre-wrap}
    .bot {background:#eee;color:#222}
    .user {background:#d8f5df;color:#222;text-align:right}
    #chatForm {display:flex;padding:8px;gap:5px}
    #chatInput {width:100%;min-width:0;padding:9px}
    #chatForm button {background:#198754;color:white;border:0;padding:8px;cursor:pointer}
  `;
  document.head.appendChild(style);

  const button = document.createElement("button");
  button.id = "chatBtn";
  button.textContent = "🌱 Ask AgriGuide";

  const box = document.createElement("div");
  box.id = "chatBox";
  box.innerHTML = `
    <div id="chatHead">🌱 AgriGuide Chatbot
      <span id="chatClose" style="float:right;cursor:pointer">✖</span>
    </div>
    <div id="chatMessages"></div>
    <form id="chatForm">
      <input id="chatInput" placeholder="Ask about farming..." required>
      <button type="submit">Send</button>
    </form>
  `;

  document.body.append(button, box);

  const messages = box.querySelector("#chatMessages");
  const input = box.querySelector("#chatInput");

  button.onclick = () => {
    box.style.display = box.style.display === "flex" ? "none" : "flex";
    box.style.flexDirection = "column";
  };

  box.querySelector("#chatClose").onclick = () => {
    box.style.display = "none";
  };

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function getReply(question) {
    const q = question.toLowerCase();

    if (q.includes("hello") || q.includes("hi") ||
        q.includes("namaste") || q.includes("नमस्ते")) {
      return "Namaste! 🙏 Main AgriGuide hoon. Aap kis crop ki kheti kar rahe hain?";
    }

    if (q.includes("wheat") || q.includes("गेहूं") || q.includes("gehu")) {
      return "🌾 Wheat ke liye suitable season, soil moisture aur local weather check karein. Sowing time aapke region par depend karta hai.";
    }

    if (q.includes("rice") || q.includes("paddy") || q.includes("धान")) {
      return "🌾 Rice ki kheti mein paani ki zarurat variety, soil aur growing stage par depend karti hai. Local weather aur irrigation availability check karein.";
    }

    if (q.includes("water") || q.includes("irrigation") ||
        q.includes("पानी") || q.includes("sinchai")) {
      return "💧 Irrigation se pehle soil moisture aur agle kuch din ki rainfall forecast check karein. Har crop ko same quantity mein paani nahi chahiye.";
    }

    if (q.includes("weather") || q.includes("rain") ||
        q.includes("मौसम") || q.includes("बारिश")) {
      return "🌦️ Main abhi live weather check nahi karta. Apne area ka forecast check karein, khaaskar baarish aur tez hawa ki warning.";
    }

    if (q.includes("fertilizer") || q.includes("खाद")) {
      return "🌱 Fertilizer ka selection soil test, crop aur growth stage ke hisaab se karein. Bina jaankari ke fertilizer ki dose decide na karein.";
    }

    if (q.includes("disease") || q.includes("रोग") ||
        q.includes("कीट") || q.includes("pest")) {
      return "🍃 Crop ki affected leaves ki clear photo lein aur symptoms note karein. Sahi diagnosis ke liye local KVK ya agriculture officer se salah lein.";
    }

    if (q.includes("thank") || q.includes("धन्यवाद")) {
      return "Aapka swagat hai! 😊 Kheti se related koi aur sawal ho toh poochhein.";
    }

    return "🌱 Main crops, wheat, rice, irrigation, fertilizer aur plant diseases ke basic questions mein help kar sakta hoon. Apna sawal thoda aur specific likhein.";
  }

  box.querySelector("#chatForm").addEventListener("submit", e => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    addMessage(question, "user");
    addMessage(getReply(question), "bot");
    input.value = "";
  });

  addMessage("Namaste! 🙏 Main AgriGuide hoon. Crops, irrigation ya farming ke baare mein poochhein.", "bot");
})();
