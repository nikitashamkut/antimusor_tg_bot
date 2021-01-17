import fetch from "node-fetch";

export async function getPath(id, ctx) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getFile?file_id=${id}`
  )
    .then((res) => res.json())
    .then(({ result }) => {
      ctx.wizard.state.photo.path = result.file_path;
    });
}
