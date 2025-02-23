
export const payment = async (data: any) => {
    let myHeaders: any = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Bearer pk_test_51NQtLzClQttMRedL6JOS0Kmzi54mEpYo2MpNCKbrEpcxbN4JIda8pUEk6vrWNU08LD2cpPNyCQYjbwKFhzIXFSEp00UtLe95Oi");
    var urlencoded:any= new URLSearchParams();
    urlencoded.append("card[number]", data.cardNumber);
    urlencoded.append("card[exp_month]", data.expMonth);
    urlencoded.append("card[exp_year]", data.expYear);
    urlencoded.append("card[cvc]", data.cvv);
 
    var requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
     
    };
 
    let res = await fetch("https://api.stripe.com/v1/tokens", requestOptions)
      .then(response => response.text())
      .then(result => result)
      .catch(error => error);
 
      return(JSON.parse(res));
  }