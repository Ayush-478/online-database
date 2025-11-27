"use client"
import getJWT from './getJWT.tsx'
import supabase from '../../config/supabase.js'
import { Button } from "@/components/ui/button"
import getUser from '../auth/[type]/getCookie.tsx'
import { useRef, useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function AddNew({setReload, relativePath}){

  const uploadFile = useRef(null)

  const getTypeJSON = {
    doc: {type: "docs"},
    docx: {type: "docs"},
    pdf: {type: "pdf"},
    txt: {type: "text"},
    rtf: {type: "text"},
    odt: {type: "text"},
    xls: {type: "spreadsheet"},
    xlsx: {type: "spreadsheet"},
    csv: {type: "spreadsheet"},
    ods: {type: "spreadsheet"},
    ppt: {type: "ppt"},
    pptx: {type: "ppt"},
    odp: {type: "ppt"},
    jpeg: {type: "image"},
    jpg: {type: "image"},
    png: {type: "image"},
    svg: {type: "image"},
    gif: {type: "image"},
    bmp: {type: "image"},
    webp: {type: "image"},
    mp3: {type: "audio"},
    ogg: {type: "audio"},
    aac: {type: "audio"},
    m4a: {type: "audio"},
    flac: {type: "audio"},
    wav: {type: "audio"},
    mp4: {type: "video"},
    webm: {type: "video"},
    avi: {type: "video"},
    mkv: {type: "video"},
    mov: {type: "video"},
    m4v: {type: "video"},
    flv: {type: "video"},
    zip: {type: "archive"},
    rar: {type: "archive"},
    tar: {type: "archive"},
    "7-zip": {type: "archive"},
    js: {type: "code"},
    ts: {type: "code"}, 
    jsx: {type: "code"},
    tsx: {type: "code"},
    css: {type: "code"},
    html: {type: "code"},
    json: {type: "code"},
    xml: {type: "code"}
  }

  async function handleNewFolder(){
    const jwt = await getJWT()
    let response = await fetch("http://localhost:5000/crud/newfolder", {
    method : "POST",
    body: JSON.stringify({location : relativePath}),
    headers: {
      "Authorization" : `Bearer ${jwt}`,
      "Content-Type" : "application/json",
      "Accept" : "application/json"
    },
    credentials : "include",
    })
    if (response.ok){
      setReload(true)
    }
  }

  async function handleFileUpload(e){
    try{
      const file = e.target.files[0]
      const extension = file.name.split(".").pop().toLowerCase();
      if(!file || !Object.keys(getTypeJSON).includes(extension)){
        throw new Error("File type not allowed.")}
      const jwt = await getJWT()
      const {data : {user}} = await supabase.auth.getUser()
      const fileName = file.name
      console.log(fileName)
      let dirPath = (relativePath == "/") ? (user.id + "/" + fileName) : (user.id + relativePath + "/" + fileName)

      const { data, error } = await supabase.storage.from('user-data').upload(dirPath, file)
      if(error){throw new Error(error.message)}

      const res = await fetch("http://localhost:5000/crud/newfile", {
        method : "POST",
        body: JSON.stringify({name : file.name, size : file.size, type : getTypeJSON[extension].type, location : relativePath}),
        headers: {
          "Authorization" : `Bearer ${jwt}`,
          "Content-Type" : "application/json",
          "Accept" : "application/json"
        },
        credentials : "include",
      })
      if(res.ok){
        setReload(true)
      }else{
        const { data, error } = await supabase.storage.from('user-data').remove([dirPath])
        throw new Error(`File upload was hella unsuccessful, res.code : ${res.status}`)
      }
    }catch(err){
      console.log(err.message) //Make this toast later
    }
  }

  function handleNewFile(){}
  return(
    <>
      <Button onClick={()=>{uploadFile.current.click()}} className="w-[98%] font-semibold" variant="" >Upload File</Button>
      <input ref={uploadFile} type="file" onChange={(e)=>{handleFileUpload(e)}} className="hidden" variant="" ></input>
    <Button className="w-[98%] font-semibold" variant="">
      <DropdownMenu>
        <DropdownMenuTrigger className= "" onClick = {handleNewFile}>New File</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Word Document</DropdownMenuItem>
          <DropdownMenuItem>Note</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Button>
    <Button onClick={handleNewFolder} className="w-[98%] font-semibold" variant="" >New Folder</Button>
    </>
  )
}
