"use client"
import getJWT from './getJWT'
import Image from 'next/image'
import fetchImage from './fetchImage'
import { Button } from "@/components/ui/button"
import path from 'path'
import supabase from '../../config/supabase.js'
import '../../app/globals.css'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EllipsisVertical } from 'lucide-react';
import docsIcon from '../../../public/icons/document-svgrepo-com.svg'
import pdfIcon from '../../../public/icons/pdf-document-svgrepo-com.svg'
import textIcon from '../../../public/icons/notebook-svgrepo-com.svg'
import spreadsheetIcon from '../../../public/icons/spreadsheet-svgrepo-com.svg'
import pptIcon from '../../../public/icons/presentation-svgrepo-com.svg'
import imageIcon from '../../../public/icons/picture-svgrepo-com.svg'
import archiveIcon from '../../../public/icons/briefcase-svgrepo-com.svg'
import videoIcon from '../../../public/icons/video-player-svgrepo-com.svg'
import audioIcon from '../../../public/icons/music-player-svgrepo-com.svg'
import codeIcon from '../../../public/icons/code-svgrepo-com.svg'
import otherIcon from '../../../public/icons/unknown-svgrepo-com.svg'
import folderIcon from '../../../public/icons/folder-svgrepo-com (1).svg'
import {useState, useEffect, useRef} from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const getTypeIcon = {
  folder:{icon:folderIcon},
  doc:{icon:docsIcon},
  pdf:{icon:pdfIcon},
  text:{icon:textIcon},
  spreadsheet:{icon:spreadsheetIcon},
  ppt:{icon:pdfIcon},
  image:{icon:imageIcon},
  video:{icon:videoIcon},
  audio:{icon:audioIcon},
  archive:{icon:archiveIcon},
  code:{icon:codeIcon},
  other:{icon:otherIcon}
}

interface ObjectProps{
  reload : boolean;
  setReload : React.Dispatch<React.SetStateAction<boolean>>;
  relativePath : string;
  setRelativePath : React.Dispatch<React.SetStateAction<string>>;
  query : string;
  setQuery : React.Dispatch<React.SetStateAction<string>>;
}

interface FileItem{
  [key : string] : any;
}

