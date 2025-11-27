"use client"

import {useState, useRef, useEffect} from 'react'
import folderIcon from '../../../public/icons/folder-alt-svgrepo-com.svg'
import getFileTree from './fileTreeAPI'
import Image from 'next/image'

const sampleJson = {
  root: {
    index: 'root',
    isFolder: true,
    children: ['dad', 'mom'],
    expand: true,
  },
  dad: {
    index: 'dad',
    isFolder: false,
    children: [],
  },
  mom: {
    index: 'mom',
    isFolder: true,
    children: ['child'],
    expand: true,
  },
  child : {
    index: 'child',
    isFolder: false,
    children: [],
  },
}

export default function FileTree() {

  const [listItems, setListItems] = useState([])
  const fileJson = useRef({})

  useEffect(()=>{
    (async()=>{
      let response = await getFileTree()
      if (response.ok){
        let data = await response.json()
        fileJson.current = data
      }
      renderTree(fileJson.current)
    })()
  },[])

  function newFolder(name : string, i : any){
    return(
      <button key={i} data-index={name} onClick={swtichExpand} className="bg-muted flex relative rounded px-[0.3rem] py-[0.2rem] mb-[0.3rem] font-mono text-sm font-semibold hover:underline">
        <Image src={folderIcon} style={{height: "1rem"},{width: "1rem"}} className="mr-2" ></Image>
        {name}
      </button>
    )
  }

  function newFile(name : string, i : any){
   return(
      <button key={i} className="text-muted-foreground rounded bg-gray-800 mb-[0.3rem] inline text-sm cursor-pointer px-[0.3rem] py-[0.2rem] font-mono hover:underline">
        -{name}
      </button>
    )
  }

  function swtichExpand(ev : any){
    let index = ev.currentTarget.dataset.index
    if(fileJson.current[index].expand){
      fileJson.current[index].expand = false
    }else{
     fileJson.current[index].expand = true
    }
    renderTree(fileJson.current)
  }

  function renderTree(treeJson : any) {
    let skip = [];
    setListItems([])
    function skipSubDirectories(root){
      if(treeJson[root].isFolder){
        if(treeJson[root].children && (treeJson[root].children).length > 0){
          treeJson[root].children.forEach((item)=> skipSubDirectories(item))
        }
      }
      skip.push(root)
    }
    Object.keys(treeJson).forEach((key : string, i : number) => {
      if (!skip.find((item) => item == treeJson[key].index)) {
        if (treeJson[key].isFolder) {
          if (!treeJson[key].expand) {
            skipSubDirectories(treeJson[key].index)
          }
          setListItems((p) => [...p, newFolder(treeJson[key].index, i)]);
        } else {
          setListItems((p) => [...p, newFile(treeJson[key].index, i)]);
        }
      }
    });
  }

  return (
    <div className="listContainer w-[18%] h-[100%] ">
      <div className="border flex items-center w-[100%] h-[5%] mb-[0.5rem]">
        <code className=" relative rounded px-[0.3rem] py-[0.2rem] mr-[auto] font-mono text-sm font-semibold">
          FileTree
        </code>
        <button className="border relative rounded-4xl px-[0.5rem] py-[0.2rem] mr-[0.2rem] font-mono text-sm font-black">
        -
        </button>
        <button className="border relative rounded-4xl px-[0.5rem] py-[0.2rem] mr-[0.2rem] font-mono text-sm font-black">
         +
        </button>
      </div>
      <div className="LIST w-[90%] flex items-start justify-start p-[2rem],">
        <ul className="pl-[0.5rem] w-[100%] ">
          {listItems}
        </ul>
      </div>
    </div>
  )
}
