import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req: any, res: any) {
  const url = "https://cyrillehounvio.com/";
  // const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content") || "";

    res.status(200).json({ title, description });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
}
