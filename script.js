function generateRandomInvites(count) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const invites = [];

  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 7; j++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    invites.push(`discord.gg/${code}`);
  }

  return invites;
}

async function checkInvite(inviteCode) {
  try {
    const response = await fetch(`https://discord.com/api/v9/invites/${inviteCode}`);
    if (!response.ok) {
      throw new Error(`Invalid: ${inviteCode}`);
    }
    const data = await response.json();
    return { valid: true, code: inviteCode, data };
  } catch (error) {
    return { valid: false, code: inviteCode, error: error.message };
  }
}

async function processInvites() {
  const inviteInfoDiv = document.getElementById("inviteInfo");
  inviteInfoDiv.innerHTML = '<p>Processing invites...</p>';

  const invites = generateRandomInvites(1000);
  const results = await Promise.all(invites.map(invite => checkInvite(invite.split('/').pop())));

  const validInvites = results.filter(result => result.valid);
  const invalidInvites = results.filter(result => !result.valid);

  inviteInfoDiv.innerHTML = `
    <h2>Results:</h2>
    <p><strong>Valid Invites:</strong> ${validInvites.length}</p>
    <ul>
      ${validInvites.map(invite => `<li>${invite.code}</li>`).join('')}
    </ul>
    <p><strong>Invalid Invites:</strong> ${invalidInvites.length}</p>
    <ul>
      ${invalidInvites.map(invite => `<li>${invite.code}</li>`).join('')}
    </ul>
  `;
}
