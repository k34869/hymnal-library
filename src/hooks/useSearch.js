import { Document } from "flexsearch";
import { data } from "../assets/json/db.json";

const index = new Document({
  document: {
    id: "id",
    index: ["name", "description"],
    store: ["name", "description", "category", "path", "type"],
  },
  tokenize: "full",
  encode: (str) =>
    str
      .trim()
      .toLowerCase()
      .split(/[\p{Z}\p{S}\p{P}\p{C}]+/u),
  resolution: 9,
});

for (const item of data) {
  requestIdleCallback(() => {
    index.add(item);
  });
}

function search(query, field = ["name", "description"], isHighlight = true) {
  const maps = {};
  const results = index.search(query, {
    limit: 24,
    enrich: true,
  });
  const reg = new RegExp(`(${query})`, "gi");
  for (const item of results) {
    if (field.includes(item.field)) {
      for (const e of item.result) {
        if (!maps[e.id]) {
          maps[e.id] = Object.assign({}, e.doc);
        }
        maps[e.id].id = e.id;
        maps[e.id].name = isHighlight
          ? e.doc.name.replace(reg, `<span class="mark">$1</span>`)
          : e.doc.name;
        maps[e.id].description = isHighlight
          ? e.doc.description.replace(reg, `<span class="mark">$1</span>`)
          : e.doc.description;
      }
    }
  }
  return Object.values(maps);
}

export { search, data };
