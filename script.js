/* =========================
   SETTINGS
========================= */

const SECRET_CODE = "2809";
const MUSIC_TIME_KEY = "birthdayMusicTime";

/* =========================
   ELEMENTS
========================= */

const envelope = document.getElementById("envelope");
const heartBtn = document.getElementById("heartBtn");
const continueBtn = document.getElementById("continueBtn");
const codeSection = document.getElementById("codeSection");
const codeInputs = document.querySelectorAll(".code-input");
const openBtn = document.getElementById("openBtn");
const error = document.getElementById("error");
const bgMusic = document.getElementById("bgMusic");

/* =========================
   MUSIC — SAME SONG / SAME POSITION
========================= */

function startMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.35;

    const savedTime = parseFloat(localStorage.getItem(MUSIC_TIME_KEY));
    if (!Number.isNaN(savedTime)) {
        const setPosition = () => {
            try {
                bgMusic.currentTime = savedTime;
            } catch (_) {}
        };

        if (bgMusic.readyState >= 1) {
            setPosition();
        } else {
            bgMusic.addEventListener("loadedmetadata", setPosition, { once: true });
        }
    }

    bgMusic.play().catch(() => {});
}

function saveMusicTime() {
    if (!bgMusic || !Number.isFinite(bgMusic.currentTime)) return;
    localStorage.setItem(MUSIC_TIME_KEY, String(bgMusic.currentTime));
}

if (bgMusic) {
    bgMusic.addEventListener("timeupdate", saveMusicTime);
    setInterval(saveMusicTime, 500);
    window.addEventListener("beforeunload", saveMusicTime);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") saveMusicTime();
    });
}

/* =========================
   OPEN ENVELOPE
========================= */

heartBtn.addEventListener("click", () => {
    envelope.classList.add("open");
    startMusic();

    setTimeout(() => {
        continueBtn.classList.add("show");
    }, 3900);
});

/* =========================
   SHOW CODE
========================= */

continueBtn.addEventListener("click", () => {
    saveMusicTime();
    codeSection.classList.add("show");

    setTimeout(() => {
        codeInputs[0].focus();
    }, 500);
});

/* =========================
   MOVE BETWEEN INPUTS
========================= */

codeInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");

        if (input.value && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && index > 0) {
            codeInputs[index - 1].focus();
        }
    });
});

/* =========================
   CHECK CODE
========================= */

openBtn.addEventListener("click", () => {
    let enteredCode = "";
    codeInputs.forEach(input => enteredCode += input.value);

    if (enteredCode === SECRET_CODE) {
        error.classList.remove("show");
        saveMusicTime();

        codeSection.style.transform = "scale(1.1)";
        codeSection.style.opacity = "0";

        setTimeout(() => {
            window.location.href = "page2.html";
        }, 600);

    } else {
        error.classList.add("show");

        codeInputs.forEach(input => input.value = "");
        codeInputs[0].focus();

        codeSection.querySelector(".code-card").animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-8px)" },
                { transform: "translateX(8px)" },
                { transform: "translateX(-5px)" },
                { transform: "translateX(5px)" },
                { transform: "translateX(0)" }
            ],
            { duration: 400 }
        );
    }
});
