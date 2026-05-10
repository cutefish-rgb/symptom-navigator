import Image from "next/image";
import Link from "next/link";
import { getBodyParts } from "@/lib/data";

const markers: Record<string, { top: string; left: string }> = {
  head: { top: "12%", left: "50%" },
  face: { top: "18%", left: "61%" },
  eyes: { top: "15%", left: "50%" },
  ears: { top: "15%", left: "37%" },
  nose: { top: "18%", left: "50%" },
  mouth: { top: "21%", left: "58%" },
  neck: { top: "24%", left: "42%" },
  throat: { top: "23%", left: "50%" },
  shoulders: { top: "29%", left: "31%" },
  chest: { top: "33%", left: "50%" },
  breast: { top: "37%", left: "61%" },
  abdomen: { top: "47%", left: "50%" },
  back: { top: "38%", left: "70%" },
  arms: { top: "43%", left: "28%" },
  hands: { top: "56%", left: "26%" },
  hips: { top: "55%", left: "63%" },
  groin: { top: "58%", left: "50%" },
  legs: { top: "72%", left: "43%" },
  feet: { top: "88%", left: "56%" },
  joints: { top: "66%", left: "36%" },
  skin: { top: "74%", left: "66%" },
  urinary: { top: "57%", left: "50%" },
  liver: { top: "43%", left: "44%" },
  blood: { top: "49%", left: "64%" },
  heart: { top: "34%", left: "43%" },
  neuro: { top: "11%", left: "62%" },
  ortho: { top: "63%", left: "24%" },
  mental: { top: "9%", left: "35%" },
  endocrine: { top: "26%", left: "58%" },
  women: { top: "59%", left: "39%" },
  child: { top: "78%", left: "29%" },
  dental: { top: "20%", left: "42%" },
  infection: { top: "68%", left: "61%" },
  respiratory: { top: "30%", left: "58%" },
  kidney: { top: "46%", left: "35%" },
  rectal: { top: "64%", left: "50%" },
  allergy: { top: "72%", left: "76%" },
  sleep: { top: "8%", left: "50%" },
  male: { top: "62%", left: "59%" },
  nutrition: { top: "50%", left: "39%" }
};

const hotspots: Record<string, { top: string; left: string; width: string; height: string }> = {
  head: { top: "9%", left: "42%", width: "16%", height: "12%" },
  face: { top: "13%", left: "43%", width: "14%", height: "8%" },
  eyes: { top: "13%", left: "44%", width: "12%", height: "4%" },
  ears: { top: "13%", left: "34%", width: "32%", height: "6%" },
  nose: { top: "15%", left: "46%", width: "8%", height: "5%" },
  mouth: { top: "19%", left: "45%", width: "10%", height: "4%" },
  neck: { top: "21%", left: "42%", width: "16%", height: "6%" },
  throat: { top: "21%", left: "44%", width: "12%", height: "5%" },
  shoulders: { top: "25%", left: "29%", width: "42%", height: "8%" },
  chest: { top: "28%", left: "37%", width: "26%", height: "13%" },
  breast: { top: "32%", left: "36%", width: "28%", height: "9%" },
  abdomen: { top: "41%", left: "39%", width: "22%", height: "14%" },
  back: { top: "29%", left: "64%", width: "13%", height: "20%" },
  arms: { top: "32%", left: "24%", width: "52%", height: "24%" },
  hands: { top: "50%", left: "21%", width: "58%", height: "11%" },
  hips: { top: "52%", left: "36%", width: "28%", height: "11%" },
  groin: { top: "55%", left: "42%", width: "16%", height: "8%" },
  legs: { top: "62%", left: "34%", width: "32%", height: "24%" },
  feet: { top: "84%", left: "32%", width: "36%", height: "9%" },
  joints: { top: "58%", left: "30%", width: "40%", height: "16%" },
  skin: { top: "64%", left: "60%", width: "14%", height: "22%" },
  urinary: { top: "52%", left: "42%", width: "16%", height: "10%" },
  liver: { top: "38%", left: "39%", width: "16%", height: "10%" },
  blood: { top: "34%", left: "35%", width: "30%", height: "45%" },
  heart: { top: "30%", left: "39%", width: "12%", height: "9%" },
  neuro: { top: "9%", left: "42%", width: "16%", height: "12%" },
  ortho: { top: "57%", left: "25%", width: "50%", height: "30%" },
  mental: { top: "8%", left: "39%", width: "22%", height: "16%" },
  endocrine: { top: "24%", left: "40%", width: "20%", height: "20%" },
  women: { top: "52%", left: "38%", width: "24%", height: "13%" },
  child: { top: "66%", left: "28%", width: "44%", height: "22%" },
  dental: { top: "18%", left: "44%", width: "12%", height: "5%" },
  infection: { top: "35%", left: "34%", width: "32%", height: "46%" },
  respiratory: { top: "27%", left: "38%", width: "24%", height: "13%" },
  kidney: { top: "43%", left: "34%", width: "32%", height: "13%" },
  rectal: { top: "61%", left: "43%", width: "14%", height: "7%" },
  allergy: { top: "13%", left: "35%", width: "30%", height: "72%" },
  sleep: { top: "6%", left: "39%", width: "22%", height: "16%" },
  male: { top: "55%", left: "42%", width: "18%", height: "10%" },
  nutrition: { top: "39%", left: "37%", width: "26%", height: "19%" }
};

export default async function HomePage() {
  const bodyParts = await getBodyParts();

  return (
    <section className="home-picker">
      <div className="home-intro">
        <div>
          <p className="developer-credit">Developer: Cutefish</p>
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
