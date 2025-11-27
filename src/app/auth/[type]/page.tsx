
import "../../globals.css";
import Form from "./form";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import {sendContext} from './http'
let context;

export default async function Interface({params,}:{params : Promise<{ type : string}>}) {

  let context
  const type = (await params).type
  if(type == 'login'){
    context = "Login"
  }else if(type == 'register'){
    context = "Register"
  }else{
    return (<div className="bg-red-500 text-xl"> Error: 404, Endpoint not found.</div>)
  }

  return (
  <>
    <div className="flex flex-col h-lvh w-lvw bg-red-400 items-center">
      <div className="flex justify-center w-[100%]">
        <h1 className="mb-16 mt-8 relative left-[43%] text-xl bold">Welcome to {context}</h1>
        <div className="w-[20%] h-[25%] ml-auto flex items-center bg-green-300 justify-center">
          <Link  href="../../../">Go back to homepage</Link>
        </div>
      </div>
      <Form context={context} /> 
    </div>
  </>);
}
