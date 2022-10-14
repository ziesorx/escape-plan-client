/* eslint-disable @next/next/no-img-element */
const Layout = ({ children }) => {
  return (
    <div
      className="w-100 vh-100 d-inline-flex flex-column justify-content-center"
      style={{
        backgroundImage:
          'url("https://s2s-media-files-development.s3.ap-southeast-1.amazonaws.com/bg/space-bg.jpg")',
        backgroundSize: 'cover',
      }}
    >
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
