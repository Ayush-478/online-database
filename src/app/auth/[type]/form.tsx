"use client";

import "../../globals.css";
import {useRef, useState} from 'react'
import {Authentication} from './api'
import { redirect, RedirectType } from 'next/navigation'

export default function Form(props : any) {

  const nameRef = useRef()
  const passRef = useRef()
  const [formOutput, setFormOutput] = useState(null)

  async function handleSubmit(){      //HANDLE FORM VALIDATION
    if(!nameRef.current || !passRef.current){
      setFormOutput("null is not a valid input")
      return
    }
    let response = await Authentication({username : nameRef.current!.value, pass : passRef.current!.value}, props.context)
    setFormOutput(response.message)
    if (response.ok){
      redirect('../../../', RedirectType.push)
    }
  }

  return (
    <div className="main h-3/6 w-3/5 flex flex-col bg-blue-200 justify-center items-center">
      <div className="flex justify-around items-center bg-violet-500 h-[30%] w-[90%]">
        <h4 className="text-lg">Name </h4>
        <input ref={nameRef} type="text" placeholder="Name" />
      </div>
      <br />
      <div className="flex justify-around items-center bg-violet-500 h-[30%] w-[90%]">
        <h4 className="text-lg">Password: </h4>
        <input ref={passRef} type="password" placeholder="Password" />
      </div>
      <button className="bg-pink-500 relative top-4 w-20 h-8" onClick={handleSubmit}>Submit</button>
      <div className="bg-green-300 mt-8 text-lg">{formOutput}</div>
    </div>
  );
}
