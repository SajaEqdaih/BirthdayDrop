let countdownInterval = null;

const $ = (id) => document.getElementById(id);

function pad(n) {
  return String(n).padStart(2, "0");
}

function show(el) {
  el.classList.remove("hidden");
}

function hide(el) {
  el.classList.add("hidden");
}

function getNextBirthday(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const now = new Date();

  let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0, 0);

  if (target.getTime() < now.getTime()) {
    target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
  }

  return target;
}

function buildShareLink(name, date) {
  const url = new URL(window.location.href);
  url.searchParams.set("name", name);
  url.searchParams.set("date", date);
  return url.toString();
}

function burstConfetti() {
  confetti({
    particleCount: 140,
    spread: 90,
    origin: { y: 0.7 }
  });
}

function launchFireworks() {
  const duration = 2200;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 }
    });

    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 }
    });

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.5 }
    });
  }, 250);
}

function updateCountdown(target) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    $("status").innerText = "🎂 اليوم هو يومك! عيد ميلاد سعيد جدًا 🎉";
    $("d").innerText = "0";
    $("h").innerText = "00";
    $("m").innerText = "00";
    $("s").innerText = "00";
    $("giftBtn").classList.remove("hidden");
    launchFireworks();
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("d").innerText = String(days);
  $("h").innerText = pad(hours);
  $("m").innerText = pad(minutes);
  $("s").innerText = pad(seconds);

  $("status").innerText = "شغّالين على تجهيز الحفلة 🎈";
}

function wishesKey(name, date) {
  return `birthdaydrop:wishes:${encodeURIComponent(name)}:${date}`;
}

function saveWishes(name, date, wishes) {
  localStorage.setItem(wishesKey(name, date), JSON.stringify(wishes));
}

