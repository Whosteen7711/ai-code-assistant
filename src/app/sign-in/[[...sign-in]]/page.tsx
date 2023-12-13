import { SignIn } from '@clerk/nextjs'

type Props = {}
const SignInPage = (props: Props) => {
  return (
    // allow div to take up entire screen
    // center sign in form
    <div className="flex h-screen items-center justify-center">
      <SignIn appearance={{ variables: { colorPrimary: '#0F172A' } }} />
    </div>
  )
}
export default SignInPage
