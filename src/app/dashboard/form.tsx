
import {promises as fs} from 'fs'
import {existsSync} from 'fs'
import getUser from '../auth/[type]/getCookie'
import { createClient } from '@supabase/supabase-js'

export default function CrudForm(){

  // Create Supabase client
  const supabase = createClient('your_project_url', 'your_supabase_api_key')

  // Upload file using standard upload
  async function uploadFile(file : any) {
    const { data, error } = await supabase.storage.from('bucket_name').upload('file_path', file)
    if (error) {
      // Handle error
    } else {
      // Handle success
    }
  }
  async function action(formData : any){
    "use server";
    const file = formData.get("file") as File
    console.log(file)
    let user;
    try{
      user = await getUser()
      console.log(user)
      const data = await file.arrayBuffer()
      if(!existsSync(`./storage/${user}`)){
        await fs.mkdir(`./storage/${user}`)
      }
      await fs.writeFile(`./storage/${user}/${file.name}`, Buffer.from(data))
    }catch(err){console.log(err)}
  }

  return(
  <form action={action}  >
      <label  className="bg-yellow">Get File:    </label> <br />
      <input type="file" name="file" className="bg-burgundy" /> <br />
      <button>Upload</button>
  </form>
  )
}