function loadWishes(name, date) {
  const raw = localStorage.getItem(wishesKey(name, date));
  const wishes = raw ? JSON.parse(raw) : [];
  renderWishes(wishes);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderWishes(wishes) {
  const list = $("wishesList");
  list.innerHTML = "";

  if (!wishes.length) {
    list.innerHTML = `<div class="wish">لا توجد تهاني بعد 🎈 كن أول من يكتب!</div>`;
    return;
  }

  wishes
    .slice()
    .reverse()
    .forEach((wish) => {
      const div = document.createElement("div");
      div.className = "wish";
      div.innerHTML = `
        <div class="meta">
          <span>من: ${escapeHtml(wish.from || "مجهول")} 💌</span>
          <span>${new Date(wish.at).toLocaleString("ar")}</span>
        </div>
        <div>${escapeHtml(wish.text)}</div>
      `;
      list.appendChild(div);
    });
}

function blowCandles() {
  document.querySelectorAll(".flame").forEach((flame) => {
    flame.classList.add("out");
  });

  launchFireworks();
  $("status").innerText = "انطفأت الشموع وبدأت الحفلة! 🎉";
  $("giftBtn").classList.remove("hidden");
}

function openSpecialMessage(name) {
  $("messageText").innerText = `إلى ${name} 💖
كل سنة وأنت بخير، أتمنى تكون سنتك الجديدة مليانة فرح ونجاح وذكريات حلوة جدًا ✨`;
}

function startMagic(name, date) {
  if (!name || !date) {
    alert("لا تنسي/تنسى تعبئة الاسم وتاريخ الميلاد 😉");
    return;
  }

  $("welcome").innerText = `أهلاً ${name} 🎈`;
  openSpecialMessage(name);

  show($("specialMessage"));
  show($("cakeSection"));
  show($("countdown-container"));
  show($("surpriseSection"));
  show($("memoriesSection"));
  show($("wishes-container"));

  const shareLink = buildShareLink(name, date);
  $("shareLink").value = shareLink;
  $("copyLinkBtn").disabled = false;

  burstConfetti();

  const target = getNextBirthday(date);

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  updateCountdown(target);
  countdownInterval = setInterval(() => updateCountdown(target), 1000);

  loadWishes(name, date);
}

function spinWheel() {
  const wheel = $("wheel");
  const result = $("surpriseResult");

  const surprises = [
    "🎁 مفاجأة! أنت نجم اليوم",
    "💖 كل سنة وأنت بخير",
    "🎉 حفلة إضافية بدأت",
    "🌟 سنة مليانة نجاح",
    "🎂 تستحق يومًا رائعًا جدًا"
  ];

  const randomDegrees = 1440 + Math.floor(Math.random() * 360);
  wheel.style.transform = `rotate(${randomDegrees}deg)`;

  setTimeout(() => {
    const randomMessage = surprises[Math.floor(Math.random() * surprises.length)];
    result.innerText = randomMessage;
    launchFireworks();
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = $("enterPartyBtn");
  const introScreen = $("introScreen");

  enterBtn.addEventListener("click", () => {
    burstConfetti();
    introScreen.style.transition = "0.6s";
    introScreen.style.opacity = "0";

    setTimeout(() => {
      introScreen.style.display = "none";
    }, 600);
  });

  $("startBtn").addEventListener("click", () => {
    const name = $("userName").value.trim();
    const date = $("birthDate").value;
    startMagic(name, date);
  });

  $("copyLinkBtn").addEventListener("click", async () => {
    const link = $("shareLink").value;
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      $("copyLinkBtn").innerText = "تم النسخ ✅";
      setTimeout(() => {
        $("copyLinkBtn").innerText = "انسخ رابط المشاركة 🔗";
      }, 1200);
    } catch {
      $("shareLink").select();
      document.execCommand("copy");
      $("copyLinkBtn").innerText = "تم النسخ ✅";
      setTimeout(() => {
        $("copyLinkBtn").innerText = "انسخ رابط المشاركة 🔗";
      }, 1200);
    }
  });

  $("shareLink").addEventListener("click", () => {
    $("shareLink").select();
  });

  $("openMessageBtn").addEventListener("click", () => {
    launchFireworks();
    $("status").innerText = "الرسالة وصلت ومعها بداية الاحتفال 💌";
  });

  $("blowCandlesBtn").addEventListener("click", () => {
    blowCandles();
  });

  $("giftBtn").addEventListener("click", () => {
    const gifts = [
      "🎁 مفاجأة! اليوم كله إلك",
      "💖 هديتك: سنة مليانة سعادة",
      "🌟 تستحق كل شيء جميل",
      "🎉 ابتسامتك هي أجمل هدية"
    ];

    const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
    $("giftMessage").innerText = randomGift;
    launchFireworks();
  });

  $("spinWheelBtn").addEventListener("click", () => {
    spinWheel();
  });

  $("wishForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("userName").value.trim();
    const date = $("birthDate").value;

    if (!name || !date) {
      alert("دخلي/ادخل اسم صاحب العيد وتاريخ الميلاد أولًا 😊");
      return;
    }

    const from = $("fromName").value.trim();
    const text = $("wishText").value.trim();

    if (!text) {
      alert("اكتبي/اكتب تهنئة أولًا ✨");
      return;
    }

    const raw = localStorage.getItem(wishesKey(name, date));
    const wishes = raw ? JSON.parse(raw) : [];

    wishes.push({
      from,
      text,
      at: Date.now()
    });

    saveWishes(name, date, wishes);
    renderWishes(wishes);

    $("wishText").value = "";
    burstConfetti();
  });

  $("clearWishesBtn").addEventListener("click", () => {
    const name = $("userName").value.trim();
    const date = $("birthDate").value;

    if (!name || !date) return;

    if (!confirm("متأكدة/متأكد أنك بدك تمسح كل التهاني؟")) return;

    localStorage.removeItem(wishesKey(name, date));
    loadWishes(name, date);
  });

  const params = new URLSearchParams(window.location.search);
  const sharedName = params.get("name");
  const sharedDate = params.get("date");

  if (sharedName) $("userName").value = sharedName;
  if (sharedDate) $("birthDate").value = sharedDate;

  if (sharedName && sharedDate) {
    startMagic(sharedName, sharedDate);
  }
});