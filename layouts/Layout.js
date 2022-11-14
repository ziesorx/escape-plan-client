/* eslint-disable @next/next/no-img-element */
import Sound from 'react-sound'

const Layout = ({ children }) => {
  return (
    <div
      className="w-100 vh-100 d-inline-flex flex-column justify-content-center"
      style={{
        backgroundImage: 'url("/img/city-bg.gif")',
        backgroundSize: 'cover',
      }}
    >
      <Sound
        url="/audio/run-soundtrack.mp3"
        playStatus={Sound.status.PLAYING}
        loop
        autoLoad
      />

      {children}
    </div>
  )
}

export default Layout
