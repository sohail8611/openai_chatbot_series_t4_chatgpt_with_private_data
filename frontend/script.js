const chatBoxWrapper = document.getElementById('chatbox');
const chatBoxTextField = document.getElementById('chatbox-message-field');

chatBoxWrapper.classList.add('show');
const chatBoxTextFieldHeight = chatBoxTextField.clientHeight;
chatBoxTextField.addEventListener('keyup', (e) => {
    var maxHeight = getComputedStyle(chatBoxTextField).getPropertyValue('--chatbox-max-height');
    chatBoxTextField.removeAttribute('style');
    setTimeout(() => {
        if (chatBoxTextField.scrollHeight > maxHeight) {
            chatBoxTextField.style.height = `${maxHeight}px`;
        } else {
            chatBoxTextField.style.height = `${chatBoxTextField.scrollHeight}px`;
        }
    }, 0);
});

const chatBoxSendBtn = document.getElementById('chatbox-send-btn');

function sendMessage(my_short_term_memory) {
    const message = chatBoxTextField.value.trim();
    const _message = chatBoxTextField.value.trim();
    if (message !== "") {
        const chatBoxBody = document.querySelector('#chatbox .chatbox-body');
        const newMessage = document.createElement('div');
        newMessage.classList.add('chatbox-item');
        newMessage.innerHTML = `<div class="chatbox-user-avatar"><span>U</span></div><div class="chatbox-item-content-wrapper"><div class="chatbox-item-content">${message}</div></div>`;
        chatBoxBody.prepend(newMessage);
        chatBoxTextField.value = "";

        // Add a loading icon
        const loading = document.createElement('div');
        loading.classList.add('chatbox-item', 'chatbox-msg-receiver', 'loading-icon');
        loading.innerHTML = `<div class="chatbox-user-avatar"><span>B</span></div><div class="chatbox-item-content-wrapper"><div class="chatbox-item-content">Loading...</div></div>`;
        chatBoxBody.prepend(loading);

        // Call the API
        fetch('http://127.0.0.1:5000/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input_prompt: message , short_term_memory:my_short_term_memory }),
        })
        .then(response => response.json())
        .then(data => {
            // Remove the loading element
            chatBoxBody.removeChild(loading);

            // Handle the API response and add it to the chatbox
            const responseMessage = data.response; // Assuming the API returns the response in a field called 'response'
            const responseElement = document.createElement('div');
            responseElement.classList.add('chatbox-item', 'chatbox-msg-receiver');
            responseElement.innerHTML = `<div class="chatbox-user-avatar"><span>B</span></div><div class="chatbox-item-content-wrapper"><div class="chatbox-item-content">${responseMessage}</div></div>`;
            chatBoxBody.prepend(responseElement);
            my_short_term_memory.push({"user":_message,"AI":data.response})
            
            removeFirstIfLengthGreaterThanSix(my_short_term_memory)
            console.log(my_short_term_memory)
        })
        .catch(error => {
            console.error('Error fetching API:', error);
            // Handle error if necessary
        });
    }
}
my_short_term_memory = []

function removeFirstIfLengthGreaterThanSix(arr) {
    if (arr.length > 6) {
      arr.shift(); // Removes the first element from the array
    }
  }
chatBoxSendBtn.addEventListener('click', sendMessage);
chatBoxTextField.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage(my_short_term_memory);
    }
});