export default function FileManager({reload, setReload, relativePath, setRelativePath, query, setQuery} : ObjectProps){
  const [displayMode, setDisplayMode] = useState(false)
  const [displayImageProps, setDisplayImageProps] = useState<{[key : string] : any}>({})
  const [allFiles, setAllFiles] = useState<FileItem[]>([])
  const [renderedFiles, setRenderedFiles] = useState<(JSX.Element | undefined)[]>([])
  const [, offlineReload] = useState(0)
  const [selectedArray, setSelectedArray] = useState<string[]>([])

  useEffect(()=>{
    (async()=>{
      if(reload){
        let jwt = await getJWT()
        let response = await fetch("http://localhost:5000/crud/", {
        method : "POST",
        body: JSON.stringify({ location : relativePath}),
        headers: {
          "Authorization" : `Bearer ${jwt}`,
          "Content-Type" : "application/json",
          "Accept" : "application/json"
        },
        credentials : "include",
        })
        if (response.ok){
          let data = await response.json()
          setAllFiles(d => data)
          setReload(false)
        }
      }
    })()
  },[reload, relativePath])

  //search query thingy
  useEffect(()=>{
    setAllFiles(prev => prev.map((e : any) => ({...e, display: e.name.startsWith(query)})))
    offlineReload(pr => pr+1)
  },[query])

  useEffect(()=>{
    let files = [];
    (async () => {
      for (const file of allFiles) {
        if (file.display) {
          if (file.type === "folder") {
            files.push(makeFolderElement(file.type, file.name, file.path, false));
          } else {
            files.push(await makeFileElement(file.type, file.name, file.path));
          }
        }
      }
      setRenderedFiles(files)
      }
    )()
  },[allFiles, selectedArray])
  
  async function handleDelete(e : React.MouseEvent<HTMLButtonElement>){
    let location = e.currentTarget.dataset.path
    let jwt = await getJWT()
    let response = await fetch(`http://localhost:5000/crud/`, {
    body: JSON.stringify({ location : location }),
    method : "DELETE",
    headers: {
      "Authorization" : `Bearer ${jwt}`,
      "Content-Type" : "application/json",
      "Accept" : "application/json"
    },
    credentials : "include",})
    if (response.ok){
      setReload(true)
    }
  }

  function handleUnselect(e : React.MouseEvent<HTMLDivElement>){
    if (e.currentTarget.dataset.name == "FileManager"){
      setSelectedArray(p => [])
      offlineReload(e => e+1)
    }
  }

  function handleSelected(e : React.MouseEvent<HTMLDivElement>){
    let name = e.currentTarget.dataset.name
    if(!name){
      return
    }
    let index = selectedArray.indexOf(name)
    if(index > -1){
      setSelectedArray(p => p.filter((e,i) => i != index))
    }else{
      setSelectedArray(p => [...p, name])
    }
    offlineReload(x => x+1)
  }
  
  async function handledDoubleClick(e : React.MouseEvent<HTMLDivElement>){
    let name = e.currentTarget.dataset.name
    let location = e.currentTarget.dataset.path
    //FIGURE OUT NAMING INCONSISTENCIES
    if(!name || !location){
      return
    }
    if (name.indexOf(".") < 0){
      setRelativePath(e => path.join(e, location))
      setReload(true)
    }else{handleOpenFile(location)}
  }

  async function handleOpenFile(location : string){
    if(!location){
      return
    }
    let obj = await getImage(location)
    if(!obj){return}
    let {image, bitmap} = obj
    setDisplayImageProps(p => ({src : image, width : bitmap.width, height : bitmap.height}))
    setDisplayMode(true)
  }

  async function getImage(location : string){
    //let res = await fetchImage(location)
    if(!location){
      return
    }
    const { data : { user } } = await supabase.auth.getUser()
    if(!user){return}
    const { data, error } = await supabase.storage.from('user-data').download(`${user.id}/${location}`)
    if(!data){return}
    const bitmap = await createImageBitmap(data)
    const image = URL.createObjectURL(data)
    return {image, bitmap}
  }
  
  function closeDisplayMode(){
    setDisplayMode(false)
    setDisplayImageProps(p => ({}))
  }

  function makeFolderElement(type : string, name : string, location : string, hidden : boolean){
    if(!type || !name || !location || !hidden){
      return
    }
    let icon = null as string | null;
    Object.keys(getTypeIcon).forEach((key, i) => {
      if(key===type){
        icon = getTypeIcon[key].icon
      }
    })

    return(
      <div className = {(hidden) ? "TRANSPARENT-COVER rounded-sm hover:brightness-120 hidden" : "TRANSPARENT-COVER rounded-sm hover:brightness-120"} data-name = {name} data-path = {location} onDoubleClick= {(e) => {handledDoubleClick(e)}} onClick = {(e) => handleSelected(e)} >
      <Card className = {selectedArray.includes(name) ? "Card bg-blue-700" : "Card"} >
        <CardHeader className="CardHeader">
          <div>
            <Image src={icon} style={{height:"1.6rem"},{width:"1.6rem"}} ></Image>
            <h4>{name}</h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="FILE-OPTIONS outline-none border-none"> 
              <div className=" button-cont rounded-md w-[2rem] h-[2rem] flex items-center justify-center bg-neutral-700 ">
                <EllipsisVertical className="bold"></EllipsisVertical>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-red-600 font-bold " data-path = {location} onClick = {(e : React.MouseEvent<HTMLDivElement>) => handleDelete(e)} >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>
      </div>
  )}

  async function makeFileElement(type : string, name : string, location : string){
    if(!type || !name || !location || !hidden){
      return
    }
    let icon = null as null | string;
    let {image} = await getImage(location)
    Object.keys(getTypeIcon).forEach((key, i) => {
      if(key===type){
        icon = getTypeIcon[key].icon
      }
    })
    return(
      <div className = "TRANSPARENT-COVER rounded-sm hover:brightness-120" data-name = {name} data-path = {location} onDoubleClick= {(e) => {handledDoubleClick(e)}} onClick = {(e) => handleSelected(e)} >
      <Card className = {selectedArray.includes(name) ? "Card bg-blue-700" : "Card items-center gap-0"} >
        <CardHeader className="CardHeader">
          <div>
            <Image src={icon} style={{height:"1.6rem"},{width:"1.6rem"}} ></Image>
            <h4>{name}</h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="FILE-OPTIONS outline-none border-none"> 
              <div className=" button-cont rounded-md w-[2rem] h-[2rem] flex items-center justify-center bg-neutral-700 ">
                <EllipsisVertical className="bold"></EllipsisVertical>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-red-600 font-bold " data-path = {location} onClick = {(e) => handleDelete(e)} >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <Image src={image} height={100} width={100} className="THUMBNAIL items-center justify-center bg-black h-[75%] w-[95%] relative top-[0.2rem] rounded-lg"></Image>
      </Card>
      </div>
  )}

  const displayModeClass = "absolute h-full z-4 w-full bg-[rgba(0,0,0,0.5)] left-0 right-0 top-0 flex items-center justify-center"
  return(
  <>
    <div className = {displayMode ? displayModeClass : "hidden"} onClick = {closeDisplayMode}>
        {<img src={displayImageProps.src} width={displayImageProps.width} height={displayImageProps.height} className="z-5"></img>}
    </div>
    <div className="FileManager" data-name = {"FileManager"} onClick={(e) => handleUnselect(e)}>
    {/*
      <Card className="Video pb-2 pt-1 pl-0 pr-0 w-[30%] h-[35%] max-h-[40%] max-w-[30%] shadow-xl inset-shadow-sm ring-1 ring-black shadow-black hover:bg-black">
          <CardHeader className="h-[25%] w-full p-4 pr-2 border-b-1 flex items-center justify-between">
            <div className="IMAGE-NAME flex items-start">
              <Image src={imageIcon} style={{height:"1.6rem"},{width:"1.6rem"}} ></Image>
              <h4 className="scroll-m-20 ml-3 text-xl font-semibold tracking-tight">
                Image.img
              </h4>
            </div>
            <Button variant="secondary" className="bg-transparent">
              <EllipsisVertical className="bold"></EllipsisVertical>
            </Button> 
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
    */}
      {renderedFiles}
    </div>
  </>
  )
}
