"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import logo from '../../../public/logo.svg'
import Link from "next/link";
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Search, House, Info, Users, PartyPopper } from 'lucide-react';

interface ObjectProps{
  query : string;
  setQuery : React.Dispatch<React.SetStateAction<string>>;
}

export default function NavMenu({query, setQuery} : ObjectProps){
  function handleSearch(e : any){
    setQuery(e.target.value)
  }
  return(
    <div className="w-[100%] h-[9%] flex">
        <div className="LOGO h-[100%] w-[18%] flex items-center justify-start pl-[1.4%]">
          <Link href="/">
            <Image src={logo} style={{height: "3.2rem"},{width:"3.2rem"}} ></Image>
          </Link>
        </div>
      <div className="h-[100%] w-[64%] flex items-center justify-center">
        <div className="HOUSE mr-2 bg-neutral-900 h-11 w-11 flex items-center justify-center rounded-lg">
          <Link href="/">
            <House className="h-8 w-8"></House>
          </Link>
        </div>
        <div className="SEARCHBAR h-[75%] w-[56%] flex items-center justify-start rounded-4xl bg-zinc-800 pl-3">
          <Search className="h-7 w-7 mr-2" color="#a0a0a0"></Search>
          <Input onInput = {(e) => handleSearch(e)} className="h-[100%] rounded-4xl border-none text-3xl font-medium" type="text" placeholder="What files are you looking for?"></Input>
        </div>
      </div>
      <div className="PROFILE w-[18%] h-[100%] flex flex-row-reverse pr-[1rem] items-center">
        <Avatar className="ml-[0.5rem] w-[2.3rem] h-[2.3rem]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Users className="mr-5" color="#a0a0a0"></Users>
        <PartyPopper className="mr-5" color="#a0a0a0"></PartyPopper>
        <Info className="mr-18" color="#a0a0a0"></Info>
      </div>
  </div>
  )
}

