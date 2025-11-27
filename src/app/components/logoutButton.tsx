"use client";

import Link from 'next/link'


export default function LogoutButton(){
  return (
  <div>
    <button className="bg-red-200 ml-4">Logout</button>
    <Link href="../dashboard/" className="bg-red-200 ml-4">Go to Files</Link>
  </div>
)}
