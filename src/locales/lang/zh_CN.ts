import { getFilesContent } from "../helper";

const langs = require.context("./zh_CN", true, /\.ts$/);

export default getFilesContent(langs);
