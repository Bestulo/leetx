import fullDetailsSearch from "./mod.ts";

const search = await fullDetailsSearch("ubuntu iso");
const names = search.map((t) => t.name);
console.log({ names });
