type FollowLayoutProps = {
  modal: React.ReactNode;
  children: React.ReactNode;
};

function FollowLayout({ modal, children }: FollowLayoutProps) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}

export default FollowLayout;
