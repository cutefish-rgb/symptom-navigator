import Image from "next/image";
import Link from "next/link";
import type { BodyPart } from "@/types/bodyPart";

type BodyMapProps = {
  bodyParts: BodyPart[];
};

export function BodyMap({ bodyParts }: BodyMapProps) {
  return (
    <section className="body-map-section" aria-labelledby="body-map-title">
      <div className="section-heading">
        <p className="eyebrow">選擇不舒服的位置</p>
        <h2 id="body-map-title">從身體部位開始找</h2>
      </div>
      <div className="body-map-layout">
        <div className="body-figure" aria-hidden="true">
          <Image src="/images/body-front.svg" alt="" width={260} height={520} priority />
        </div>
        <div className="body-part-grid">
          {bodyParts.map((bodyPart) => (
            <Link className="body-part-link" href={`/body-part/${bodyPart.slug}`} key={bodyPart.id}>
              <span>{bodyPart.name}</span>
              <small>{bodyPart.description ?? `查看${bodyPart.name}相關症狀`}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
