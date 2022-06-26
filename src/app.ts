import $ from "cash-dom";
const examples = [
  { id: "example-1", import: () => import("./example-1") },
  { id: "example-2", import: () => import("./example-2") },
];

const id =
  new URL(window.location.href).searchParams.get("id") ||
  examples[examples.length - 1].id;

const nav = $("<nav>").css({
  position: "fixed",
  zIndex: "1000",
  inset: "0",
  display: "flex",
  flexDirection: "column",
  width: "100px",
  padding: "0.5rem",
  gap: "0.3rem",
});

for (const ex of examples) {
  if (ex.id == id) ex.import();
  nav.append(
    $("<a>")
      .attr({
        href: `?id=${ex.id}`,
      })
      .text(ex.id)
      .css({
        border: "none",
        padding: "0.25rem 0.75rem",
        borderRadius: "0.25rem",
        backgroundColor: ex.id == id ? "#ebb2e1" : "#FFFFFF",
      })
  );
}

$("body").append(nav);
