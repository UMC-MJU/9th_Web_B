type Props = { navigate: (to: string) => void };

export default function About({ navigate }: Props) {
  return (
    <div>
      <h1>About</h1>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
}
