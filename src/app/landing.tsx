"use client"

import supabase from '../config/supabase.js'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { redirect, RedirectType } from 'next/navigation'
import logo from './../../public/logo.svg'
import { useRef,useState,useEffect } from 'react'

export default function Landing({setAuth, blurClass, userInfo, setUserInfo}) {

  const hover = useRef(false)
  const [hoverClass, setHoverClass] = useState(false)
  const bgClass = "h-[89%] w-full flex-col flex items-center transition duration-1500 hover:bg-green-500 justify-evenly"
  const bgClassHover = "h-[89%] w-full flex-col flex items-center transition duration-1500 pointer-events-none hover:bg-green-900 justify-evenly"
  const headingClass = "h-[35%] leading-22 flex items-center text-red-100 w-[80%] text-[4.2rem] font-extrabold text-center font-mono tracking-tighter drop-shadow-[0_2.8px_2.8px_rgba(0,0,0,0.8)]"
  const headingClassHover = "h-[35%] leading-22 flex items-center text-red-100 w-[80%] text-[4.2rem] font-extrabold text-center font-mono tracking-tighter bg-black"

  function handleHover(){
    if (hover.current){
      hover.current = false
    }else{hover.current = true}
  }

  useEffect(()=>{
    if (hover.current){
      setHoverClass(true)
    }else{
      setHoverClass(false)
    }
  },[hover.current])

  async function handleLogout(){
    const { error } = await supabase.auth.signOut()
    setUserInfo({loggedIn : false, id : null})
  }

  return (
  <div className={`bg-black min-h-screen w-screen`}>
    <div className="PAGE-1 h-screen w-screen">
      <div className="dash flex flex-row bg-black h-[11%] w-screen border-b-1 border-zinc-700 drop-shadow-[0_5px_20px_rgba(0,0,0,0.8)]">
        <div className="flex w-[12%] mr-[8%] pb-[0.8%] h-full items-center justify-center">
          <Image src = {logo} style={{height: "3rem"},{width:"3rem"}} ></Image>
          <h5 className="text-slate-100 text-2xl font-bold"> Raft</h5>
        </div>
        <div className="flex w-[48%] ml-auto mr-auto items-center justify-center">
          <h5 className="mr-[5%] font-bold text-zinc-400 cursor-pointer">Solutions</h5>
          <h5 className="mr-[5%] font-bold text-zinc-400 cursor-pointer">Stack</h5>
          <h5 className="mr-[5%] font-bold text-zinc-400 cursor-pointer">About</h5>
        </div>
        <div className="flex w-[15%] mr-[4%] ml-[1%] items-center justify-around">
          <Button onClick={()=>{
              if(!userInfo.loggedIn){
                setAuth("Login")
              }else{
                handleLogout()
              }}} className="hover:text-zinc-800 text-zinc-200 cursor-pointer text-[125%] font-bold tracking-tighter" variant="ghost">{(userInfo.loggedIn)?"Log Out":"Login"}</Button>
          <Button variant="secondary" onClick={()=>{
              if(!userInfo.loggedIn){
                setAuth("Registration")
              }else{
                redirect('../dashboard/', RedirectType.push)
              }
            }} className="bg-green-500 cursor-pointer rounded-4xl"> <p className="text-white text-[135%] font-bold tracking-tighter hover:text-zinc-800">{(userInfo.loggedIn)?"Welcome, User":"Get Started"}</p></Button>
        </div>
      </div>
      <div className={(hoverClass) ? bgClassHover : bgClass}>
        <div className={headingClass} >Effortless Storage, Endless Possibilities for Data.
        </div>
        <div className="h-[12%] relative top-[-10%] flex items-center bg-black text-red-200 text-center w-[50%] font-extrabold font-serif leading-6 text-[1.33rem]">
          Elastic Scalability, Built for Modern Applications, Global Distribution, Effortlessly Transform Data into Decisions 
        </div>
        <Button onClick={()=>{
            if(!userInfo.loggedIn){
              setAuth("Registration")
            }else{redirect('../dashboard/', RedirectType.push)}
            }} onMouseEnter={handleHover} onMouseLeave={handleHover} className="h-[7%] transition duration-400 relative top-[-15%] hover:text-red-200 cursor-pointer bg-red-400 w-[15%] text-black text-2xl font-serif tracking-tight rounded-4xl font-bold drop-shadow-[1px_5px_5px_rgba(0,0,0,0.8)]">{(userInfo.loggedIn)?"Go To Files":"Get Started"}
        </Button>
      </div>
      <div className={`absolute inset-0 h-screen w-screen hidden ${blurClass}`} onClick={()=>{setAuth(false)}}></div>
    </div>
  </div>
);
}
