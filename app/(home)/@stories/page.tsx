// import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";

async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stories</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4 overflow-x-scroll scrollbar-none">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full cursor-pointer min-w-25 min-h-25"
        >
          <Link href="">
            <Plus />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full cursor-pointer min-w-25 min-h-25 relative"
        >
          {/* <Image src="" alt="tes" fill className="rounded-full border p-4" /> */}
        </Button>
      </CardContent>
    </Card>
  );
}

export default Page;
