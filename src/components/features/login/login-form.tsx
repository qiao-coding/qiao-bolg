import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/shadcnComponents/data-display/card"
import Image from 'next/image'
import { SignIn } from "../auth/Github_signIn"
import { motion } from 'framer-motion'



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {






  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8 flex flex-col gap-6 items-center text-center">
            <h1 className="text-2xl font-bold">登录</h1>
            <motion.div
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="w-full  "
            >
              <SignIn />
            </motion.div>
          </div>

          <div className="bg-muted relative hidden md:block">
            <Image
              src='/loginImage/LoginForm.jpg'
              alt="Image"
              width={500}
              height={500}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
