// Deletes all the messages containing the given string from the given user (current or ex) from the whole SERVER
// Will delete latest messages first
// Max 25 messages per request can be deleted - due to Discord's pagination limit.

async function clearMessages() {
    const server = "1071742374797123604"; // server id number 
    const author = "743147880268693596"; // user id number
    const spamLink = "discord.gg/egirl-haven"; // the spam string

    const authToken = document.body.appendChild(document.createElement`iframe`).contentWindow.localStorage.token.replace(/"/g, "");
    const headers = { 'Authorization': authToken, 'Content-Type': 'application/json' };
    const baseURL = `https://discordapp.com/api/v6/channels`;
    let searchURL = `https://discordapp.com/api/v6/guilds/${server}/messages/search?author_id=${author}`;

    let clock = 0;
    let interval = 500;
    function delay(duration) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), duration);
        });
    }

    const response = await fetch(searchURL, {headers});
    const json = await response.json();
    console.log("There are total " + json.total_results + " messages from the user.");
    
    // Filter messages containing the spam link
    const messagesToDelete = json.messages.flatMap(message => message.filter(item => item.content.includes(spamLink)));
    console.log("Total " + messagesToDelete.length + " messages containing the spam link will be deleted.");
    
    await Promise.all(messagesToDelete.map(async item => {
        await delay(clock += interval);
        await fetch(`${baseURL}/${item.channel_id}/messages/${item.id}`, { headers, method: 'DELETE' });
    }));

    console.log("Finished deleting messages");
}
clearMessages();