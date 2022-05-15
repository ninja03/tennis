/** @jsx h */
import { h, jsx, json, serve, ConnInfo, PathParams } from "https://deno.land/x/sift@0.5.0/mod.ts";

let score = [0, 0];

function getScore() {
  return json({ score });
}

function addPoint(request: Request, connInfo: ConnInfo, params: PathParams) {
  if (params == null || params.id == undefined) {
    return new Response();
  }
  const n = parseInt(params.id);
  score[n]++;
  if (score[n] >= 5) {
    score = [0, 0];
  }
  return new Response();
}

function home() {
  return jsx(
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <script src="https://cdn.tailwindcss.com/3.0.24"></script>
        <script defer src="https://unpkg.com/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>
        <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <script defer src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
        <title></title>
      </head>
      <body
        className="bg-yellow-100 flex h-screen"
        x-data={`{
          score: ${JSON.stringify(score)},

          init() {
            const URL = "https://zztyzwzbexwbjnryjcoe.supabase.co/storage/v1/object/public/tennis/";
            this.snd = {};
            for (let a of ["0", "1", "2", "3", "4", "all"]) {
              this.snd[a] = new Howl({
                src: [URL + a + ".mp3"],
                preload: true,
                autoUnlock: true
              });
            }
            setInterval(async () => await this.update(), 1000);
          },

          async update() {
            const data = (await axios.get('/score')).data;
            if (this.score[0] != data.score[0] || this.score[1] != data.score[1]) {
              this.score = data.score;
              this.speak();
            }
          },

          speak() {
            const audio = this.snd[this.score[0]];
            audio.play();
            audio.once("end", () => {
              if (this.score[0] == this.score[1]) {
                this.snd["all"].play();
              } else {
                this.snd["" + this.score[1]].play();
              }
            });
          },

          async addScore(n) {
            await axios.post('/add/' + n);
            await update();
          }
        }`}>
        <div class="m-auto" style="font-size: 80vmin">
          <span x-text="score[0]" x-on:click="addScore(0)"></span>:
          <span x-text="score[1]" x-on:click="addScore(1)"></span>
        </div>
      </body>
    </html>
  );
}

serve({
  "/score": getScore,
  "/add/:id": addPoint,
  "/": home
});
