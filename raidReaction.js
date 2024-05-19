// Deletes ALL messages of the given user from the CURRENT CHANNEL

async function clearMessages() {
    const server = "1071742374797123604"; // server id number 
    const author = "266256657120493568"; // user id number

    const channel = window.location.href.split('/').pop();

    const authToken = document.body.appendChild(document.createElement`iframe`).contentWindow.localStorage.token.replace(/"/g, "");
    const headers = { 'Authorization': authToken, 'Content-Type': 'application/json' };
    const baseURL = `https://discordapp.com/api/v6/channels`;
    let searchURL = `https://discordapp.com/api/v6/guilds/${server}/messages/search?author_id=${author}`;
    if (typeof channel !== 'undefined') searchURL = searchURL + `&channel_id=${channel}`;

    let clock = 0;
    let interval = 500;
    function delay(duration) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), duration);
        });
    }

    const response = await fetch(searchURL, {headers});
    const json = await response.json();
    console.log("There are " + json.total_results + " messages left to delete.");
    await Array.from(json.messages).map(message => {
        message.forEach(async function(item) {
            if(item.hit == true) {
                await delay(clock += interval);
                await fetch(`${baseURL}/${item.channel_id}/messages/${item.id}`, { headers, method: 'DELETE' });
            }
        });
    });

    if (json.total_results > 0) { 
        delay(clock += interval).then(() => { clearMessages(); }); 
    } else {
        console.log("Finished deleting messages")
    };
}
clearMessages();