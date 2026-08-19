const rawUsername = sessionStorage.getItem("regUsername");
const rawPassword = sessionStorage.getItem("regPassword");

if (!rawUsername || !rawPassword) {
    alert("No account found. Please register first.");
    window.location.href = "index.html";
}

let typedSoFar = [];
let currentPhase = "username";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

const balloons = [];
const letters = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
const colors = ["#ef4444","#f97316","#a855f7","#3b82f6","#22c55e","#ec4899"];

function spawnBalloon() {
    balloons.push({
        x: Math.random() * (canvas.width - 80) + 40,
        y: canvas.height + 40,
        letter: letters[Math.floor(Math.random() * letters.length)],
        radius: 30,
        speed: Math.random() * 1.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

let balloonsSpawned = 0;

function spawnInitial() {
    if (balloonsSpawned < 25) {
        spawnBalloon();
        balloonsSpawned++;
        setTimeout(spawnInitial, 55);
    }
}

spawnInitial();

function gameLoop() {
    // 1. Clear first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Balloons
    for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        b.y -= b.speed;

        if (b.y + b.radius < 0) {
            balloons.splice(i, 1);
            spawnBalloon();
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.letter, b.x, b.y);
    }

    // 3. Typed text — after balloons so it's on top
    const displayText = currentPhase === "username"
        ? typedSoFar.join("")
        : "*".repeat(typedSoFar.length);

    ctx.fillStyle = "black";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(displayText, canvas.width / 2, 20);

    // 4. Dart — black so it's visible
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(mouseX - 8, mouseY + 20);
    ctx.lineTo(mouseX + 8, mouseY + 20);
    ctx.closePath();
    ctx.fill();

    // 5. Collision check
    for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        const dist = Math.sqrt((mouseX - b.x)**2 + (mouseY - b.y)**2);

        if (dist < b.radius) {
            typedSoFar.push(b.letter);
            console.log(currentPhase, typedSoFar);
            balloons.splice(i, 1);
            spawnBalloon();
            break;
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", function() {
    const typedString = typedSoFar.join("");

    if (currentPhase === "username") {
        if (typedString === rawUsername) {
            typedSoFar = [];
            currentPhase = "password";
            submitBtn.textContent = "Submit Password";
            alert("Username confirmed. Now enter your password.");
        } else {
            alert("Wrong username. Try again.");
            typedSoFar = [];
            resetBalloons();
        }
        return;
    }

    if (currentPhase === "password") {
        if (typedString === rawPassword) {
            window.location.href = "success.html";
            return;
        }

        let matches = 0;
        for (let i = 0; i < typedString.length; i++) {
            if (rawPassword.includes(typedString[i])) {
                matches++;
            }
        }

        if (matches >= 4) {
            alert(`You entered the wrong details. Try again.`);
            typedSoFar = [];
            window.location.href = "game.html";
        } else {
            alert("Wrong password.");
            typedSoFar = [];
            window.location.href = "game.html";
            resetBalloons();
        }
    }
    function resetBalloons() {
    balloons.length = 0;
    balloonsSpawned = 0;
    spawnInitial();
}

});