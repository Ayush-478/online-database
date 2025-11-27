"use client"
import { Input } from "@/components/ui/input"
import getJWT from './dashboard/getJWT.tsx'
import { redirect, RedirectType } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Landing from './landing.tsx'
import validator from 'validator'
import { useState,useRef,useEffect } from 'react'
import supabase from '../config/supabase.js'

export default function Home() {
  const [auth, setAuth] = useState(false)
  const [userInfo, setUserInfo] = useState({loggedIn : false, id : null})
  const email = useRef(null)
  const password = useRef(null)
  const formInfo = useRef(null)
  const blurClass = "transition-color duration-1500 hover:bg-black/60 !block"
  const formClass = "absolute inset-0 m-auto flex items-center justify-center top-[-5%] bg-neutral-900 h-[35vh] w-[27vw] scale-100 transition-transform rounded-3xl duration-300 "

  //CHECKING IF LOGGED IN
  useEffect(()=>{
    (async()=>{
      const { data : { user } } = await supabase.auth.getUser()
      if(user){
        setUserInfo({loggedIn : true, id : user.id})
      }
    })()
  },[])
  
  function isValid(){
    if(validator.isEmail(email.current.value)){
      return true
    }else{
      formInfo.current.textContent = "Not an Email"
    }
    return false
  }
  async function handleSubmit(){
    if(isValid()){
      submitForm()
    }
  }

  async function submitForm(){      //HANDLE FORM VALIDATION
    let error = null
    //let response = await Authentication({username : username.current.value, pass : password.current.value}, auth)
    if(auth == "Registration"){
      formInfo.current.textContent="Adding User, Please wait.."
      const { data, error } = await supabase.auth.signUp({
        email: email.current.value,
        password: password.current.value,
      })
      if(!error){
        redirect('../dashboard/', RedirectType.push)
      }
    }else if(auth == "Login"){
      formInfo.current.textContent="Logging User, Please wait.."
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email: email.current.value,
        password: password.current.value,
      })
      if(!error){
        const { data : { user } } = await supabase.auth.getUser()
        setUserInfo({loggedIn : true, id : user.id})
        if(user && user.email_confirmed_at){
          const jwt = await getJWT()
          let res = await fetch('http://localhost:5000/users/login',{
            method : "GET",
            headers: {
              "Authorization" : `Bearer ${jwt}`,
              "Content-Type" : "application/json",
              "Accept" : "application/json"
            },
          })
          let cat = await fetch(`http://localhost:5000/users/cat`,{
            method : "GET",
            headers: {
              "Authorization" : `Bearer ${jwt}`,
            },
            credentials : "include",
          })
          if(cat.status == 200){
            const blob = await res.blob()
            const { data, error } = await supabase.storage.from('user-data').upload(`${user.id}/cat.jpg`, blob, {upsert : false})
            if(error){console.log(error)}
          }
          if(res.status == 200){
            redirect('../dashboard/', RedirectType.push)
          }else{
            formInfo.current.textContent = await res.text()
          }
        }
      }
    }
    if(error){
      formInfo.current.textContent= error
    }
  }

  return(
    <>
      <Landing setAuth={setAuth} userInfo={userInfo} setUserInfo={setUserInfo} blurClass={(!auth)? "" : blurClass}></Landing>
      <div className={(!auth)? "scale-0": formClass}>
        <div className={(!auth)? "hidden" : " h-full w-full border-1 border-zinc-800 rounded-3xl p-4 flex flex-col items-center bg-black"}>
          <h2 className=" scroll-m-20  pb-2 mb-[9%] mt-[1%] text-2xl font-semibold tracking-tight first:mt-0 text-white">
          {auth}
          </h2>
          <Input ref={email} type="email" placeholder="Email" className="mb-4 w-[76%] border-1 border-zinc-700 text-white font-bold bg-zinc-900"/>
          <div className="flex flex-row w-[76%] justify-center">
            <Input ref={password} type="password" placeholder="Password" className="mb-4 w-[70%] mr-[3%] border-1 border-zinc-700 text-white font-bold bg-zinc-900 "/>
            <Button type="submit" variant="outline" onClick={handleSubmit} className="w-[27%]">
            Submit 
            </Button>
          </div>
            <div className="bg-black text-red-800 font-bold" ref={formInfo}></div>
        </div>
      </div>
    </>
  )
}
