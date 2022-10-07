export const getFilesContent = (langs: __WebpackModuleApi.RequireContext) => {
  const content: Record<string, any> = {};

  langs.keys().forEach((key: string) => {
    const langFileModule = langs(key).default;
    const filename = key.slice(2, -3);
    content[filename] = langFileModule;
  });

  return content;
};
