import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookImagesCard({ images }: { images: string[] }) {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Book Images</CardTitle>
        <p className="text-sm text-muted-foreground">Images of your product.</p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {images.slice(0, 2).map((src, idx) => (
            <div
              key={src}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
            >
              <Image
                src={src}
                alt={`Book image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, 100vw"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
