import 'bootstrap';
import stringSimilarity from 'string-similarity';

const responses = {
    'bonjour': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    'tarifs': 'Nos tarifs commencent à 9,99 € par mois. Voulez-vous plus de détails ?',
    'support': 'Pour le support, veuillez nous envoyer un e-mail à support@akisupport.com ou appelez le 01 23 45 67 89.',
    'fonctionnalités': 'Il n\'y en a pas mais vous pouvez toujours nous en proposer',
};

const keywords = Object.keys(responses);

function getResponse(input) {
    const lowercaseInput = input.toLowerCase();
    let bestMatch = { target: '', rating: 0 };

    for (const keyword of keywords) {
        const rating = stringSimilarity.compareTwoStrings(lowercaseInput, keyword);
        if (rating > bestMatch.rating) {
            bestMatch = { target: keyword, rating };
        }
    }

    if (bestMatch.rating > 0.5) {
        return responses[bestMatch.target];
    }

    return "Je suis désolé, je n'ai pas d'information à ce sujet. Pouvez-vous reformuler ou choisir une option prédéfinie ?";
}

function addMessage(message, isUser = false) {
    const messageClass = isUser ? 'user-message' : 'bot-message';
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageClass}`;
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage(message) {
    addMessage(message, true);
    const response = getResponse(message);
    setTimeout(() => addMessage(response), 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatDialog = document.getElementById('chat-dialog');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const closeChat = document.getElementById('close-chat');

    chatBubble.addEventListener('click', () => {
        if (chatDialog.style.display === 'block') {
            chatDialog.style.display = 'none';
        } else {
            chatDialog.style.display = 'block';
        }
    });

    closeChat.addEventListener('click', () => {
        chatDialog.style.display = 'none';
    });

    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.textContent);
        });
    });

    setTimeout(() => addMessage("Bienvenue sur AkiSupport ! Comment puis-je vous aider aujourd'hui ?"), 1000);
});
