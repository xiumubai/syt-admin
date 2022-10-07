import { getFilesContent } from "../helper";

const langs = require.context("./en_US", true, /\.ts$/);

export default getFilesContent(langs);
