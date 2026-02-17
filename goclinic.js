/* ================================================
   GOCLINIC AI CHATBOT - FINAL WORKING VERSION
   Using gemini-1.5-flash (STABLE & AVAILABLE)
   ================================================ */

// YOUR API KEY
const GEMINI_API_KEY = 'AIzaSyBENPFqrHzrXzL5DWSn8AdZGR5exzj5oRw';

// CORRECT API URL - Use gemini-1.5-flash (NOT gemini-pro)
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System Prompt
const SYSTEM_PROMPT = `You are Gina, a helpful AI assistant for GoClinic Diagnostic and Specialty Center.

CLINIC INFO:
- Name: GoClinic Diagnostic and Specialty Center  
- Location: Margimel Building, National Highway, Brgy. Halang, Calamba, Laguna 4027 (Behind Yellow Cab)
- Hours: Monday-Saturday, 6AM-6PM (CLOSED Sundays & Holidays)
- Contact: 0919 861 1327
- Email: calamba.goclinic@gmail.com
- Facebook: facebook.com/GoClinicDSC

SERVICES:
1. Consultations: Internal Medicine, OB-GYN, Pediatrics
2. Diagnostics: Laboratory, X-Ray, Ultrasound, ECG, 2D Echo  
3. Packages: Pre-Employment, APE, Pre-Natal, Pediatric, Executive

HMOs: Maxicare, Medicard, PhilCare, Intellicare, Cocolife, Avega, Carewell, Pacific Cross

BOOKING: Call 0919 861 1327, Walk-in, or Facebook

GUIDELINES:
- Friendly and professional
- Use 1-2 emojis
- Keep answers 2-4 paragraphs
- For emergencies, advise ER
- For pricing, direct to call
- For medical advice, recommend doctor
- Support English and Filipino`;

let chatHistory = [];

// ============================================
// MAIN FUNCTIONS
// ============================================

function openAIChat() {
    document.getElementById('goclinicAIWindow').classList.add('active');
    document.getElementById('goclinicAILauncher').style.display = 'none';
}

function closeAIChat() {
    document.getElementById('goclinicAIWindow').classList.remove('active');
    document.getElementById('goclinicAILauncher').style.display = 'flex';
}

// ============================================
// SEND MESSAGE
// ============================================

async function sendUserMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    const sendBtn = document.getElementById('sendButton');
    if (sendBtn) sendBtn.disabled = true;
    
    showTyping();
    
    try {
        const response = await callGeminiAPI(message);
        hideTyping();
        addBotMessage(response);
    } catch (error) {
        hideTyping();
        addBotMessage(`I'm having trouble right now. 😔\n\nPlease contact us:\n📞 0919 861 1327\n📧 calamba.goclinic@gmail.com`);
        console.error('API Error:', error);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
    }
}

function askQuick(question) {
    document.getElementById('aiChatInput').value = question;
    sendUserMessage();
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        sendUserMessage();
    }
}

// ============================================
// GEMINI API CALL
// ============================================

async function callGeminiAPI(userMessage) {
    // Build conversation with system prompt
    const requestBody = {
        contents: [{
            parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}` }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
        }
    };
    
    console.log('📤 Sending to Gemini 1.5 Flash...');
    
    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });
    
    console.log('📥 Status:', response.status);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error?.message || `API Error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Response received!');
    
    // Extract response text
    const aiText = data.candidates[0].content.parts[0].text;
    
    // Save to history
    chatHistory.push(
        { role: 'user', text: userMessage },
        { role: 'assistant', text: aiText }
    );
    
    // Keep history manageable
    if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(-20);
    }
    
    return aiText;
}

// ============================================
// UI FUNCTIONS
// ============================================

function addUserMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message-container';
    
    const avatar = document.createElement('div');
    avatar.className = 'user-avatar';
    avatar.textContent = '👤';
    
    const bubble = document.createElement('div');
    bubble.className = 'user-message-bubble';
    bubble.textContent = content;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    
    document.getElementById('aiChatMessages').appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message-container';
    
    const avatar = document.createElement('div');
    avatar.className = 'bot-avatar';
    avatar.textContent = '👩‍⚕️';
    
    const bubble = document.createElement('div');
    bubble.className = 'bot-message-bubble';
    bubble.innerHTML = formatMessage(content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    
    document.getElementById('aiChatMessages').appendChild(messageDiv);
    scrollToBottom();
}

function formatMessage(text) {
    // Handle line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Handle bold **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Wrap in paragraphs
    const paragraphs = text.split('<br><br>');
    return paragraphs.map(p => `<p>${p}</p>`).join('');
}

function showTyping() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'typing-indicator-container';
    messageDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'bot-avatar';
    avatar.textContent = '👩‍⚕️';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-dots-bubble';
    indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(indicator);
    
    document.getElementById('aiChatMessages').appendChild(messageDiv);
    scrollToBottom();
}

function hideTyping() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    const chatArea = document.getElementById('aiChatMessages');
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ GoClinic AI Chatbot loaded!');
    console.log('🤖 Using Gemini 1.5 Flash API');
    console.log('💚 Ready to assist!');
});
