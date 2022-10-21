/* eslint-disable @next/next/no-img-element */
const Layout = ({ children }) => {
  return (
    <div
      className="w-100 vh-100 d-inline-flex flex-column justify-content-center"
      style={{
        backgroundImage: 'url("/img/game-background.png")',
        backgroundSize: 'cover',
      }}
    >
      <div className="main-content">{children}</div>
    </div>
  )
}

export default Layout
