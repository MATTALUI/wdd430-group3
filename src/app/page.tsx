export default async function Home() {
  return (
    <div>
      Group 3 {process.env.POSTGRES_DATABASE}
    </div>
  );
}
