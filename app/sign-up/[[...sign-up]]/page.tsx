import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return(
    <div className="relative h-screen w-full">
      <div className="w-1/2 flex items-center justify-center mx-auto py-14"><SignUp/></div>
    </div>
  );
}