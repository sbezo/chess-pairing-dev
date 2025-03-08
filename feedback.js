function sendFeedback() {
    const myHeaders = new Headers();
    myHeaders.append("", "");
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "message": "Message from Web"
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    console.log(raw)
    
    fetch("https://p11gt3fasc.execute-api.eu-central-1.amazonaws.com/default/Handle_CP_feddback", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
}