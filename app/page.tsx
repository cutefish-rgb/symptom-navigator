import Image from "next/image";
import Link from "next/link";
import { getBodyParts } from "@/lib/data";

const markers: Record<string, { top: string; left: string }> = {
  head: { top: "12%", left: "50%" },
  eyes: { top: "15%", left: "50%" },
  ears: { top: "15%", left: "37%" },
  nose: { top: "18%", left: "50%" },
  throat: { top: "23%", left: "50%" },
  chest: { top: "33%", left: "50%" },
  abdomen: { top: "47%", left: "50%" },
  back: { top: "38%", left: "70%" },
  joints: { top: "66%", left: "36%" },
  skin: { top: "74%", left: "66%" },
  urinary: { top: "57%", left: "50%" },
  liver: { top: "43%", left: "44%" },
  heart: { top: "34%", left: "43%" },
  neuro: { top: "11%", left: "62%" },
  ortho: { top: "63%", left: "24%" }
};

const hotspots: Record<string, { top: string; left: string; width: string; height: string }> = {
  head: { top: "9%", left: "42%", width: "16%", height: "12%" },
  eyes: { top: "13%", left: "44%", width: "12%", height: "4%" },
  ears: { top: "13%", left: "34%", width: "32%", height: "6%" },
  nose: { top: "15%", left: "46%", width: "8%", height: "5%" },
  throat: { top: "21%", left: "44%", width: "12%", height: "5%" },
  chest: { top: "28%", left: "37%", width: "26%", height: "13%" },
  abdomen: { top: "41%", left: "39%", width: "22%", height: "14%" },
  back: { top: "29%", left: "64%", width: "13%", height: "20%" },
  joints: { top: "58%", left: "30%", width: "40%", height: "16%" },
  skin: { top: "64%", left: "60%", width: "14%", height: "22%" },
  urinary: { top: "52%", left: "42%", width: "16%", height: "10%" },
  liver: { top: "38%", left: "39%", width: "16%", height: "10%" },
  heart: { top: "30%", left: "39%", width: "12%", height: "9%" },
  neuro: { top: "9%", left: "42%", width: "16%", height: "12%" },
  ortho: { top: "57%", left: "25%", width: "50%", height: "30%" }
};

export default async function HomePage() {
  const bodyParts = await getBodyParts();

  return (
    <section className="home-picker">
      <div className="home-intro">
        <div>
          <h1>哪裡不舒服？</h1>
          <p>點選身體部位，快速找到建議掛號科別</p>
        </div>
      </div>

      <div className="home-body-layout">
        <div className="home-figure-panel" aria-label="人體部位示意圖">
          <Image
            src="/images/body-realistic.png"
            alt="仿真人體正面部位示意圖"
            width={1024}
            height={1536}
            priority
            className="home-figure-image"
          />
          {bodyParts.map((part) => {
            const hotspot = hotspots[part.imageKey];

            if (!hotspot) {
              return null;
            }

            return (
              <Link
                key={`${part.id}-hotspot`}
                href={`/body-part/${part.slug}`}
                className="body-hotspot"
                style={{
                  top: hotspot.top,
                  left: hotspot.left,
                  width: hotspot.width,
                  height: hotspot.height
                }}
                aria-label={`查看${part.name}相關資訊`}
                title={part.name}
              />
            );
          })}
          {bodyParts.map((part) => {
            const marker = markers[part.imageKey];

            if (!marker) {
              return null;
            }

            return (
              <Link
                key={part.id}
                href={`/body-part/${part.slug}`}
                className="body-marker"
                style={{ top: marker.top, left: marker.left }}
                aria-label={`查看${part.name}相關症狀`}
              >
                <span>{part.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="home-part-grid">
          {bodyParts.map((part) => (
            <Link key={part.id} href={`/body-part/${part.slug}`} className="home-part-card">
              <div>{part.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
