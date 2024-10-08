import 'bootstrap';
import stringSimilarity from 'string-similarity';

const responses = {
    'bonjour': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    'tarifs': 'L’adhésion coûte 10$ une fois que votre formulaire est approuvé. Souhaitez-vous soumettre une demande ?',
    'échange d\'heures': 'Les échanges se font par l’intermédiaire de notre plateforme. Vous pouvez offrir ou demander un service, et la banque d’heures est mise à jour automatiquement.',
    'mot de passe': 'Pas de souci ! Cliquez sur "Mot de passe oublié" sur la page de connexion pour recevoir un lien de réinitialisation.',
    'mettre à jour profil': 'Pour modifier votre profil ou vos services, connectez-vous à votre compte et allez dans l’onglet "Mon profil". Vous pourrez y faire des ajustements facilement.',
    'types de services': 'Vous pouvez proposer ou demander des services dans 13 catégories, comme l’entretien, la cuisine, la gestion, ou encore des conseils technologiques.',
    'contacter un membre': 'Une fois connecté, vous pouvez utiliser la messagerie interne pour contacter les membres. Si vous avez besoin d’aide, n’hésitez pas à nous demander.',
    'problèmes plateforme': 'Vous pouvez nous contacter directement par courriel à partages@aqdralma.com ou par téléphone au 418 480-1122.',
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

    setTimeout(() => addMessage("Bienvenue sur le site des Partag'heures ! Comment puis-je vous aider aujourd'hui ?"), 1000);
});
