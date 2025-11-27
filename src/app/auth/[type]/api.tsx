// Define the shape of your form data
interface FormInfo {
  username? : string;
  pass? : string;
  email?: string;
  password?: string;
  // add other fields if needed
}

// Restrict context to expected values
type AuthContext = "Registration" | "Login";

export async function Authentication(formInfo : FormInfo, context : AuthContext){
  let response : Response | null = null
  if(context == "Registration"){
    response = await fetch('https://localhost:5000/users/register',{
      method: "POST",
      credentials : "include",
      headers: {
        "Content-Type" : "application/json",
        "Accept" : "application/json"
      },
      body: JSON.stringify(formInfo),
    })
  }
  if(context == "Login"){
    response = await fetch('https://localhost:5000/users/login',{
      method: "POST",
      credentials : "include",
      headers: {
        "Content-Type" : "application/json",
        "Accept" : "application/json"
      },
      body: JSON.stringify(formInfo),
    })
  }
  if(response){
    let msg = await response.text()
    return { ok : response.ok, status : response.status, message : msg}
  }else{
    return { ok : false, status: 500, message: `Request didn't reach the server.`}
  }
}
