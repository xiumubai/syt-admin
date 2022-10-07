import { useTranslation } from "react-i18next";

/*
  1. 使用组件
   <Translation a="a" b="b">ccc</Translation>

  2. 对于Translation组件来说，就会接受到属性props
    这个props会通过组件函数的参数传入
    接受到的参数：
      {
        a: 'a',
        b: 'b',
        children: 'ccc'
      }
*/
// interface TranslationProps {
//   ns: string;
//   children: string;
// }
// export default function Translation({ ns, children }: TranslationProps) {
//   // ns 是命名空间, 代表使用语言包中哪个文件
//   // children 代表组件标签包裹的内容
//   const { t } = useTranslation(ns);
//   return <span>{t(children)}</span>;
// }

interface TranslationProps {
  children: string;
}
export default function Translation({ children }: TranslationProps) {
  // children 代表组件标签包裹的内容
  const { t } = useTranslation();
  return <span>{t(children)}</span>;
}
