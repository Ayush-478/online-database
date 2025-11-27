"use client"
import path from 'path'
import FileManager from './fileManager'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { List, Table } from "lucide-react"
import AddNew from './addNew'
import { useState } from 'react'
import { ArrowBigLeft } from 'lucide-react'

interface ChildProps {
  query : string;
  setQuery : React.Dispatch<React.SetStateAction<string>>;
}

export default function Explorer( {query, setQuery} : ChildProps ){
  const [relativePath, setRelativePath] = useState("/")
  const [reload, setReload] = useState(true)

  function makeBreadcrumb(){
    const ancestorsClass = "bg-rose-950 cursor-pointer border-r-3 rounded-sm border-black sroll-m-20 text-2xl font-semibold pr-[0.4rem] pl-[0.4rem] tracking-tight"
    const currentClass = "underline bg-rose-950 rounded-sm cursor-pointer sroll-m-20 text-2xl font-semibold pr-[0.4rem] pl-[0.4rem] tracking-tight"
    const pathArray = relativePath.split("/").filter(Boolean)
    const current = pathArray.pop()
    let eleArray = pathArray.map((e : any)=>{
      return(
        <>
        <h4 className={ancestorsClass} data-name = {e} onClick = {(e : React.MouseEvent<HTMLHeadingElement>) => {
           const target = event.currentTarget;
          nav(target.dataset.name!, null)}}>
          {e}
        </h4>)
      <Separator className="ml-[0.25rem]" orientation="vertical"></Separator></>
    )})

    function nav(name : string | null, back : string | null){
      if(back){
        let str = ""
        pathArray.forEach((e : string)=> {str = path.join(str, e)})
        setRelativePath(str)
        setReload(true)
        return
      }
      if(name){
        let index = pathArray.indexOf(name)
        pathArray.splice(index+1)
        pathArray.forEach((e : string)=> {str = path.join(str, e)})
        setRelativePath(str)
        setReload(true)
      }
      else{
        setRelativePath("")
        setReload(true)
      }
    }
  return(<>
    <ArrowBigLeft size={34} className="mr-3 cursor-pointer" onClick = {()=> nav(null, true)} ></ArrowBigLeft>
    <h4 className={ancestorsClass} onClick = {() => nav(null,null)}>
      Home
    </h4>
    {eleArray}
    <Separator className="ml-[0.25rem]" orientation="vertical"></Separator>
    {(current) ? <h4 className={currentClass}>
    {current}
    </h4> : null}
  </>)
  }

  return(
    <div className="bg-rose-900 w-[82%] overflow-hidden h-[100%]">
      <div className="h-[8%] w-[100%] pl-[1.5%] pr-[1.5%] flex border items-center justify-between">
        <Tooltip>
          <TooltipTrigger>
            <div className="BREADCRUMB flex">
              {makeBreadcrumb()}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="bg-[#a0a0a0] text-[#000000] relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-bold">FilePath: Path to where you are in the directory</p>
          </TooltipContent>
        </Tooltip>
          <div className="NEWFILEADDER-TOGGLE flex">

          <DropdownMenu className= " hover:bg-neutral-700">
            <DropdownMenuTrigger className="font-bold text-lg h-[2.3rem] outline-none border-none w-[5rem] hover:bg-neutral-800 bg-neutral-800 pl-3 pr-3 rounded mt-auto mb-auto">New</DropdownMenuTrigger>
            <DropdownMenuContent className="bg-neutral-700 outline-none border-none hover:bg-neutral-700">
                <div className="w-[7rem] h-[7.75rem] bg-neutral-700 flex flex-col items-center justify-around">
                  <AddNew setReload = {setReload} relativePath = {relativePath}></AddNew>
                </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <ToggleGroup type="single" className="ml-2" value="table">
            <ToggleGroupItem value="list" className="border border-rose-950 border-2 border-r-0" aria-label="Toggle list">
              <List className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" className="border border-rose-950 border-2 border-l-0" aria-label="Toggle table">
              <Table className="h-5 w-5" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    <FileManager reload = {reload} setReload = {setReload} relativePath = {relativePath} setRelativePath = {setRelativePath} query = {query} setQuery = {setQuery}></FileManager>
  </div>
  )
}
