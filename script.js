function generateAndCheckInvites() {
  const inviteInfoDiv = document.getElementById("inviteInfo");
  inviteInfoDiv.innerHTML = "Generating and checking invites...";

  // Fetch random words from the API
  fetch('https://random-word-api.herokuapp.com/word?number=100&length=3,5')
    .then(response => response.json())
    .then(words => {
      const invites = words.map(word => `discord.gg/${word}`);
      let validCount = 0;

      inviteInfoDiv.innerHTML = ""; // Clear previous info
      const resultsDiv = document.createElement("div");
      inviteInfoDiv.appendChild(resultsDiv);

      invites.forEach((invite, index) => {
        const inviteCode = invite.split('/').pop();

        // Validate each invite
        fetch(`https://discord.com/api/v9/invites/${inviteCode}`)
          .then(response => {
            if (!response.ok) throw new Error("Invalid invite");
            return response.json();
          })
          .then(data => {
            validCount++;
            const result = document.createElement("div");
            result.innerHTML = `<b>Valid Invite:</b> ${invite} - <i>${data.guild?.name || "Unknown Server"}</i>`;
            resultsDiv.appendChild(result);
          })
          .catch(() => {
            const result = document.createElement("div");
            result.innerHTML = `<b>Invalid Invite:</b> ${invite}`;
            resultsDiv.appendChild(result);
          })
          .finally(() => {
            // Display completion status
            if (index === invites.length - 1) {
              const summary = document.createElement("p");
              summary.innerHTML = `<b>Checked ${invites.length} invites. Found ${validCount} valid invites.</b>`;
              inviteInfoDiv.appendChild(summary);
            }
          });
      });
    })
    .catch(error => {
      console.error("Error fetching random words:", error);
      inviteInfoDiv.innerText = "Failed to fetch random words. Please try again.";
    });
}
