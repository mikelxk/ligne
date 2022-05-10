import { parse } from "std/flags/mod.ts";
const args = parse(Deno.args);
const room = args.room as number;
const interval: number = args.interval || 1000;
if (!room) {
  console.error("Please provide a room name");
  Deno.exit(1);
}
const getInfo = async () => {
  const resp = await fetch(`https://open.douyucdn.cn/api/RoomApi/room/${room}`);
  const arr = await resp.json();
  const isOnline = arr.data.online == 1;
  const owner = arr.data.owner_name;
  return { owner, isOnline };
};
const firstInfo = await getInfo();
console.log(`You are monitoring ${firstInfo.owner}'s room`);
if (!firstInfo.isOnline) {
  console.log(`You will be notified as it become online$`);
  setInterval(async () => {
    const info = await getInfo();
    if (info.isOnline) {
      console.log(`${info.owner} is online now`);
      Deno.exit(0);
    }
  });
}
