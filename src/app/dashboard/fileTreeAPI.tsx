import getJWT from './getJWT'

export default async function getFileTree(){
  const jwt = await getJWT()
  let response = await fetch(`https://server-for-online-database.onrender.com/crud/json`, {
    method : "GET",
    headers: {
      "Authorization" : `Bearer ${jwt}`,
      "Content-Type" : "application/json",
      "Accept" : "application/json"
    },
    credentials : "include",})
  return response
}
