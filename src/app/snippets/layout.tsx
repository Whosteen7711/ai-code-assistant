import Navbar from './navbar'

type Props = {
  children: React.ReactNode
}
const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main className="m-auto max-w-7xl p-4">{children}</main>
    </>
  )
}
export default Layout
