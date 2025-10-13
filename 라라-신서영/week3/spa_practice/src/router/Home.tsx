type Props = { navigate: (to: string) => void };

export default function Home({ navigate }: Props) {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => navigate('/about')}>Go About</button>
    </div>
  );
}
