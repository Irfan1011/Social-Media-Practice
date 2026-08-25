import { Card, CardFooter } from "@components/ui/card";

async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <Card className="sticky top-[12%]">
      <CardFooter>tes</CardFooter>
    </Card>
  );
}

export default Page;
