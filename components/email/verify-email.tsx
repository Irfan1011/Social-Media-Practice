type verifyEmailProps = {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
  url: string;
};

function verifyEmail({ user, url }: verifyEmailProps) {
  return (
    <article>
      <h2 style={{fontWeight: 'bold', textAlign: "center"}}>Verify Your Email Address</h2>
      <p>
        Hi {user.name} Welcome to Social Media NextJs App, created by Irfan
        July 2026. Please click the button down below to verify your email
      </p>
      <button style={{border: 'none', borderRadius: '15px', width: '100px', height: '33px', cursor: 'pointer', background: '#1447e6', color: 'white'}}>
        <a href={url} style={{textDecoration: 'none', color: 'black', fontWeight: 'bold'}}>Verify</a>
      </button>
      <p>If the button doen't work, try use this url:</p>
      <a href={url}>{url}</a>
      <p style={{fontSize: '12px', color: '#b2b6a7'}}>
        This email was send automaticly on purpose to verify your email address.
        If this action is not triggered by you, you can safely ignore this
        email.
      </p>
    </article>
  );
}

export default verifyEmail;
