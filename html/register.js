const user = document.getElementById('username');
const pass1 = document.getElementById('password');
const pass2 = document.getElementById('password2');
const form = document.querySelector('form');

const msgDiv = document.getElementById('form-message');
const msg = document.createElement('p');
msgDiv.appendChild(msg);


form.addEventListener('submit', async (event) => {
	event.preventDefault();
	validateInput();
})

const validateInput = async () => {
    const passwordValue = pass1.value;
	const confirmPassword = pass2.value;
	const usernameValue = username.value;
	msg.innerText = '';
	
	if(!usernameValue) {
		msg.innerText = 'Enter a username.';
		return;
	}
	
    if (!isValidPassword(passwordValue)) {
        msg.innerText = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
        return;
    }
	if(passwordValue !== confirmPassword) {
		msg.innerText = 'Passwords do not match.';
		return;
	}
	
	try {
      const response = await fetch('/register-user.html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: usernameValue,
          password: passwordValue
        })
      });
	  
	  const res = await response.json();
	  if (response.ok) {
		  msg.innerText = 'Registration successful!'
		  form.reset()
	  } else {
		  msg.innerText = data.error || 'Registration failed. Please try again.'
	  }
	} catch(error) {
		msg.innerText = 'There was a server error. Please try again later.'
		console.error('Registration error:', error)
	}
};

function isValidPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}
