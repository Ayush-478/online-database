
import getJWT from '../dashboard/getJWT'

export default async function fetchImage(location : string){
  const jwt = await getJWT()
  let path = location.replace(/[/]/g, "_")
  let response = await fetch(`https://server-for-online-database.onrender.com/crud/image/${path}`, {
    method : "GET",
    headers: {
      "Authorization" : `Bearer ${jwt}`,
      "Content-Type" : "application/json",
      "Accept" : "application/json"
    },
    credentials : "include",
  })
  return response
}
