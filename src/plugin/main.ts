import { on, showUI } from "@create-figma-plugin/utilities";

export default function () {
  on("RESIZE_WINDOW", function (windowSize: { width: number; height: number }) {
    const { width, height } = windowSize;
    figma.ui.resize(width, height);
  });

  showUI({
    height: 500,
    width: 500,
  });
}
