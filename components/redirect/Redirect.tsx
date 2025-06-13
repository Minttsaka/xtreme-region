"use client"
import { setClientSession } from '@/lib/client-session'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const RedirectVercel = dynamic(() => import("./VercelRedirect"), { ssr: false })
export default function Redirect({id}:{id:string}) {

  const [user, setUser] = useState<null | Record<string, any>>(null)
  
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/public-user")
          const data = await res.json()
          setUser(data.user)
        } catch (err) {
          console.error("Failed to fetch user:", err)
          setUser(null)
        } 
      }    
  
    useEffect(() => {
      fetchUser()
  
      if (user) {

        setClientSession({
        id: user.id,
        name: user.name,
        email: user.email,
      })
       
      }
    }, [])

  return (
    <div>
      <RedirectVercel id={id} />
    </div>
  )
}

// const RedirectPage = dynamic(() => import("./RedirectPage"), { ssr: false })
// export default function Redirect({id}:{id:string}) {
//   return (
//     <div>
//       <RedirectPage id={id} />
//     </div>
//   )
// }
