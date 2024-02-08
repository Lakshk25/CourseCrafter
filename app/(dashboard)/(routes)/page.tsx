import { UserButton } from "@clerk/nextjs";
 

// home page
export default function Home() {
  return (
    <div className="h-screen">
      <UserButton afterSignOutUrl="/"/>
    </div>
  )
}