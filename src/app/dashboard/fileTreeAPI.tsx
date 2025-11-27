import getJWT from './getJWT'

export default async function getFileTree(){
  const jwt = await getJWT()
  let response = await fetch(`http://localhost:5000/crud/json`, {
    method : "GET",
    headers: {
      "Authorization" : `Bearer ${jwt}`,
      "Content-Type" : "application/json",
      "Accept" : "application/json"
    },
    credentials : "include",})
  return response
}
