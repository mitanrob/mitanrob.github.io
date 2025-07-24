// Initialize Lucide icons
lucide.createIcons();

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

const mobileMenuLinks = mobileMenu.getElementsByTagName('a');
for (let link of mobileMenuLinks) {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
}

// --- C++ Code Typing Animation ---
const canvas = document.getElementById('code-animation-canvas');
const ctx = canvas.getContext('2d');

const codeSnippet = [
    "class RandomizedSet {",
    "public:",
    "    vector<int> vec;",
    "    unordered_map<int, int> map;",
    "    RandomizedSet() : vec({}), map({}) {};",
    "    bool insert(int val) {",
    "        if(map.contains(val))",
    "            return false;",
    "        vec.push_back(val);",
    "        map[val] = (int) vec.size() - 1;",
    "        return true;",
    "    }",
    "    bool remove(int val) {",
    "        if(map.contains(val)){",
    "            int index = map[val];",
    "            vec[index] = vec.back();",
    "            map[vec.back()] = index;",
    "            vec.pop_back();",
    "            map.erase(val);",
    "            return true;",
    "        }",
    "        return false;",
    "    }",
    "    int getRandom() {",
    "        int index = rand() % vec.size();",
    "        return vec[index];",
    "    }",
    "};"
];

// --- Syntax Highlighting Logic ---
const colors = {
    keyword: '#0ea5e9',   // sky-500
    type: '#facc15',      // yellow-400
    function: '#a78bfa',  // violet-400
    variable: '#d1d5db',  // gray-300
    default: '#67e8f9',   // cyan-300
    punctuation: '#6b7280' // gray-500
};

const keywords = new Set(['class', 'public', 'bool', 'int', 'if', 'return', 'true', 'false']);
const types = new Set(['vector', 'unordered_map', 'RandomizedSet']);
const functions = new Set(['insert', 'remove', 'getRandom', 'contains', 'push_back', 'back', 'pop_back', 'erase', 'size']);

function tokenizeAndDraw(line, x, y) {
    const tokens = line.split(/(\s+|\b|(?<=[(){};:,<>&%])|(?=[(){};:,<>&%]))/);
    let currentX = x;
    
    tokens.forEach(token => {
        if (keywords.has(token)) {
            ctx.fillStyle = colors.keyword;
        } else if (types.has(token)) {
            ctx.fillStyle = colors.type;
        } else if (functions.has(token)) {
            ctx.fillStyle = colors.function;
        } else if (/[(){};:,<>&%]/.test(token)) {
            ctx.fillStyle = colors.punctuation;
        } else if (!isNaN(parseFloat(token))) {
                ctx.fillStyle = colors.function; // Use function color for numbers
        }
        else {
            ctx.fillStyle = colors.default;
        }
        ctx.fillText(token, currentX, y);
        currentX += ctx.measureText(token).width;
    });
}


const fontSize = 16;
const lineHeight = 22;
let currentLine = 0;
let currentChar = 0;
let typingSpeed = 2;
let animationFrameId;
let restartTimeout;

function resizeCanvas() {
    const homeSection = document.getElementById('home');
    canvas.width = homeSection.offsetWidth;
    canvas.height = homeSection.offsetHeight;
    ctx.font = `${fontSize}px monospace`;
}

function draw() {
    ctx.fillStyle = 'rgba(17, 24, 39, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let y = 30;
    for (let i = 0; i < currentLine; i++) {
        tokenizeAndDraw(codeSnippet[i], 20, y);
        y += lineHeight;
    }

    if (currentLine < codeSnippet.length) {
        const line = codeSnippet[currentLine];
        const textToDraw = line.substring(0, currentChar);
        tokenizeAndDraw(textToDraw, 20, y);
    }
}

function updateTyping() {
    if (currentLine >= codeSnippet.length) {
        if (!restartTimeout) {
                restartTimeout = setTimeout(() => {
                currentLine = 0;
                currentChar = 0;
                restartTimeout = null; // Reset timeout after it has run
            }, 3000);
        }
        return;
    }

    const line = codeSnippet[currentLine];
    currentChar += typingSpeed;

    if (currentChar > line.length) {
        currentChar = line.length;
        currentLine++;
        currentChar = 0;
    }
}

function animate() {
    updateTyping();
    draw();
    animationFrameId = requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
        if(animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        }
        if(restartTimeout) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
        }
        resizeCanvas();
        animate();
});

resizeCanvas();
animate();